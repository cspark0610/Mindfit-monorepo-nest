import { CreateUserDto } from 'src/users/dto/users.dto';
import { CoacheeDto } from 'src/coaching/dto/coachee.dto';
import { OrganizationDto } from 'src/organizations/dto/organization.dto';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignupCoacheeDto {
  @Field(() => CreateUserDto, { nullable: false })
  signupData: CreateUserDto;

  @Field(() => CoacheeDto, { nullable: false })
  coacheeData: CoacheeDto;

  @Field(() => OrganizationDto, { nullable: false })
  organizationData: OrganizationDto;
}
