import { Field, InputType } from '@nestjs/graphql';
import { IsJSON, IsNotEmpty, IsString } from 'class-validator';
import { ConfigCodeNames } from '../models/coreConfig.model';
@InputType()
export class CoreConfigDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => ConfigCodeNames)
  @IsNotEmpty()
  @IsString()
  codename: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  value: string;

  @Field({ nullable: true })
  @IsJSON()
  jsonValue: string;
}
