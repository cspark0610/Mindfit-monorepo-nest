import { Field, ObjectType } from '@nestjs/graphql';

import { CoachingSession } from '../../videoSessions/models/coachingSession.model';
import { Coachee } from '../..//coaching/models/coachee.model';
import { CoachAgenda } from './coachAgenda.model';
import { Coach } from 'src/coaching/models/coach.model';
import { Column, Entity } from 'typeorm';

@Entity()
@ObjectType()
export class CoachAppointment {
  @Field(() => Number)
  id: number;

  // @Field(() => CoachAgenda)
  // @BelongsTo(() => CoachAgenda, 'coachAgendaId')
  // coachAgenda: CoachAgenda;

  // @Field(() => Coachee)
  // @BelongsTo(() => Coachee, 'coacheeId')
  // coachee: Coachee;

  // @Field(() => Coach)
  // @BelongsTo(() => Coach)
  // coach: Coach;

  // @Field(() => CoachingSession)
  // @HasOne(() => CoachingSession)
  // coachingSession: CoachingSession;

  @Field(() => String)
  @Column({ nullable: false })
  title: string;

  @Field(() => Date)
  @Column({ nullable: false })
  date: Date;

  @Field(() => String)
  @Column({ nullable: false })
  remarks: string;

  @Field(() => Date)
  @Column({ nullable: false })
  coacheeConfirmation: Date;

  @Field(() => Date)
  @Column({ nullable: false })
  coachConfirmation: Date;

  @Field(() => Boolean)
  @Column({ nullable: false, default: false })
  accomplished: boolean;
}
