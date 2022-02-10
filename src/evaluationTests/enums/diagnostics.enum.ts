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
}
registerEnumType(DiagnosticsEnum, {
  name: 'DiagnosticsEnum',
});
