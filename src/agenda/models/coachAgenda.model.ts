import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Coach } from '../../coaching/models/coach.model';
import { CoachAgendaDay } from './coachAgendaDay.model';
import { CoachAppointment } from './coachAppointment.model';

@Entity()
@ObjectType()
export class CoachAgenda {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Coach)
  @OneToOne(() => Coach, (coach) => coach.coachAgenda, {
    eager: true,
  })
  coach: Coach;

  @Field(() => [CoachAgendaDay])
  @OneToMany(
    () => CoachAgendaDay,
    (coachAgendaDays) => coachAgendaDays.coachAgenda,
  )
  coachAgendaDays: CoachAgendaDay[];

  @Field(() => [CoachAppointment])
  @OneToMany(
    () => CoachAppointment,
    (coachAppointments) => coachAppointments.coachAgenda,
  )
  coachAppointments: CoachAppointment[];

  @Field(() => Date)
  @Column({ nullable: false })
  availabilityRange: string;

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
