import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ConfigCodeNames {
  DEFAULT_SAT = 'DEFAULT_SAT',
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
  jsonValue: string;
}
