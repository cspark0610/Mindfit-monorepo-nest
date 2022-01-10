import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { CoachAgenda } from './coachAgenda.model';

@Entity()
@ObjectType()
export class CoachAgendaDay {
  @Field(() => Number)
  id: number;

  // @Field(() => CoachAgenda)
  // @BelongsTo(() => CoachAgenda, 'coachAgendaId')
  // coachAgenda: CoachAgenda;

  @Field(() => Date)
  @Column({ nullable: false })
  day: Date;

  @Field(() => String)
  @Column({ nullable: false })
  availableHours: string;

  @Field(() => Boolean)
  @Column({ nullable: false })
  exclude: boolean;
}
