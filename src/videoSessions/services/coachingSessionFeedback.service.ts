import { HttpStatus, Injectable } from '@nestjs/common';
//import { CoachingError } from 'src/coaching/enums/coachingErrors.enum';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { BaseService } from 'src/common/service/base.service';
import { getAverage } from 'src/evaluationTests/common/functions/common';
import { CoacheesSatisfaction } from 'src/organizations/models/dashboardStatistics/coacheesSatisfaction.model';
import { UsersService } from 'src/users/services/users.service';
import {
  CoacheeSessionFeedbackDto,
  CoachSessionFeedbackDto,
} from 'src/videoSessions/dto/coachingSessionFeedback.dto';
import { DefaultAnswerFeedbackDto } from 'src/videoSessions/dto/defaultFeedbackAnswer.dto';
import { CoachingSessionFeedbackErrors } from 'src/videoSessions/enums/coachingSessionFeedbackErrors.enum';
import { CoachingSessionFeedback } from 'src/videoSessions/models/coachingSessionFeedback.model';
import { Feedback } from 'src/videoSessions/models/feedback.model';
import { CoachingSessionFeedbackRepository } from 'src/videoSessions/repositories/coachingSessionFeedback.repository';
import { CoachingSessionService } from 'src/videoSessions/services/coachingSession.service';
import { FeedbackService } from 'src/videoSessions/services/feedback.service';
import { CoacheeErrors } from 'src/coaching/enums/coacheeErrors.enum';
import { CoachErrors } from 'src/coaching/enums/coachErrors.enum';

@Injectable()
export class CoachingSessionFeedbackService extends BaseService<CoachingSessionFeedback> {
  constructor(
    protected readonly repository: CoachingSessionFeedbackRepository,
    private userService: UsersService,
    private coachingSessionService: CoachingSessionService,
    private feedbackService: FeedbackService,
  ) {
    super();
  }

