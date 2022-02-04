import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsNotEmpty } from 'class-validator';
import { HoursInterval } from 'src/agenda/dto/availabilityRange.dto';
import { HoursIntervalInterface } from 'src/agenda/interfaces/availabilityRange.interface';
import { UniqueField } from 'src/common/decorators/uniqueFieldDecorator';

@InputType()
export class CreateCoachAgendaDayDto {
  @Field()
  @IsDate()
  @IsNotEmpty()
  // @Matches(new RegExp(/^[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{4}$/g), {
  //   message: 'Please use 02/22/2022 format.',
  // }) // 02/02/2022
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

  // public static async from(
  //   dto: CreateCoachAgendaDayDto,
  // ): Promise<Partial<CoachAgendaDay>> {
  //   const { coachAgendaId, ...coachAgendaDayData } = dto;

  //   return {
  //     ...coachAgendaDayData,
  //     coachAgenda: coachAgendaId
  //       ? await getEntity(coachAgendaId, CoachAgenda)
  //       : null,
  //   };
  // }
}

@InputType()
export class EditCoachAgendaDayDto extends PartialType(
  CreateCoachAgendaDayDto,
) {}
