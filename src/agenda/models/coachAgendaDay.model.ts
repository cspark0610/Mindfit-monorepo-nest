import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
  @Column({ nullable: false, unique: true })
  day: Date;

  @Field()
  @Column({ nullable: false })
  availableHours: string;

  @Field(() => Boolean)
  @Column({ nullable: false })
  exclude: boolean;
}
