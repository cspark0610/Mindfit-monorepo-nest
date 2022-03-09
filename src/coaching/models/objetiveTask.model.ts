import { Field, ObjectType } from '@nestjs/graphql';
import { CoacheeObjective } from 'src/coaching/models/coacheeObjective.model';
import { TimeStampModel } from 'src/common/models/timeStampModel.model';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class ObjectiveTask extends TimeStampModel {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => CoacheeObjective)
  @ManyToOne(
    () => CoacheeObjective,
    (CoacheeObjective) => CoacheeObjective.tasks,
    { nullable: false, onDelete: 'CASCADE' },
  )
  objective: CoacheeObjective;

  @Field()
  @Column({ nullable: false })
  title: string;

  @Field()
  @Column({ default: 1 })
  repetitions: number;

  @Field()
  @Column({ default: 0 })
  executions: number;
}
