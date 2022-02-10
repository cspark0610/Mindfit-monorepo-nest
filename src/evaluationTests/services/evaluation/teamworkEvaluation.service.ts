import { Injectable } from '@nestjs/common';
import { SatResultAreaObjectType } from 'src/evaluationTests/models/SatResultArea.model';
import { BasicEvaluationResult } from 'src/evaluationTests/interfaces/basicEvalutationResult.interface';
import { TeamWorkMatrix } from 'src/evaluationTests/interfaces/teamWorkMatrix.interface';
import { SectionCodenames } from 'src/evaluationTests/models/satBasicSection.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { BaseEvaluationService } from 'src/evaluationTests/services/evaluation/baseEvaluation.service';
import { SatBasicAnswersService } from 'src/evaluationTests/services/satBasicAnswer.service';
import { SatSectionResultsService } from 'src/evaluationTests/services/satSectionResult.service';

@Injectable()
export class TeamWorkEvaluationService extends BaseEvaluationService {
  constructor(
    private satBasicAnswersService: SatBasicAnswersService,
    private satSectionResultsService: SatSectionResultsService,
  ) {
    super();
  }
  /**
   * Iterar lo siguiente:
   *  1 Seleccionar las respuestas donde el orden de la pregunta tenga X Orden
   *  2 Ponderar el valor de las respuestas, de acuerdo a 10/cantidad de respuestas seleccionadas
   *  3 Acumular el valor resultante, a las dimensiones de las respuestas seleccionadas
   * Finalizada la iteracion por todas las preguntas de la seccion, sumar los valores acumulador para cada dimension
   */
  async getEvaluation(satReportId: number): Promise<SatResultAreaObjectType> {
    const sectionResult =
      await this.satSectionResultsService.getSectionResultsForEvaluation(
        satReportId,
        SectionCodenames.TEAMWORK,
      );

    const result: TeamWorkMatrix = {
      CW: [],
      CH: [],
      ME: [],
      PL: [],
      RI: [],
      TW: [],
      CF: [],
      SH: [],
    };

    await Promise.all(
      Object.keys(result).map(async (key: string, index: number) => {
        if (index == 7) {
          return;
        }
        result[key].push(
          await this.getEvaluationByOrder(sectionResult.questions, index + 1),
        );
      }),
    );

    return {
      area: sectionResult.section.title,
      areaCodeName: sectionResult.section.codename,
      puntuations: this.getDimensionEvaluation(result),
    };
  }

  async getEvaluationByOrder(
    reportQuestions: SatReportQuestion[],
    order: number,
  ): Promise<number> {
    const answersSelected =
      await this.satBasicAnswersService.getAnswersByQuestionOrder(
        reportQuestions.map((question) => question.id),
        order,
      );

    const answersValue = 10 / answersSelected.length;

    return answersValue;
  }

  getDimensionEvaluation(
    dimensionsResult: TeamWorkMatrix,
  ): BasicEvaluationResult[] {
    const puntuations = Object.entries(dimensionsResult).map(([key, value]) => {
      return {
        name: `${key}`,
        value: value.reduce((a, b) => a + b, 0),
        base: 20,
      };
    });
    return puntuations;
  }
}
