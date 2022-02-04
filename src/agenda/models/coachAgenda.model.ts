import { Field, ObjectType } from '@nestjs/graphql';
import { CoachAgendaDay } from 'src/agenda/models/coachAgendaDay.model';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { Coach } from 'src/coaching/models/coach.model';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
