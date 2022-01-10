import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { CoachAppointment } from '../../agenda/models/coachAppointment.model';
import { Coach } from '../../coaching/models/coach.model';
import { Coachee } from '../../coaching/models/coachee.model';

@Entity()
@ObjectType()
export class CoachingSession {
  @Field(() => Number)
  id: number;

  // @Field(() => Coach)
  // @BelongsTo(() => Coach, 'coachId')
  // coach: Coach;

  // @Field(() => Coachee)
  // @BelongsTo(() => Coachee, 'coacheeId')
  // coachee: Coachee;

  // @Field(() => CoachAppointment)
  // @BelongsTo(() => CoachAppointment)
  // appointmentRelated: CoachAppointment;

  @Field(() => String)
  @Column({ nullable: true })
  name: string;

  @Field(() => String)
  @Column({ nullable: false })
  remarks: string;

  @Field(() => String)
  @Column({ nullable: false })
  area: string;

  @Field(() => String)
  @Column({ nullable: false })
  coachFeedback: string;

  @Field(() => String)
  @Column({ nullable: false })
  coachEvaluation: string;

  @Field(() => String)
  @Column({ nullable: false })
  coacheeFeedback: string;
}
