import { CreateUserDto } from 'src/users/dto/users.dto';
import { CoacheeSignUpDto } from 'src/coaching/dto/coachee.dto';
import { OrganizationDto } from 'src/organizations/dto/organization.dto';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SignupCoacheeDto {
  @Field(() => CreateUserDto, { nullable: false })
  signupData: CreateUserDto;

  @Field(() => CoacheeSignUpDto, { nullable: false })
  coacheeData: CoacheeSignUpDto;

  @Field(() => OrganizationDto, { nullable: false })
  organizationData: OrganizationDto;
}
