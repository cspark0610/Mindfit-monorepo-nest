import { Field, ObjectType } from '@nestjs/graphql';
import { TimeStampModel } from 'src/common/models/timeStampModel.model';
import { ConfigCodeNames } from 'src/config/enums/configCodenames.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TimeZoneObjectType } from 'src/config/models/timeZone.model';

@Entity()
@ObjectType()
export class CoreConfig extends TimeStampModel {
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

  // @Field(() => String, { nullable: true })
  // @Column({ nullable: true })
  // jsonValue?: string;

  @Field(() => [TimeZoneObjectType], { nullable: true, defaultValue: [] })
  @Column({ nullable: true, type: 'json' })
  jsonValue?: TimeZoneObjectType[];
}
