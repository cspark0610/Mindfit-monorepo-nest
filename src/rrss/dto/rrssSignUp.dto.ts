import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { RRSSDto } from 'src/rrss/dto/rrss.dto';
import { Roles } from 'src/users/enums/roles.enum';

@InputType()
export class RRSSSignUpDto extends RRSSDto {
  @Field(() => Roles)
  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;
}
