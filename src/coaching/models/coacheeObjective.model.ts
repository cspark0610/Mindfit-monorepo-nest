import { Field, ObjectType } from '@nestjs/graphql';
import { Coachee } from 'src/coaching/models/coachee.model';
import { ObjectiveTask } from 'src/coaching/models/objetiveTask.model';
import { TimeStampModel } from 'src/common/models/timeStampModel.model';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class CoacheeObjective extends TimeStampModel {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Coachee, { nullable: false })
  @ManyToOne(() => Coachee, (coachee) => coachee.objetives, {
    onDelete: 'CASCADE',
  })
  coachee: Coachee;

  @Field(() => [ObjectiveTask], { nullable: true, defaultValue: [] })
  @OneToMany(() => ObjectiveTask, (objectiveTask) => objectiveTask.objective)
  tasks: ObjectiveTask[];

  @Field()
  @Column({ nullable: false })
  title: string;
}
