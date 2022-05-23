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
import { CoacheeErrors } from 'src/coaching/enums/coacheeErrors.enum';
import { FileMedia } from 'src/aws/models/file.model';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/users/models/users.model';
import { CoachingArea } from 'src/coaching/models/coachingArea.model';
import {
  validateIfCoachIdsIncludesHostUserId,
  validateIfDtoIncludesPictureOrVideo,
} from 'src/coaching/validators/coach.validators';
import {
  validateIfHostUserIdIsInUsersIdsToDelete,
  validateIfHostUserIdIsUserToDelete,
} from 'src/users/validators/users.validators';

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

  async create(coachData: CoachDto): Promise<Coach> {
    const data: Partial<Coach> = await CoachDto.from(coachData);
    let profilePicture: FileMedia;
    let profileVideo: FileMedia;

    if (coachData.picture) {
      profilePicture = this.awsS3Service.formatS3LocationInfo(
        coachData.picture.key,
      );
    }

    if (coachData.videoPresentation) {
      profileVideo = this.awsS3Service.formatS3LocationInfo(
        coachData.videoPresentation.key,
      );
    }
    return this.createCoachAndCoachAgenda({
      ...data,
      profilePicture,
      profileVideo,
    });
  }

  async createCoachAndCoachAgenda(data: Partial<Coach>): Promise<Coach> {
    const coach = await this.repository.create(data);
    if (coach) {
      await this.coachAgendaService.create({ coach, outOfService: true });
      return this.repository.findOneBy({ id: coach.id });
    }
  }

  async createManyCoach(coachData: CoachDto[]): Promise<Coach[]> {
    // NO SE PERMITE QUE SE PUEDAN NI SUBIR VIDEOS NI IMAGENES EN EL CREATE MANY
    coachData.forEach((dto) => {
      validateIfDtoIncludesPictureOrVideo(dto);
    });
    const data: Partial<Coach>[] = await CoachDto.fromArray(coachData);
    return super.createMany(data);
  }

  async updateCoach(session: UserSession, data: EditCoachDto): Promise<Coach> {
    const coach: Coach =
      await this.repository.getCoachByUserEmailWithoutRelations({
        email: session.email,
      });
    return this.updateCoachAndFile(coach, data);
  }

  async getCoachProfile(email: string, relations): Promise<Coach> {
    console.log(relations);
    return this.repository.getCoachByUserEmail({
      email: email.trim(),
      relations,
      // relations: {
      //   ref: Coach.name.toLowerCase(),
      //   relations: [
      //     ['coach.user', 'user'],
      //     ['coach.coachAgenda', 'coachAgenda'],
      //     ['coach.coachingAreas', 'coachingAreas'],
      //     ['coach.assignedCoachees', 'assignedCoachees'],
      //     ['assignedCoachees.user', 'assignedCoacheesUser'],
      //     ['assignedCoachees.organization', 'assignedCoacheesOrganization'],
      //     [
      //       'assignedCoachees.coachAppointments',
      //       'assignedCoacheesCoachAppointments',
      //     ],
      //     [
      //       'assignedCoacheesCoachAppointments.coachingSession',
      //       'assignedCoacheesCoachAppointmentsCoachingSession',
      //     ],
      //   ],
      // },
    });
  }

  async updateCoachById(id: number, data: EditCoachDto): Promise<Coach> {
    const coach: Coach = await this.repository.findOneBy({ id });
    return this.updateCoachAndFile(coach, data);
  }

  async updateCoachAndFile(coach: Coach, data: EditCoachDto): Promise<Coach> {
    let profilePicture: FileMedia = coach.profilePicture;
    let profileVideo: FileMedia = coach.profileVideo;

    if (data.picture) {
      if (coach.profilePicture)
        await this.awsS3Service.delete(coach.profilePicture.key);

      profilePicture = this.awsS3Service.formatS3LocationInfo(data.picture.key);
    }

    if (data.videoPresentation) {
      if (coach.profileVideo)
        await this.awsS3Service.delete(coach.profileVideo.key);

      profileVideo = this.awsS3Service.formatS3LocationInfo(
        data.videoPresentation.key,
      );
    }

    if (data?.coachingAreasId?.length) {
      const coachingAreasArray: Promise<CoachingArea>[] =
        data.coachingAreasId.map((id) =>
          Promise.resolve(
            this.coachingAreasService.findOneBy({ where: { id } }),
          ),
        );
      const coachingAreas: CoachingArea[] = await Promise.all(
        coachingAreasArray,
      );
      this.repository.assignCoachingAreasToCoach({ coach, coachingAreas });
    }

    return this.update(coach.id, { ...data, profilePicture, profileVideo });
  }

  async updateManyCoaches(
    session: UserSession,
    coachIds: number[],
    editCoachDto: EditCoachDto,
  ): Promise<Coach[]> {
    // EL SERVICIO NO COMTEMPLA PODER EDITAR LAS IMAGENES DE LOS COACHEE NI EDITARLOS DESDE S3
    const hostUser: User = await this.userService.findOne({
      id: session.userId,
    });
    validateIfCoachIdsIncludesHostUserId(coachIds, hostUser.id);
    validateIfDtoIncludesPictureOrVideo(editCoachDto);
    return this.repository.updateMany(coachIds, editCoachDto);
  }

  async deleteManyCoaches(
    session: UserSession,
    coachIds: number[],
  ): Promise<number> {
    const hostUser: User = await this.userService.findOne({
      id: session.userId,
    });
    const coaches = await Promise.all(
      coachIds.map((coachId) => this.findOne({ id: coachId })),
    );

    const usersIdsToDelete: number[] = coaches.map(
      (coachee) => coachee.user.id,
    );
    validateIfHostUserIdIsInUsersIdsToDelete(usersIdsToDelete, hostUser);
    return this.userService.delete(coachIds);
  }

  async deleteCoach(session: UserSession, coachId: number): Promise<number> {
    const [hostUser, coachToDelete] = await Promise.all([
      this.userService.findOne({
        id: session.userId,
      }),
      this.findOne({ id: coachId }),
    ]);

    const userToDelete: User = coachToDelete.user;

    validateIfHostUserIdIsUserToDelete(userToDelete, hostUser);
    return this.userService.delete(userToDelete.id);
  }

  async getHistoricalCoacheeData(
    session: UserSession,
    coacheeId: number,
  ): Promise<HistoricalCoacheeData> {
    const coach: Coach = await this.findOne({ id: session.userId });

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
    return this.historicalAssigmentService.getAllHistoricalAssigmentsByCoachId({
      session,
    });
  }

  async getCoachDashboardData(
    session: UserSession,
  ): Promise<CoachDashboardData> {
    const coach: Coach =
      await this.repository.getCoachByUserEmailWithoutRelations({
        email: session.email,
      });
    console.log(coach.id);

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
    return this.repository.getInServiceCoaches({ exclude });
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

  async getCoacheesRecentlyRegistered(coachId: number): Promise<Coachee[]> {
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
