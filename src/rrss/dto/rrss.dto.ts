import { InputType, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Roles } from 'src/users/enums/roles.enum';

@InputType()
export class RRSSDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  token: string;

  @Field(() => Roles)
  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  mobile?: string;
}
