import { CreateUserDto } from 'src/users/dto/users.dto';
import { CoacheeDto } from 'src/coaching/dto/coachee.dto';
import { OrganizationDto } from 'src/organizations/dto/organization.dto';

export interface SignupCoachee {
  signupData: CreateUserDto;
  coacheeData: Partial<CoacheeDto>;
  organizationData: OrganizationDto;
}
