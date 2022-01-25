/**
 * 1 Recibir el reporte
 * 2 Iterar por cada seccion para que acorde al codename ejecutar la funcion
 * para evaluar y tener resultados
 * 3 Armar el objeto de resultado
 */

import {
  SatResultDto,
  SatResultPuntuationDto,
} from 'src/evaluationTests/dto/satResult.dto';
import { SectionCodenames } from 'src/evaluationTests/models/satBasicSection.model';
import { SatReport } from 'src/evaluationTests/models/satReport.model';
import { SatReportQuestion } from 'src/evaluationTests/models/satReportQuestion.model';
import { emotionalStateEvaluation } from './emotionalState';
import { happinessEvaluation } from './happiness';
import { leadershipEvaluation } from './leadership';
import { lifePurposeEvaluation } from './lifePurpose';
import { subordinateEvaluation } from './subordinate';

const codeNameAndFunctions = {
  SUBORDINATE: (
    reportQuestions: SatReportQuestion[],
  ): SatResultPuntuationDto[] => subordinateEvaluation(reportQuestions),
  LEADERSHIP: (
    reportQuestions: SatReportQuestion[],
  ): SatResultPuntuationDto[] => leadershipEvaluation(reportQuestions),
  TEAMWORK: () => null,
  EMOTIONAL_STATE: (
    reportQuestions: SatReportQuestion[],
  ): SatResultPuntuationDto[] => emotionalStateEvaluation(reportQuestions),
  LIFE_PURPOSE: (
    reportQuestions: SatReportQuestion[],
  ): SatResultPuntuationDto[] => lifePurposeEvaluation(reportQuestions),
  HAPPINESS: (reportQuestions: SatReportQuestion[]): SatResultPuntuationDto[] =>
    happinessEvaluation(reportQuestions),
  HEALT: () => null,
};

export const getSatResult = async (
  satReport: SatReport,
): Promise<SatResultDto> => {
  const result: SatResultDto = new SatResultDto();
  result.areas = [];
  // TODO Better error handling

  await Promise.all(
    satReport.sectionsResults.map((sectionResult) => {
      if (
        sectionResult.section.codename == SectionCodenames.GENERAL ||
        sectionResult.section.codename == SectionCodenames.GETTING_INTO_ACTION
      ) {
        return;
      }

      console.log(sectionResult.section.codename);

      const evaluationResult = codeNameAndFunctions[
        sectionResult.section.codename
      ](sectionResult.questions);

      result.areas.push({
        area: sectionResult.section.title,
        areaCodeName: sectionResult.section.codename,
        puntuations: evaluationResult,
      });
    }),
  );

  return result;
};