  validateFeedback(
    feedback: Feedback,
    userFeedback: DefaultAnswerFeedbackDto[],
  ) {
    if (feedback.questions.length != userFeedback.length) {
      throw new MindfitException({
        error: 'All questions must be answered.',
        errorCode:
          CoachingSessionFeedbackErrors.NOT_ALL_QUESTIONS_WERE_ANSWERED,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const feedbackQuestionCodenames = feedback.questions.map(
      (question) => question.codename,
    );
    const answersCodenames = userFeedback.map(
      (answer) => answer.questionCodename,
    );
    if (
      JSON.stringify(feedbackQuestionCodenames) !=
      JSON.stringify(answersCodenames)
    ) {
      throw new MindfitException({
        error: 'The answers given differ from the feedback questions..',
        errorCode: CoachingSessionFeedbackErrors.ANSWER_DIFFER_FROM_QUESTIONS,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  /**
   * Create or Update the CoachingSessionFeeback by a Coachee
   *  If coaching session is already rated, its returned, else
   *  a update or create is performed.
   */
  async coacheeCoachingSessionFeedback(
    userId: number,
    data: CoacheeSessionFeedbackDto,
  ): Promise<CoachingSessionFeedback> {
    const [user, coachingSession] = await Promise.all([
      this.userService.findOne(userId),
      this.coachingSessionService.findOne(data.coachingSessionId),
    ]);

    if (!coachingSession) {
      throw new MindfitException({
        error: 'Coaching Session does not exists',
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: 'Coaching Session does not exists',
      });
    }

    if (!user.coachee) {
      throw new MindfitException({
        error: 'You do not have a Coachee profile',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoacheeErrors.NO_COACHEE_PROFILE,
      });
    }

    if (coachingSession.coachee.id != user.coachee.id) {
      throw new MindfitException({
        error: 'Coachee not in Coaching Session.',
        errorCode: CoacheeErrors.COACHEE_NOT_IN_COACHING_SESSION,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    if (!coachingSession.appointmentRelated.accomplished) {
      throw new MindfitException({
        error: 'You cannot rate an unexecuted session.',
        errorCode: CoachingSessionFeedbackErrors.UNEXECUTED_COACHING_SESSION,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    if (coachingSession.coachingSessionFeedback?.coacheeFeedback) {
      throw new MindfitException({
        error: 'Session Already Rated.',
        errorCode: CoachingSessionFeedbackErrors.SESSION_ALREADY_RATED,
        statusCode: HttpStatus.BAD_REQUEST,
        extra: coachingSession.coachingSessionFeedback,
      });
    }

    const feedback = await this.feedbackService.findOne(data.feedbackId);
    this.validateFeedback(feedback, data.coacheeFeedback);

    //The coaching session feedback can be created by coach or coachee when they send their feedback
    if (coachingSession.coachingSessionFeedback) {
      return this.update(coachingSession.coachingSessionFeedback.id, {
        coacheeFeedback: data.coacheeFeedback,
      });
    } else {
      return this.create({
        coachingSession,
        feedback,
        coacheeFeedback: data.coacheeFeedback,
      });
    }
  }

  /**
   * Create or Update the CoachingSessionFeeback by a Coach
   *  If coaching session is already rated, its returned, else
   *  a update or create is performed.
   */
  async coachCoachingSessionFeedback(
    userId: number,
    data: CoachSessionFeedbackDto,
  ): Promise<CoachingSessionFeedback> {
    const [user, coachingSession] = await Promise.all([
      this.userService.findOne(userId),
      this.coachingSessionService.findOne(data.coachingSessionId),
    ]);

    if (!coachingSession) {
      throw new MindfitException({
        error: 'Coaching Session does not exists',
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: 'Coaching Session does not exists',
      });
    }

    if (!user.coach) {
      throw new MindfitException({
        error: 'You do not have a Coach profile',
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: CoachErrors.NO_COACH_PROFILE,
      });
    }

    if (coachingSession.coach.id != user.coach.id) {
      throw new MindfitException({
        error: 'Coach not in Coaching Session.',
        errorCode: CoachErrors.COACH_NOT_IN_COACHING_SESSION,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    if (coachingSession.coachingSessionFeedback?.coachFeedback) {
      throw new MindfitException({
        error: 'Session Already Rated.',
        errorCode: CoachingSessionFeedbackErrors.SESSION_ALREADY_RATED,
        statusCode: HttpStatus.BAD_REQUEST,
        extra: coachingSession.coachingSessionFeedback,
      });
    }

    if (!coachingSession.appointmentRelated.accomplished) {
      throw new MindfitException({
        error: 'You cannot rate an unexecuted session.',
        errorCode: CoachingSessionFeedbackErrors.UNEXECUTED_COACHING_SESSION,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const feedback = await this.feedbackService.findOne(data.feedbackId);
    this.validateFeedback(feedback, data.coachFeedback);

    //The coaching session feedback can be created by coach or coachee when they send their feedback
    if (coachingSession.coachingSessionFeedback) {
      return this.update(coachingSession.coachingSessionFeedback.id, {
        coachFeedback: data.coachFeedback,
      });
    } else {
      return this.create({
        coachingSession,
        feedback,
        coachFeedback: data.coachFeedback,
      });
    }
  }

  async getCoachingSessionFeedbackByCoacheesIds(
    coacheesId: number[],
  ): Promise<CoachingSessionFeedback[]> {
    return this.repository.getCoachingSessionFeedbackByCoacheesIds(coacheesId);
  }

  async getCoacheesCoachingSessionSatisfaction(
    coachingSessionFeedbacks: CoachingSessionFeedback[],
  ): Promise<CoacheesSatisfaction> {
    /**
     * The feeback model used between coaching Session feedback may change,
     *  so it is better to rely on the questions as such.
     */
    const questions = [
      ...new Set(
        coachingSessionFeedbacks
          .flatMap((sessionFeedback) => sessionFeedback.coacheeFeedback)
          .flatMap((coacheeFeedback) => coacheeFeedback.questionCodename),
      ),
    ];

    return {
      averageSatisfaction: getAverage(
        coachingSessionFeedbacks
          .flatMap((sessionFeedback) => sessionFeedback.coacheeFeedback)
          .flatMap((coacheeFeedback) => coacheeFeedback.value),
      ),

      sessionsSatisfaction: questions.map((question) => {
        return {
          questionCodename: question,

          value: getAverage(
            coachingSessionFeedbacks
              .flatMap((sessionFeedback) => sessionFeedback.coacheeFeedback)
              .filter(
                (coacheeFeedback) =>
                  coacheeFeedback.questionCodename === question,
              )
              .flatMap((coacheeFeedback) => coacheeFeedback.value),
          ),
        };
      }),
    };
  }
}
