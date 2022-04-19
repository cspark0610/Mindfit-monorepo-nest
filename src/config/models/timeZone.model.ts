import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class TimeZone {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ nullable: false })
  label: string;

  @Field(() => String)
  @Column({ nullable: false })
  tzCode: string;

  @Field(() => String)
  @Column({ nullable: false })
  name: string;

  @Field(() => String)
  @Column({ nullable: false })
  utc: string;
}
