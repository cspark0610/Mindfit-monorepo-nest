import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { Coachee } from '../models/coachee.model';
import {
  CoacheeDto,
  EditCoacheeDto,
  InviteCoacheeDto,
} from '../dto/coachee.dto';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import {
  BadRequestException,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AwsSesService } from 'src/aws/services/ses.service';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import {
  isOrganizationAdmin,
  ownOrganization,
} from 'src/users/validators/users.validators';
import { UsersService } from 'src/users/services/users.service';
import { CoacheeService } from '../services/coachee.service';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { genSaltSync, hashSync } from 'bcryptjs';
import { Emails } from 'src/strapi/enum/emails.enum';

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
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => InviteCoacheeDto }) data: InviteCoacheeDto,
  ): Promise<Coachee> {
    const hostUser = await this.userService.findOne(session.userId, {
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
    const organization = ownOrganization(hostUser)
      ? hostUser.organization
      : hostUser.coachee.organization;

    const { user } = await this.userService.createInvitedUser(userData);
    try {
      const coachee = await this.service.create({
        user,
        organization,
        ...coacheeData,
      });

      const hashResetPassword = hashSync(
        Math.random().toString(36).slice(-12),
        genSaltSync(),
      );

      await this.userService.update(user.id, {
        hashResetPassword,
      });

      await this.sesService.sendEmail({
        template: Emails.INVITE_COLLABORATOR,
        to: [user.email],
        subject: `${hostUser.name} te ha invitado a Mindfit`,
      });
      return coachee;
    } catch (error) {
      console.log(error);
      await this.userService.delete(user.id);
    }
  }

  @Mutation(() => Coachee)
  async acceptInvitation(
    @CurrentSession() session: UserSession,
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Coachee | Coachee[]> {
    const [hostUser, coachee] = await Promise.all([
      this.userService.findOne(session.userId),
      this.service.findOne(id, { relations: ['user'] }),
    ]);
    if (hostUser.id != coachee.user.id) {
      throw new BadRequestException(
        `The coachee profile does not belong to the logged-in user.`,
      );
    }
    if (!coachee?.invited) {
      throw new BadRequestException(`Coachee id ${id} has no invitation.`);
    }
    await this.service.update(id, {
      invitationAccepted: true,
    });
    return coachee;
  }
}
