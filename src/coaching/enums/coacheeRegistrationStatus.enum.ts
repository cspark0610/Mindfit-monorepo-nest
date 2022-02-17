import { registerEnumType } from '@nestjs/graphql';

export enum CoacheeRegistrationStatus {
  //No ha ingresado a cambiar la constraseña y acepta la invitacion
  INVITATION_PENDING = 'INVITATION_PENDING',
  // Acepto la invitación, pero la foto de perfil sigue por defecto (No obligatorio)
  PROFILE_UPDATE_PENDING = 'PROFILE_UPDATE_PENDING',
  // No ha realizado la prueba
  SAT_PENDING = 'SAT_PENDING',
  // Realizo la prueba pero no ha seleccionado un coach
  COACH_SELECTION_PENDING = 'COACH_SELECTION_PENDING',
  // Selecciono un coach, pero no tiene 1 cita por lo menos
  COACH_APPOINTMENT_PENDING = 'COACH_APPOINTMENT_PENDING',
  REGISTRATION_COMPLETED = 'REGISTRATION_COMPLETED',
}

registerEnumType(CoacheeRegistrationStatus, {
  name: 'CoacheeRegistrationStatus',
});
