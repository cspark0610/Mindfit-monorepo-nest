import { Field, ObjectType } from '@nestjs/graphql';
import { TimeStampModel } from 'src/common/models/timeStampModel.model';
import { CoachingSessionFeedback } from 'src/videoSessions/models/coachingSessionFeedback.model';
import { FeedbackQuestion } from 'src/videoSessions/models/feedbackQuestion.model';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Feedback extends TimeStampModel {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => CoachingSessionFeedback)
  @OneToMany(
    () => CoachingSessionFeedback,
    (coachingSessionFeedback) => coachingSessionFeedback.feedback,
  )
  coachingSessionsFeedbacks: CoachingSessionFeedback;

  @Field(() => String)
  @Column({ nullable: false })
  title: string;

  @Field(() => String)
  @Column({ nullable: false })
  description: string;

  @Field(() => [FeedbackQuestion], { nullable: false, defaultValue: [] })
  @Column({ type: 'json', nullable: false })
  questions: FeedbackQuestion[];

  @Field(() => Boolean)
  @Column({ nullable: false, default: true })
  isActive: boolean;
}
