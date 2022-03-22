import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CoachAgendaService } from 'src/agenda/services/coachAgenda.service';
import { CoachDto, EditCoachDto } from 'src/coaching/dto/coach.dto';
import { Coach } from 'src/coaching/models/coach.model';
import { CoachRepository } from 'src/coaching/repositories/coach.repository';
import { BaseService } from 'src/common/service/base.service';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { HistoricalCoacheeData } from 'src/coaching/models/historicalCoacheeData.model';
import { HistoricalAssigment } from 'src/coaching/models/historicalAssigment.model';
import { CoreConfigService } from 'src/config/services/coreConfig.service';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoachDashboardData } from 'src/coaching/models/coachDashboardData.model';
import { HistoricalAssigmentService } from 'src/coaching/services/historicalAssigment.service';
import { AwsS3Service } from 'src/aws/services/s3.service';
import { CoachingAreaService } from 'src/coaching/services/coachingArea.service';
import { CoachErrors } from 'src/coaching/enums/coachErrors.enum';
import { CoacheeErrors } from 'src/coaching/enums/coacheeErrors.enum';
import { FileMedia } from 'src/aws/models/file.model';
import { CoachingError } from 'src/coaching/enums/coachingErrors.enum';
import { imageFileFilter } from 'src/coaching/validators/mediaExtensions.validators';
import { videoFileFilter } from 'src/coaching/validators/mediaExtensions.validators';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/users/models/users.model';

@Injectable()
export class CoachService extends BaseService<Coach> {
  constructor(
    protected readonly repository: CoachRepository,
    @Inject(forwardRef(() => CoachAgendaService))
    private coachAgendaService: CoachAgendaService,
    @Inject(forwardRef(() => CoacheeService))
    private coacheeService: CoacheeService,
    private historicalAssigmentService: HistoricalAssigmentService,
    private coreConfigService: CoreConfigService,
    private awsS3Service: AwsS3Service,
    private coachingAreasService: CoachingAreaService,
    private userService: UsersService,
  ) {
    super();
  }
  validateImageExtension(filename: string): void {
    if (!imageFileFilter(filename)) {
      throw new MindfitException({
        error: 'Wrong media extension.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachingError.WRONG_MEDIA_EXTENSION,
      });
    }
  }

  validateVideoExtension(videoFilename: string): void {
    if (!videoFileFilter(videoFilename)) {
      throw new MindfitException({
        error: 'Wrong media extension.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachingError.WRONG_MEDIA_EXTENSION,
      });
    }
  }

  async create(coachData: CoachDto): Promise<Coach> {
    const data: Partial<Coach> = await CoachDto.from(coachData);
    let profilePicture: FileMedia;
    let profileVideo: FileMedia;

    if (coachData?.picture?.data?.length) {
      // solo envia una imagen
      const {
        picture: { filename, data: buffer },
      } = coachData;
      if (!imageFileFilter(filename)) {
        throw new MindfitException({
          error: 'Wrong media extension.',
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: CoachingError.WRONG_MEDIA_EXTENSION,
        });
      }
      profilePicture = await this.awsS3Service.uploadMedia(filename, buffer);
    }
    if (coachData?.videoPresentation?.data?.length) {
      // solo envia un video
      const {
        videoPresentation: { filename, data: buffer },
      } = coachData;
      if (!videoFileFilter(filename)) {
        throw new MindfitException({
          error: 'Wrong media extension.',
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: CoachingError.WRONG_MEDIA_EXTENSION,
        });
      }
      profileVideo = await this.awsS3Service.uploadMedia(filename, buffer);
    }
    return this.createCoachMethod({ ...data, profilePicture, profileVideo });
  }

  async createManyCoach(coachData: CoachDto[]): Promise<Coach[]> {
    // NO SE PERMITE QUE SE PUEDAN NI SUBIR VIDEOS NI IMAGENES EN EL CREATE MANY
    coachData.forEach((dto) => {
      if (dto.picture || dto.videoPresentation) {
        throw new MindfitException({
          error: 'You cannot create pictures nor video of coaches',
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: CoachingError.ACTION_NOT_ALLOWED,
        });
      }
    });
    const data: Partial<Coach>[] = await Promise.all(
      coachData.map(async (coach) => await CoachDto.from(coach)),
    );
    return this.repository.createMany(data);
  }

  async createCoachMethod(data: Partial<Coach>): Promise<Coach> {
    const coach = await this.repository.create(data);
    if (coach) {
      await this.coachAgendaService.create({ coach, outOfService: true });
      return this.repository.findOneBy({ id: coach.id });
    }
  }

  async updateCoach(session: UserSession, data: EditCoachDto): Promise<Coach> {
    const coach: Coach = await this.getCoachByUserEmail(session.email);
    return this.updateCoachAndFile(coach, data);
  }

  async getCoachByUserEmail(email: string): Promise<Coach> {
    return this.repository.getCoachByUserEmail(email.trim());
  }

  async updateCoachById(id: number, data: EditCoachDto): Promise<Coach> {
    const coach: Coach = await this.repository.findOneBy({ id });
    return this.updateCoachAndFile(coach, data);
  }

