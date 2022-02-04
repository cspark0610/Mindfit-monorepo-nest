import { Field, ObjectType } from '@nestjs/graphql';
import { CoachAgenda } from 'src/agenda/models/coachAgenda.model';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class CoachAgendaDay {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => CoachAgenda)
  @ManyToOne(() => CoachAgenda, (coachAgenda) => coachAgenda.coachAgendaDays, {
    eager: true,
  })
  coachAgenda: CoachAgenda;

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
