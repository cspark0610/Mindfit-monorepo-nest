import { Field, ObjectType } from '@nestjs/graphql';
import { BelongsTo, Column, HasMany, Model, Table } from 'sequelize-typescript';
import { Coach } from 'src/coaching/models/coach.model';
import { CoachAgendaDay } from './coachAgendaDay.model';

@Table
@ObjectType()
export class CoachAgenda extends Model {
  @Field(() => Coach)
  @BelongsTo(() => Coach, 'coachId')
  coach: Coach;

  @Field(() => [CoachAgendaDay])
  @HasMany(() => CoachAgendaDay)
  coachAgendaDays: CoachAgendaDay[];

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
