import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { actionType } from 'src/coaching/enums/actionType.enum';
import { StringTrimm } from 'src/common/decorators/stringTrimm.decorator';

@InputType()
export class ActionDto {
  @IsNotEmpty()
  @IsString()
  @StringTrimm()
  @IsEnum(actionType, {
    message: 'Invalid action type, enter "SUSPEND" or "ACTIVATE"',
  })
  @Field()
  readonly type: string;
}
