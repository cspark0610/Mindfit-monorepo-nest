import { Field, ObjectType } from '@nestjs/graphql';
import { SatResultAreaObjectType } from 'src/evaluationTests/models/SatResultArea.model';
import { SatBasic } from 'src/evaluationTests/models/satBasic.model';
import { SatSectionResult } from 'src/evaluationTests/models/satSectionResult.model';
import { User } from 'src/users/models/users.model';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SuggestedCoaches } from 'src/coaching/models/suggestedCoaches.model';

@Entity()
@ObjectType()
export class SatReport {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.testResults)
  user: User;

  @Field(() => SatBasic)
  @ManyToOne(() => SatBasic, (satBasic) => satBasic.testsReports, {
    nullable: false,
  })
  satRealized: SatBasic;

  @Field(() => SuggestedCoaches)
  @OneToMany(
    () => SuggestedCoaches,
    (suggestedCoaches) => suggestedCoaches.satReport,
    {
      nullable: true,
    },
  )
  suggestedCoaches: SuggestedCoaches;

  @Field(() => [SatSectionResult])
  @OneToMany(
    () => SatSectionResult,
    (satSectionResult) => satSectionResult.satReport,
    { nullable: true },
  )
  sectionsResults: SatSectionResult[];

  @Field(() => [SatResultAreaObjectType], { nullable: true })
  result: SatResultAreaObjectType[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
