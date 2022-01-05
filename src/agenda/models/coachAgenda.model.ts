import { Field, ObjectType } from '@nestjs/graphql';
import { BelongsTo, Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Coach } from '../../coaching/models/coach.model';
import { CoachAgendaDay } from './coachAgendaDay.model';
import { CoachAppointment } from './coachAppointment.model';

@Table
@ObjectType()
export class CoachAgenda extends Model {
  @Field(() => Number)
  id: number;

  @Field(() => Coach)
  @BelongsTo(() => Coach, 'coachId')
  coach: Coach;

  @Field(() => [CoachAgendaDay])
  @HasMany(() => CoachAgendaDay, 'coachAgendaDayID')
  coachAgendaDays: CoachAgendaDay[];

  @Field(() => [CoachAppointment])
  @HasMany(() => CoachAppointment, 'coachAppointmentId')
  coachAppointments: CoachAppointment[];

  @Field(() => Date)
  @Column
  avalilabilityRange: string;

  // {
  //   "Monday":[
  //     {
  //     "from":"8:00",
  //     "to": "12:00"
  //     }
  //   ],
  //   "Tuesday":[
  //     {
  //     "from":"8:00",
  //     "to": "12:00"
  //     }
  //   ]
  // }

  @Field(() => Boolean)
  @Column
  outOfService: boolean;
}
