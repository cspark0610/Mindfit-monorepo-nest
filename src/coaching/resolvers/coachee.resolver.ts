import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { Coachee } from '../models/coachee.model';
import { CoacheeService } from '../services/coachee.service';
import {
  CoacheeDto,
  EditCoacheeDto,
  InviteCoacheeDto,
} from '../dto/coachee.dto';
import { UsersService } from '../../users/services/users.service';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AwsSesService } from 'src/aws/services/ses.service';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { User } from 'src/users/models/users.model';
import {
  isOrganizationAdmin,
  ownOrganization,
} from 'src/users/validators/users.validators';
import { Organization } from 'src/users/models/organization.model';

@Resolver(() => Coachee)
@UseGuards(JwtAuthGuard)
export class CoacheesResolver extends BaseResolver(Coachee, {
  create: CoacheeDto,
  update: EditCoacheeDto,
}) {
  constructor(
    protected readonly service: CoacheeService,
    private userService: UsersService,
    private sesService: AwsSesService,
  ) {
    super();
  }
  @Mutation(() => Coachee)
  async inviteCoachee(
    @CurrentSession() requestUser: User,
    @Args('data', { type: () => InviteCoacheeDto }) data: InviteCoacheeDto,
  ): Promise<Coachee> {
    const hostUser = await this.userService.findOne(requestUser.id, {
      relations: ['organization', 'coachee'],
    });

    if (!ownOrganization(hostUser) && !isOrganizationAdmin(hostUser)) {
      throw new ForbiddenException(
        'You do not have permissions to perform ' +
          'this action or you do not own an organization',
      );
    }

    const { user: userData, ...coacheeData } = data;
    coacheeData.invited = true;

    // Get User organization
    let organization: Organization;
    ownOrganization(hostUser)
      ? (organization = hostUser.organization)
      : (organization = hostUser.coachee.organization);

    const { user } = await this.userService.createInvitedUser(userData);
    try {
      const coachee = await this.service.create({
        user,
        organization,
        ...coacheeData,
      });

      await this.sesService.sendEmail({
        template: `${hostUser.name} te ha invitado a Mindfit. Conoce la mejor plataforma de Coaching Online`,
        subject: `${hostUser.name} te ha invitado a Mindfit`,
        to: [user.email],
      });
      return coachee;
    } catch (error) {
      console.log(error);
      await this.userService.delete(user.id);
    }
  }

  @Mutation(() => Coachee)
  async acceptInvitation(
    @CurrentSession() requestUser: User,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Coachee | Coachee[]> {
    const hostUser = await this.userService.findOne(requestUser.id);
    const coachee = await this.service.findOne(id);
    // Validate corrent user own coachee profile
    if (!coachee) {
      throw new NotFoundException(`Model with id ${id} does not exist`);
    }
    if (hostUser.id != coachee.user.id) {
      throw new BadRequestException(
        `The coachee profile does not belong to the logged-in user.`,
      );
    }
    if (!coachee?.invited) {
      throw new BadRequestException(`Coachee id ${id} has no invitation.`);
    }
    return this.service.update(id, { invitationAccepted: true });
  }
}
