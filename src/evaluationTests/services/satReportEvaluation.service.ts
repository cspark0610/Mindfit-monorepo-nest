import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { CoachingAreaService } from 'src/coaching/services/coachingArea.service';
import { getAverage } from 'src/evaluationTests/common/functions/common';
import { AnswerDimensions } from 'src/evaluationTests/enums/answerDimentions.enum';
import { SectionCodenames } from 'src/evaluationTests/enums/sectionCodenames.enum';
import { DimensionAverages } from 'src/evaluationTests/models/dimensionAverages.model';
import { SatBasicAnswer } from 'src/evaluationTests/models/satBasicAnswer.model';
import { SatReport } from 'src/evaluationTests/models/satReport.model';
import { SatResultAreaObjectType } from 'src/evaluationTests/models/SatResultArea.model';
import { EmotionalStateEvaluationService } from 'src/evaluationTests/services/evaluation/emotionalStateEvaluation.service';
import { HappinessEvaluationService } from 'src/evaluationTests/services/evaluation/happinessEvaluation.service';
import { HealtEvaluationService } from 'src/evaluationTests/services/evaluation/healtEvaluation.service';
import { LeadershipEvaluationService } from 'src/evaluationTests/services/evaluation/leadershipEvaluation.service';
import { LifePurposeEvaluationService } from 'src/evaluationTests/services/evaluation/lifePurposeEvaluation.service';
import { SubordinateEvaluationService } from 'src/evaluationTests/services/evaluation/subordinateEvaluation.service';
import { TeamWorkEvaluationService } from 'src/evaluationTests/services/evaluation/teamworkEvaluation.service';
import { SatReportsService } from 'src/evaluationTests/services/satReport.service';
import { SatReportQuestionsService } from 'src/evaluationTests/services/satReportQuestion.service';
import { DevelopmentAreas } from 'src/organizations/models/dashboardStatistics/developmentAreas.model';

@Injectable()
export class SatReportEvaluationService {
  constructor(
    private subordinateEvaluationService: SubordinateEvaluationService,
    private leadershipEvaluationService: LeadershipEvaluationService,
    private emotionalStateEvaluationService: EmotionalStateEvaluationService,
    private lifePurposeEvaluationService: LifePurposeEvaluationService,
    private happinessEvaluationService: HappinessEvaluationService,
    private teamworkEvaluationService: TeamWorkEvaluationService,
    private healtEvaluationService: HealtEvaluationService,
    private satReportQuestionService: SatReportQuestionsService,
    private coachingAreaService: CoachingAreaService,
    @Inject(forwardRef(() => SatReportsService))
    private satReportService: SatReportsService,
    @Inject(forwardRef(() => CoacheeService))
    private coacheeService: CoacheeService,
  ) {}

  async getSatResult(satReportId: number): Promise<SatResultAreaObjectType[]> {
    const result = await Promise.all([
      this.subordinateEvaluationService.getEvaluation(satReportId),
      this.leadershipEvaluationService.getEvaluation(satReportId),
      this.emotionalStateEvaluationService.getEvaluation(satReportId),
      this.lifePurposeEvaluationService.getEvaluation(satReportId),
      this.happinessEvaluationService.getEvaluation(satReportId),
      // this.teamworkEvaluationService.getEvaluation(satReportId),
      this.healtEvaluationService.getEvaluation(satReportId),
    ]);
    await this.assignCoacheeCoachingAreas(satReportId);
    return result;
  }

  /**
   * Return an array of Coaching Areas Codenames according to SatReport Answers Selected
   */
  getAreasByAnswersSelected(answersSelected: SatBasicAnswer[]) {
    const assignationAreasEnum = [];
    if (
      answersSelected.find(
        (answer) =>
          answer.answerDimension == AnswerDimensions.IMPROVE_TECH_SKILLS,
      )
    ) {
      assignationAreasEnum.push('DIGITAL_TRANSFORMATION', 'CAREER_DEVELOPMENT');
    }

    if (
      answersSelected.find(
        (answer) =>
          answer.answerDimension ==
          AnswerDimensions.IMPROVE_INTERPERSONAL_SKILLS,
      )
    ) {
      assignationAreasEnum.push('COMUNICATION', 'PERSONAL_RELATIONS');
    }
    if (
      answersSelected.find(
        (answer) =>
          answer.answerDimension ==
          AnswerDimensions.IMPROVE_INTRAPERSONAL_SKILLS,
      )
    ) {
      assignationAreasEnum.push(
        'EMOTIONAL_INTELLIGENCE',
        'RESILIENCE',
        'PERSONAL_DEVELOPMENT',
      );
    }

    if (
      answersSelected.find(
        (answer) =>
          answer.answerDimension == AnswerDimensions.IMPROVE_PRODUCTIVITY,
      )
    ) {
      assignationAreasEnum.push('PRODUCTIVITY', 'TIME_MAMANGEMENT');
    }
    if (
      answersSelected.find(
        (answer) =>
          answer.answerDimension == AnswerDimensions.IMPROVE_SOCIAL_RELATIONS,
      )
    ) {
      assignationAreasEnum.push('EMPOWERMENT', 'MULTICULTURAL_ENVIROMENT');
    }
    if (
      answersSelected.find(
        (answer) =>
          answer.answerDimension == AnswerDimensions.IMPROVE_LIVE_WORK_BALANCE,
      )
    ) {
      assignationAreasEnum.push('FAMILY', 'STREES');
    }
    if (
      answersSelected.find(
        (answer) =>
          answer.answerDimension == AnswerDimensions.IMPROVE_WORK_RELATIONS,
      )
    ) {
      assignationAreasEnum.push(
        'MULTICULTURAL_ENVIROMENT',
        'DIVERSITY_AND_INCLUSION',
        'TEAM_WORK',
      );
    }
    if (
      answersSelected.find(
        (answer) =>
          answer.answerDimension == AnswerDimensions.IMPROVE_LEADERSHIP,
      )
    ) {
      assignationAreasEnum.push(
        'LEADERSHIP',
        'TEAM_WORK',
        'CONFLICT_MANANGEMENT',
      );
    }
    if (
      answersSelected.find(
        (answer) =>
          answer.answerDimension ==
          AnswerDimensions.IMPROVE_COMMUNICATION_SKILLS,
      )
    ) {
      assignationAreasEnum.push(
        'COMUNICATION',
        'PERSONAL_RELATIONS',
        'EMPOWERMENT',
      );
    }
    return assignationAreasEnum;
  }

