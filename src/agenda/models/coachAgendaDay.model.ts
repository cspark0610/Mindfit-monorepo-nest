import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HoursIntervalInterface } from '../interfaces/availabilityRange.interface';
import { HoursIntervalObjectType } from './availabilityRange.model';
import { CoachAgenda } from './coachAgenda.model';

@Entity()
@ObjectType()
export class CoachAgendaDay {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => CoachAgenda)
  @ManyToOne(() => CoachAgenda, (coachAgenda) => coachAgenda.coachAgendaDays)
  coachAgenda: CoachAgenda;

  @Field(() => Date)
  @Column({ nullable: false })
  day: Date;

  @Field(() => [HoursIntervalObjectType], { nullable: true })
  @Column({ nullable: true, type: 'json' })
  availableHours: HoursIntervalInterface[];

  @Field(() => Boolean)
  @Column({ nullable: false, default: false })
  exclude: boolean;
}
