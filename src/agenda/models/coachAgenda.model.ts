import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

import { Coach } from '../../coaching/models/coach.model';
import { CoachAgendaDay } from './coachAgendaDay.model';
import { CoachAppointment } from './coachAppointment.model';

@Entity()
@ObjectType()
export class CoachAgenda {
  @Field(() => Number)
  id: number;

  // @Field(() => Coach)
  // @BelongsTo(() => Coach)
  // coach: Coach;

  // @Field(() => [CoachAgendaDay])
  // @HasMany(() => CoachAgendaDay, 'coachAgendaDayID')
  // coachAgendaDays: CoachAgendaDay[];

  // @Field(() => [CoachAppointment])
  // @HasMany(() => CoachAppointment, 'coachAppointmentId')
  // coachAppointments: CoachAppointment[];

  @Field(() => Date)
  @Column({ nullable: false })
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
  @Column({ nullable: false })
  outOfService: boolean;
}