  /**
   * According to a SatReport, assign to a Coachee the coaching areas to work into
   */
  async assignCoacheeCoachingAreas(satReportId: number) {
    const evaluationAreas = [
      'IMPROVE_TECH_SKILLS',
      'IMPROVE_INTERPERSONAL_SKILLS',
      'IMPROVE_INTRAPERSONAL_SKILLS',
      'IMPROVE_PRODUCTIVITY',
      'IMPROVE_SOCIAL_RELATIONS',
      'IMPROVE_LIVE_WORK_BALANCE',
      'IMPROVE_WORK_RELATIONS',
      'IMPROVE_LEADERSHIP',
      'IMPROVE_COMMUNICATION_SKILLS',
    ];
    const answersSelected = (
      await this.satReportQuestionService.getReportQuestionsByAnswersDimention(
        satReportId,
        evaluationAreas,
      )
    ).flatMap((reportQuestion) => reportQuestion.answersSelected);

    const assignation = this.getAreasByAnswersSelected(answersSelected);

    const satReport = await this.satReportService.findOne(satReportId);
    const coachingAreas =
      await this.coachingAreaService.getManyCochingAreaByCodenames(assignation);

    await this.coacheeService.assignCoachingAreas(
      satReport.user.coachee,
      coachingAreas,
    );
  }

  getDimensionAveragesBySatReports(
    satReports: SatReport[],
    dimensionsToEvaluate?: SectionCodenames[],
  ): DimensionAverages[] {
    if (!dimensionsToEvaluate) {
      dimensionsToEvaluate = [
        SectionCodenames.SUBORDINATE,
        SectionCodenames.HEALT,
        SectionCodenames.HAPPINESS,
        SectionCodenames.EMOTIONAL_STATE,
        SectionCodenames.LIFE_PURPOSE,
      ];
    }
    const result = dimensionsToEvaluate.map((dimension) => ({
      dimension: dimension,
      average: getAverage(
        satReports
          .flatMap((satReport) => satReport?.result)
          .filter((result) => result?.areaCodeName === dimension)
          .flatMap((result) => result.puntuations)
          .flatMap((puntuation) => puntuation?.value || 0),
      ),
      base:
        satReports
          .flatMap((satReport) => satReport?.result)
          .find((result) => result?.areaCodeName === dimension)
          ?.puntuations?.at(0).base || 1,
    }));
    return result;
  }

  async getWeakAndStrongDimensionsBySatReports(
    satReports: SatReport[],
  ): Promise<DevelopmentAreas> {
    const dimensionsEvaluation: DevelopmentAreas = {
      strengths: [],
      weaknesses: [],
    };
    const dimensionAverages = this.getDimensionAveragesBySatReports(satReports);

    if (
      dimensionAverages.find(
        (evaluation) => evaluation.dimension === SectionCodenames.SUBORDINATE,
      )?.average > 4
    ) {
      dimensionsEvaluation.strengths.push(SectionCodenames.SUBORDINATE);
    } else {
      dimensionsEvaluation.weaknesses.push(SectionCodenames.SUBORDINATE);
    }

    if (
      dimensionAverages.find(
        (evaluation) =>
          evaluation.dimension === SectionCodenames.EMOTIONAL_STATE,
      )?.average > 8
    ) {
      dimensionsEvaluation.strengths.push(SectionCodenames.EMOTIONAL_STATE);
    } else {
      dimensionsEvaluation.weaknesses.push(SectionCodenames.EMOTIONAL_STATE);
    }

    if (
      dimensionAverages.find(
        (evaluation) => evaluation.dimension === SectionCodenames.HAPPINESS,
      )?.average > 4.5
    ) {
      dimensionsEvaluation.strengths.push(SectionCodenames.HAPPINESS);
    } else {
      dimensionsEvaluation.weaknesses.push(SectionCodenames.HAPPINESS);
    }

    if (
      dimensionAverages.find(
        (evaluation) => evaluation.dimension === SectionCodenames.LEADERSHIP,
      )?.average > 4
    ) {
      dimensionsEvaluation.strengths.push(SectionCodenames.LEADERSHIP);
    } else {
      dimensionsEvaluation.weaknesses.push(SectionCodenames.LEADERSHIP);
    }

    if (
      dimensionAverages.find(
        (evaluation) => evaluation.dimension === SectionCodenames.LIFE_PURPOSE,
      )?.average > 6
    ) {
      dimensionsEvaluation.strengths.push(SectionCodenames.LIFE_PURPOSE);
    } else {
      dimensionsEvaluation.weaknesses.push(SectionCodenames.LIFE_PURPOSE);
    }

    return dimensionsEvaluation;
  }
}
