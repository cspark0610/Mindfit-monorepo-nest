import {
  IsArray,
  IsBoolean,
  IsJSON,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CoachAgendaDto {
  @IsNotEmpty()
  @IsNumber()
  coach: number;

  @IsArray()
  coachAgendaDays: number[];

  @IsArray()
  coachAppointments: number[];

  @IsJSON()
  availabilityRange: string;

  @IsBoolean()
  @IsNotEmpty()
  outOfService: boolean;
}
