import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsDate } from 'class-validator';
import { HoursInterval } from 'src/agenda/dto/availabilityRange.dto';
import { HoursIntervalInterface } from 'src/agenda/interfaces/availabilityRange.interface';
import { UniqueField } from 'src/common/decorators/uniqueFieldDecorator';

@InputType()
export class CreateCoachAgendaDayDto {
  @Field()
  @IsDate()
  day: Date;

  @Field(() => [HoursInterval], { nullable: true })
  @UniqueField(['exclude'], {
    message: 'Provide an availabity range or exclution, not both.',
  })
  availableHours?: HoursIntervalInterface[];

  @Field()
  @IsBoolean()
  @UniqueField(['availableHours'], {
    message: 'Provide an availabity range or exclution, not both.',
  })
  exclude: boolean;
}

@InputType()
export class EditCoachAgendaDayDto extends PartialType(
  CreateCoachAgendaDayDto,
) {}
