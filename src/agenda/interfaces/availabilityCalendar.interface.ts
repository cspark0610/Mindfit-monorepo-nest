import { HoursIntervalInterface } from './availabilityRange.interface';

export interface DayAvailabilityInterface {
  date: Date;
  availability: HoursIntervalInterface[];
}

export interface MonthAvailabilityInterface {
  month: number;
  days: DayAvailabilityInterface[];
}

// Final Object
// {
//   month: 1;
//   days: [
//     {
//       date: '14/02/2022',
//       availability: [
//         {
//           from: '9:00',
//           to: '11:00',
//         },
//         {
//           from: '13:00',
//           to: '18:00',
//         },
//       ],
//     },
//   ];
// }

/**
 * 9:00 - 11:00
 *
 * 10:00 - 10:30?
 *
 *  - libres:
 *  9:00 (inicio de la disponibilidad) - 10:00 (inicio cita)
 *  10:30 (find de la cita) - 11:00 (find de la disponibilidad).  [ { from: 10:30, to: 11}]
 *
 * 9:00 - 10:30
 *
 * [ ]
 *
 */

/**
 * POr cada cita, interar por cada bloque de horas disponibles
 *  Por cada hora disponible preguntas Esta la cita, dentro del rango de horas?
 *        Si: La fecha de inicio es menor o igual a la hora inicial
 *
 *          {
 * from: 9
 * to: hora de la cita 10.40
 * }
 */
