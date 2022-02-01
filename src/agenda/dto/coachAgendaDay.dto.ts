import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsNotEmpty } from 'class-validator';
import { AvailabilityRangeDto } from './availabilityRange.dto';

@InputType()
export class CreateCoachAgendaDayDto {
  @Field()
  @IsDate()
  @IsNotEmpty()
  day: Date;

  @Field(() => AvailabilityRangeDto, { nullable: true })
  @IsNotEmpty()
  availableHours?: string;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
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
