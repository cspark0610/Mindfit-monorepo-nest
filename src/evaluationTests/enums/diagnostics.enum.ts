import { registerEnumType } from '@nestjs/graphql';

export enum DiagnosticsEnum {
  OUTSTANGIND_COMMUNICATION = 'OUTSTANGIND_COMMUNICATION',
  BELOW_AVEGARE_COMMUNICATION = 'BELOW_AVEGARE_COMMUNICATION',
  LOW_SKILL_COMMUNICATION = 'LOW_SKILL_COMMUNICATION',
  IN_AVERAGE_OF_SOME_COMMUNICATION_SKILL = 'IN_AVERAGE_OF_SOME_COMMUNICATION_SKILL',
  LOW_AVERAGE_OF_SOME_COMMUNICATION_SKILL = 'LOW_AVERAGE_OF_SOME_COMMUNICATION_SKILL',
  HIGH_TRANSFORMATIONAL_LEADERSHIP = 'HIGH_TRANSFORMATIONAL_LEADERSHIP',
  SOME_TRANSFORMATIONAL_LEADERSHIP = 'SOME_TRANSFORMATIONAL_LEADERSHIP',
  HIGH_TRANSACTIONAL_LEADERSHIP = 'HIGH_TRANSACTIONAL_LEADERSHIP',
  SOME_TRANSACTIONAL_LEADERSHIP = 'SOME_TRANSACTIONAL_LEADERSHIP',
  HIGH_CORRECTIVE_LEADERSHIP = 'HIGH_CORRECTIVE_LEADERSHIP',
  SOME_CORRECTIVE_LEADERSHIP = 'SOME_CORRECTIVE_LEADERSHIP',
  ABOVE_AVERAGE_PERCEPTION_OF_LIFE = 'ABOVE_AVERAGE_PERCEPTION_OF_LIFE',
  IN_AVERAGE_PERCEPTION_OF_LIFE = 'IN_AVERAGE_PERCEPTION_OF_LIFE',
  LOW_AVERAGE_PERCEPTION_OF_LIFE = 'LOW_AVERAGE_PERCEPTION_OF_LIFE',
  ABOVE_AVERAGE_EXPERIENCE_OF_LIFE = 'ABOVE_AVERAGE_EXPERIENCE_OF_LIFE',
  IN_AVERAGE_EXPERIENCE_OF_LIFE = 'IN_AVERAGE_EXPERIENCE_OF_LIFE',
  LOW_AVERAGE_EXPERIENCE_OF_LIFE = 'LOW_AVERAGE_EXPERIENCE_OF_LIFE',
  ABOVE_AVERAGE_JOY_STATE = 'ABOVE_AVERAGE_JOY_STATE',
  IN_AVERAGE_JOY_STATE = 'IN_AVERAGE_JOY_STATE',
  LOW_AVERAGE_JOY_STATE = 'LOW_AVERAGE_EXPERIENCE_OF_LIFE',
  ABOVE_AVERAGE_ANGER_STATE = 'ABOVE_AVERAGE_ANGER_STATE',
  IN_AVERAGE_ANGER_STATE = 'IN_AVERAGE_ANGER_STATE',
  LOW_AVERAGE_ANGER_STATE = 'LOW_AVERAGE_ANGER_STATE',
  ABOVE_AVERAGE_ANXIETY_STATE = 'ABOVE_AVERAGE_ANXIETY_STATE',
  IN_AVERAGE_ANXIETY_STATE = 'IN_AVERAGE_ANXIETY_STATE',
  LOW_AVERAGE_ANXIETY_STATE = 'LOW_AVERAGE_ANXIETY_STATE',
  ABOVE_AVERAGE_SADNESS_STATE = 'ABOVE_AVERAGE_SADNESS_STATE',
  IN_AVERAGE_SADNESS_STATE = 'IN_AVERAGE_SADNESS_STATE',
  LOW_AVERAGE_SADNESS_STATE = 'LOW_AVERAGE_SADNESS_STATE',
  ABOVE_AVERAGE_POSITIVE_EMOTIONS = 'ABOVE_AVERAGE_POSITIVE_EMOTIONS',
  IN_AVERAGE_POSITIVE_EMOTIONS = 'IN_AVERAGE_POSITIVE_EMOTIONS',
  LOW_AVERAGE_POSITIVE_EMOTIONS = 'LOW_AVERAGE_POSITIVE_EMOTIONS',
  ABOVE_AVERAGE_NEGATIVE_EMOTIONS = 'ABOVE_AVERAGE_NEGATIVE_EMOTIONS',
  IN_AVERAGE_NEGATIVE_EMOTIONS = 'IN_AVERAGE_NEGATIVE_EMOTIONS',
  LOW_AVERAGE_NEGATIVE_EMOTIONS = 'LOW_AVERAGE_NEGATIVE_EMOTIONS',
  ABOVE_AVERAGE_PHYSICAL_ACTIVITY = 'ABOVE_AVERAGE_PHYSICAL_ACTIVITY',
  LOW_AVERAGE_PHYSICAL_ACTIVITY = 'LOW_AVERAGE_PHYSICAL_ACTIVITY',
  ABOVE_AVERAGE_DIET = 'ABOVE_AVERAGE_DIET',
  LOW_AVERAGE_DIET = 'LOW_AVERAGE_DIET',
  ABOVE_AVERAGE_REST_AND_SLEEP = 'ABOVE_AVERAGE_REST_AND_SLEEP',
  LOW_AVERAGE_REST_AND_SLEEP = 'LOW_AVERAGE_REST_AND_SLEEP',
  ABOVE_AVERAGE_MENTAL_RELAXATION = 'ABOVE_AVERAGE_MENTAL_RELAXATION',
  LOW_AVERAGE_MENTAL_RELAXATION = 'LOW_AVERAGE_MENTAL_RELAXATION',
  ABOVE_AVERAGE_PERSONAL_AND_PROFESIONAL_BALANCE = 'ABOVE_AVERAGE_PERSONAL_AND_PROFESIONAL_BALANCE',
  LOW_AVERAGE_PERSONAL_AND_PROFESIONAL_BALANCE = 'LOW_AVERAGE_PERSONAL_AND_PROFESIONAL_BALANCE',
}
registerEnumType(DiagnosticsEnum, {
  name: 'DiagnosticsEnum',
});
