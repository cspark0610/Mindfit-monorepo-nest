import { Field, ObjectType } from '@nestjs/graphql';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';
import { DefaultFeedbackAnswer } from 'src/videoSessions/models/defaultFeedbackAnswer.model';
import { Feedback } from 'src/videoSessions/models/feedback.model';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class CoachingSessionFeedback {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => CoachingSession, { nullable: false })
  @OneToOne(
    () => CoachingSession,
    (coachingSession) => coachingSession.coachingSessionFeedback,
    { nullable: false },
  )
  @JoinColumn()
  coachingSession: CoachingSession;

  @Field(() => Feedback)
  @ManyToOne(() => Feedback, (feedback) => feedback.coachingSessionsFeedbacks)
  feedback: Feedback;

  @Field(() => [DefaultFeedbackAnswer], { nullable: true, defaultValue: [] })
  @Column({ type: 'json', nullable: true })
  coacheeFeedback: DefaultFeedbackAnswer[];

  @Field(() => [DefaultFeedbackAnswer], { nullable: true, defaultValue: [] })
  @Column({ type: 'json', nullable: true })
  coachFeedback: DefaultFeedbackAnswer[];
}
