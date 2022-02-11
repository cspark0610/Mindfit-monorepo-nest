import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ConfigCodeNames {
  DEFAULT_SAT = 'DEFAULT_SAT',
  MAX_APPOINTMENTS_PER_MONTH = 'MAX_APPOINTMENTS_PER_MONTH',
  MAX_DISTANTE_COACH_AVAILABITY_QUERY = 'MAX_DISTANTE_COACH_AVAILABITY_QUERY',
  MAX_DISTANTE_COACH_APPOINTMENT = 'MAX_DISTANTE_COACH_APPOINTMENT',
  MIN_COACHING_SESSION_DURATION = 'MIN_COACHING_SESSION_DURATION', // 30 min
  MAX_COACHING_SESSION_DURATION = 'MAX_COACHING_SESSION_DURATION', // 120 min
}

registerEnumType(ConfigCodeNames, {
  name: 'ConfigCodeNames',
});
@Entity()
@ObjectType()
export class CoreConfig {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ nullable: false })
  name: string;

  @Field(() => ConfigCodeNames)
  @Column({ enum: ConfigCodeNames, nullable: false })
  codename: ConfigCodeNames;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  value: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  jsonValue?: string;
}
