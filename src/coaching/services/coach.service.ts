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
import { CoachingError } from 'src/coaching/enums/coachingErrors.enum';
import { HistoricalAssigment } from 'src/coaching/models/historicalAssigment.model';
import { CoreConfigService } from 'src/config/services/coreConfig.service';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoachDashboardData } from 'src/coaching/models/coachDashboardData.model';
import { HistoricalAssigmentService } from 'src/coaching/services/historicalAssigment.service';
import { imageFileFilter } from 'src/coaching/validators/imageExtensions.validators';
import { AwsS3Service } from 'src/aws/services/s3.service';
import { S3UploadResult } from 'src/aws/interfaces/s3UploadResult.interface';
import { CoachingAreaService } from 'src/coaching/services/coachingArea.service';
import { CoachErrors } from 'src/coaching/enums/coachErrors.enum';
import { CoacheeErrors } from 'src/coaching/enums/coacheeErrors.enum';

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
  ) {
    super();
  }
  async create(coachData: CoachDto): Promise<Coach> {
    const data: Partial<Coach> = await CoachDto.from(coachData);

    if (coachData?.picture?.data?.length) {
      const {
        picture: { filename, data: buffer },
      } = coachData;

      if (!imageFileFilter(filename)) {
        throw new MindfitException({
          error: 'Wrong image extension.',
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: CoachingError.WRONG_IMAGE_EXTENSION,
        });
      }
      const s3Result: S3UploadResult = await this.awsS3Service.upload(
        Buffer.from(buffer),
        filename,
      );
      if (!s3Result) {
        throw new MindfitException({
          error: 'Error uploading image.',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          errorCode: CoachingError.ERROR_UPLOADING_IMAGE,
        });
      }
      const profilePicture = JSON.stringify({
        key: s3Result.key,
        location: s3Result.location,
      });
      return this.createCoachMethod({ ...data, profilePicture });
    }

    // caso en que no se adjunta una picture
    return this.createCoachMethod(data);
  }

  async createCoachMethod(data: Partial<Coach>): Promise<Coach> {
    const coach = await this.repository.create(data);
    if (coach) {
      await this.coachAgendaService.create({ coach, outOfService: true });
      return this.repository.findOneBy({ id: coach.id });
    }
  }

  async updateCoach(session: UserSession, data: EditCoachDto): Promise<Coach> {
    const coach: Coach = await this.findOne(session.userId);

    if (!coach) {
      throw new MindfitException({
        error: 'Coach does not exists.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachErrors.NOT_EXISTING_COACH,
      });
    }
    return this.repository.update(coach.id, data);
  }

  async updateCoachById(id: number, data: EditCoachDto): Promise<Coach> {
    const coach: Coach = await this.repository.findOneBy({ id });
    const coachData = await EditCoachDto.from(data);
    if (!coach) {
      throw new MindfitException({
        error: 'Coach does not exists.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachErrors.NOT_EXISTING_COACH,
      });
    }
    return this.repository.update(coach.id, coachData);
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
    const coach: Coach = await this.findOne(session.userId);

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
        await this.getCoacheesWithoutRecentActivity(),
      coacheesRecentlyRegistered: await this.getCoacheesRecentlyRegistered(),
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

  async getCoacheesRecentlyRegistered(): Promise<Coachee[]> {
    const daysRecentRegistered: number =
      await this.coreConfigService.getDaysCoacheeRecentRegistered();
    return this.coacheeService.getCoacheesRecentlyRegistered(
      daysRecentRegistered,
    );
  }

  async getCoacheesWithoutRecentActivity() {
    const daysWithoutActivity: number =
      await this.coreConfigService.getDaysCoacheeWithoutActivity();
    return this.coacheeService.getCoacheesWithoutRecentActivity(
      daysWithoutActivity,
    );
  }

  async updatCoachFile(
    session: UserSession,
    data: EditCoachDto,
  ): Promise<Coach> {
    const coach: Coach = await this.findOne(session.userId);

    if (!coach) {
      throw new MindfitException({
        error: 'Coach does not exists.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachErrors.NOT_EXISTING_COACH,
      });
    }
    if (data.picture && coach.profilePicture) {
      const {
        picture: { filename, data: buffer },
      } = data;
      if (!imageFileFilter(filename)) {
        throw new MindfitException({
          error: 'Wrong image extension.',
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: CoachingError.WRONG_IMAGE_EXTENSION,
        });
      }
      const { key } = JSON.parse(coach.profilePicture);
      const result = await this.awsS3Service.delete(key);
      if (result) {
        const s3Result: S3UploadResult = await this.awsS3Service.upload(
          Buffer.from(buffer),
          filename,
        );
        if (!s3Result) {
          throw new MindfitException({
            error: 'Error uploading image.',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            errorCode: CoachingError.ERROR_UPLOADING_IMAGE,
          });
        }
        const profilePicture = JSON.stringify({
          key: s3Result.key,
          location: s3Result.location,
        });
        return this.update(coach.id, { profilePicture });
      }
    }
  }
}