  async updateCoachAndFile(coach: Coach, data: EditCoachDto): Promise<Coach> {
    let profilePicture: FileMedia = coach.profilePicture;
    let profileVideo: FileMedia = coach.profileVideo;

    if (data.picture) {
      const { key } = coach.profilePicture;
      const {
        picture: { filename, data: buffer },
      } = data;
      this.validateImageExtension(filename);
      profilePicture = await this.awsS3Service.deleteAndUploadMedia(
        filename,
        buffer,
        key,
      );
    }

    if (data.videoPresentation) {
      const { key } = coach.profileVideo;
      const {
        videoPresentation: { filename: videoFilename, data: videoBuffer },
      } = data;
      this.validateVideoExtension(videoFilename);
      profileVideo = await this.awsS3Service.deleteAndUploadMedia(
        videoFilename,
        videoBuffer,
        key,
      );
    }
    return this.update(coach.id, { ...data, profilePicture, profileVideo });
  }

  async updateManyCoachee(
    session: UserSession,
    coachIds: number[],
    editCoachDto: EditCoachDto,
  ): Promise<Coach[]> {
    // EL SERVICIO NO COMTEMPLA PODER EDITAR LAS IMAGENES DE LOS COACHEE NI EDITARLOS DESDE S3
    const hostUser: User = await this.userService.findOne(session.userId);
    if (coachIds.includes(hostUser.id)) {
      throw new MindfitException({
        error: 'You cannot edit yourself as staff or super_user',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachingError.ACTION_NOT_ALLOWED,
      });
    }
    if (editCoachDto.picture || editCoachDto.videoPresentation) {
      throw new MindfitException({
        error: 'You cannot edit pictures nor videos of coaches',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachingError.ACTION_NOT_ALLOWED,
      });
    }
    return this.repository.updateMany(coachIds, editCoachDto);
  }

  async deleteManyCoachees(
    session: UserSession,
    coachIds: number[],
  ): Promise<number> {
    const hostUser: User = await this.userService.findOne(session.userId);
    const promiseCoachArray: Promise<Coach>[] = coachIds.map(async (coachId) =>
      Promise.resolve(await this.findOne(coachId)),
    );
    const coaches: Coach[] = await Promise.all(promiseCoachArray);
    const usersIdsToDelete: number[] = coaches.map(
      (coachee) => coachee.user.id,
    );

    if (usersIdsToDelete.includes(hostUser.id)) {
      throw new MindfitException({
        error: 'You cannot delete yourself as staff or super_user',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachingError.ACTION_NOT_ALLOWED,
      });
    }
    return this.userService.delete(coachIds);
  }

  async deleteCoach(session: UserSession, coachId: number): Promise<number> {
    const hostUser: User = await this.userService.findOne(session.userId);
    const coachToDelete: Coach = await this.findOne(coachId);
    const userToDelete: User = coachToDelete.user;

    if (userToDelete.id == hostUser.id) {
      throw new MindfitException({
        error: 'You cannot delete yourself as staff or super_user',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachingError.ACTION_NOT_ALLOWED,
      });
    }
    return this.userService.delete(userToDelete.id);
  }

  async getHistoricalCoacheeData(
    session: UserSession,
    coacheeId: number,
  ): Promise<HistoricalCoacheeData> {
    const coach: Coach = await this.findOne(session.userId);

    if (!coach) {
      throw new MindfitException({
        error: 'Coach does not exists.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachErrors.NOT_EXISTING_COACH,
      });
    }
    if (!coach.assignedCoachees.length) {
      throw new MindfitException({
        error: 'You do not have any coachees assigned.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoacheeErrors.NO_COACHEES_ASSIGNED,
      });
    }
    return this.coacheeService.getHistoricalCoacheeData(coach.id, coacheeId);
  }

  async getRandomInServiceCoaches(
    quantity: number,
    exclude?: number[],
  ): Promise<Coach[]> {
    const coaches = await this.getInServiceCoaches(exclude);
    return coaches.sort(() => 0.5 - Math.random()).slice(0, quantity);
  }

  async getHistoricalAssigment(
    session: UserSession,
  ): Promise<HistoricalAssigment[]> {
    return this.historicalAssigmentService.getAllHistoricalAssigmentsByCoachId(
      session,
    );
  }

  async getCoachDashboardData(
    session: UserSession,
  ): Promise<CoachDashboardData> {
    const coach: Coach = await this.getCoachByUserEmail(session.email);

    if (!coach) {
      throw new MindfitException({
        error: 'Coach does not exists.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachErrors.NOT_EXISTING_COACH,
      });
    }

    return {
      coacheesWithUpcomingAppointments:
        await this.getCoacheesWithUpcomingAppointments(coach.id),
      coacheesWithoutRecentActivity:
        await this.getCoacheesWithoutRecentActivity(coach.id),
      coacheesRecentlyRegistered: await this.getCoacheesRecentlyRegistered(
        coach.id,
      ),
    };
  }

  async getInServiceCoaches(exclude?: number[]): Promise<Coach[]> {
    return this.repository.getInServiceCoaches(exclude);
  }

  async getCoacheesWithUpcomingAppointments(
    coachId: number,
  ): Promise<Coachee[]> {
    const coacheesWithCoachAppointments: Coachee[] =
      await this.coacheeService.getCoacheesWithUpcomingAppointmentsByCoachId(
        coachId,
      );

    return coacheesWithCoachAppointments;
  }

  async getCoacheesRecentlyRegistered(coachId): Promise<Coachee[]> {
    const daysRecentRegistered: number =
      await this.coreConfigService.getDaysCoacheeRecentRegistered();
    return this.coacheeService.getCoacheesRecentlyRegistered(
      daysRecentRegistered,
      coachId,
    );
  }

  async getCoacheesWithoutRecentActivity(coachId: number) {
    const daysWithoutActivity: number =
      await this.coreConfigService.getDaysCoacheeWithoutActivity();
    return this.coacheeService.getCoacheesWithoutRecentActivity(
      daysWithoutActivity,
      coachId,
    );
  }
}
