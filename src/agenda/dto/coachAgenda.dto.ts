import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsMilitaryTime,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  AvailabilityRangeDto,
  HoursInterval,
} from 'src/agenda/dto/availabilityRange.dto';
//import { AvailabilityRangeInterface } from 'src/agenda/interfaces/availabilityRange.interface';
import { CoachAgenda } from 'src/agenda/models/coachAgenda.model';
import { Coach } from 'src/coaching/models/coach.model';
import { getEntity } from 'src/common/functions/getEntity';

@InputType()
export class CreateCoachAgendaDto {
  @Field()
  @IsPositive()
  coachId: number;

  @Field(() => AvailabilityRangeDto, { nullable: true })
  @IsOptional()
  //availabilityRange?: AvailabilityRangeInterface;
  @ValidateNested({
    each: true,
    groups: ['from', 'to'],
    message: 'The time must be in 18:00 format',
    always: true,
  })
  @IsString()
  @IsMilitaryTime({ message: 'The time must be in HH:MM format' })
  @Type(() => HoursInterval)
  availabilityRange?: {
    monday?: [{ from: string; to: string }];
    tuesday?: [{ from: string; to: string }];
    wednesday?: [{ from: string; to: string }];
    thrusday?: [{ from: string; to: string }];
    friday?: [{ from: string; to: string }];
    saturday?: [{ from: string; to: string }];
    sunday?: [{ from: string; to: string }];
  };

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  outOfService?: boolean;

  public static async from(
    dto: CreateCoachAgendaDto,
  ): Promise<Partial<CoachAgenda>> {
    const { coachId, ...coachAgendaData } = dto;

    return {
      ...coachAgendaData,
      coach: coachId ? await getEntity(coachId, Coach) : null,
      // coachAgendaDays: Array.isArray(coachAgendaDays)
      //   ? await getEntities(coachAgendaDays, CoachAgendaDay)
      //   : null,
      // coachAppointments: Array.isArray(coachAppointments)
      //   ? await getEntities(coachAppointments, CoachAppointment)
      //   : null,
    };
  }
}

@InputType()
export class EditCoachAgendaDto extends PartialType(
  OmitType(CreateCoachAgendaDto, ['coachId']),
) {}
