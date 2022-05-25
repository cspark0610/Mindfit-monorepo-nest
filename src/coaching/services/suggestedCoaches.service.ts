import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RejectSuggestedCoachesDto } from 'src/coaching/dto/suggestedCoaches.dto';
import { CoachingError } from 'src/coaching/enums/coachingErrors.enum';
import { SuggestedCoaches } from 'src/coaching/models/suggestedCoaches.model';
import { SuggestedCoachesRepository } from 'src/coaching/repositories/suggestedCoaches.repository';
import { CoachService } from 'src/coaching/services/coach.service';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { BaseService } from 'src/common/service/base.service';
import { CoreConfigService } from 'src/config/services/coreConfig.service';
import { SatReportsService } from 'src/evaluationTests/services/satReport.service';
import { CoachErrors } from 'src/coaching/enums/coachErrors.enum';
import { SatReport } from 'src/evaluationTests/models/satReport.model';

@Injectable()
export class SuggestedCoachesService extends BaseService<SuggestedCoaches> {
  constructor(
    protected readonly repository: SuggestedCoachesRepository,
    private satReportService: SatReportsService,
    @Inject(forwardRef(() => CoacheeService))
    private coacheeService: CoacheeService,
    private coachService: CoachService,
    private coreConfigService: CoreConfigService,
  ) {
    super();
  }

  async getRandomSuggestedCoaches(
    coacheeId: number,
  ): Promise<SuggestedCoaches> {
    const coachee = await this.coacheeService.findOne({
      id: coacheeId,
      relations: {
        ref: 'coachee',
        relations: [['coachee.user', 'user']],
      },
    });

    const satReport: SatReport =
      await this.satReportService.getLastSatReportByUser({
        userId: coachee.user.id,
        relations: {
          ref: 'satReport',
          relations: [
            ['satReport.suggestedCoaches', 'suggestedCoaches'],
            ['satReport.user', 'user'],
          ],
        },
      });

    const [maxSuggestions, maxCoachSuggested] = await Promise.all([
      this.coreConfigService.getMaxCoachesSuggestions(),
      this.coreConfigService.getMaxCoachesSuggestedByRequest(),
    ]);

    console.log(maxSuggestions);
    console.log(maxCoachSuggested);

    if (!satReport) {
      throw new MindfitException({
        error: 'You must first perform a SAT.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachingError.NO_SAT_REALIZED,
      });
    }

    // If user already has a suggestions its returned
    const previusNonRejectedSuggestion: SuggestedCoaches =
      await this.repository.getLastNonRejectedSuggestion({
        coacheeId: coachee.id,
        relations: {
          ref: 'suggestedCoaches',
          relations: [
            ['suggestedCoaches.coaches', 'coaches'],
            ['coaches.user', 'coachesUser'],
            ['coaches.coachingAreas', 'coachesCoachingAreas'],
            ['suggestedCoaches.coachee', 'coachee'],
            ['suggestedCoaches.satReport', 'satReport'],
          ],
        },
      });

    if (Array.isArray(previusNonRejectedSuggestion.coaches)) {
      return previusNonRejectedSuggestion;
    }

    const previusRejectedCoaches: SuggestedCoaches[] =
      await this.repository.getAllRejectedSuggestion({
        coacheeId: coacheeId,
        relations: {
          ref: 'suggestedCoaches',
          relations: [
            ['suggestedCoaches.coaches', 'coaches'],
            ['coaches.user', 'coachesUser'],
            ['coaches.coachingAreas', 'coachesCoachingAreas'],
            ['suggestedCoaches.coachee', 'coachee'],
            ['suggestedCoaches.satReport', 'satReport'],
          ],
        },
      });

    if (previusRejectedCoaches.length >= parseInt(maxSuggestions.value)) {
      throw new MindfitException({
        error:
          'Max Coach Suggestions Reached, please contact to Midnfit Support.',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachErrors.MAX_COACH_SUGGESTIONS_REACHED,
      });
    }

    const rejectedCoachesId = previusRejectedCoaches.flatMap(({ coaches }) =>
      coaches.map((coach) => coach.id),
    );

    const coaches = await this.coachService.getRandomInServiceCoaches(
      parseInt(maxCoachSuggested.value),
      rejectedCoachesId,
    );

    if (coaches.length < parseInt(maxCoachSuggested.value)) {
      throw new MindfitException({
        error: 'Not enough coaches.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: CoachErrors.NOT_ENOUGH_COACHES,
      });
    }

    return this.repository.create({ satReport, coachee, coaches });
  }

  async rejectSuggestedCoaches(
    data: RejectSuggestedCoachesDto,
  ): Promise<SuggestedCoaches> {
    const suggestion = await this.findOne({
      id: data.suggestedCoachesId,
    });

    if (!suggestion) {
      throw new MindfitException({
        error: 'Suggested Coaches does not exists.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: CoachErrors.NOT_ENOUGH_COACHES,
      });
    }
    if (suggestion.rejected) {
      return suggestion;
    }

    return this.update(data.suggestedCoachesId, {
      rejected: true,
      rejectionReason: data.rejectionReason,
    });
  }
}
