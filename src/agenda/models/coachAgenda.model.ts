import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Coach } from '../../coaching/models/coach.model';
import { AvailabilityRangeInterface } from '../interfaces/availabilityRange.interface';
import { AvailabilityRangeObjectType } from './availabilityRange.model';
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
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  coach: Coach;

  @Field(() => [CoachAgendaDay], { nullable: true })
  @OneToMany(
    () => CoachAgendaDay,
    (coachAgendaDays) => coachAgendaDays.coachAgenda,
    { nullable: true, eager: true },
  )
  coachAgendaDays: CoachAgendaDay[];

  @Field(() => [CoachAppointment], { nullable: true })
  @OneToMany(
    () => CoachAppointment,
    (coachAppointments) => coachAppointments.coachAgenda,
    { nullable: true, eager: true },
  )
  coachAppointments: CoachAppointment[];

  @Field(() => AvailabilityRangeObjectType, { nullable: true })
  @Column({ nullable: true, type: 'json' })
  availabilityRange: AvailabilityRangeInterface;

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
  @Column({ nullable: false, default: false })
  outOfService: boolean;
}
