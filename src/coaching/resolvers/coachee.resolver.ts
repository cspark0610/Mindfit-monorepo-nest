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
    const hostUser = await this.userService.findOne(requestUser.id);

    if (!ownOrganization(hostUser)) {
      if (!isOrganizationAdmin(hostUser)) {
        throw new ForbiddenException(
          'You do not have permissions to perform this action or you do not own an organization',
        );
      }
    }

    const { user: userData, ...coacheeData } = data;
    coacheeData.invited = true;
    coacheeData.organizationId = hostUser.organization.id;

    const { user } = await this.userService.createInvitedUser(userData);

    try {
      const coachee = await this.service.create({
        user,
        ...coacheeData,
      });
      console.log('coachee creado', coachee);

      await this.sesService.sendEmail({
        template: 'invitationTemplate',
        subject: `Has sido invitado a Mindfit`,
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
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Coachee | Coachee[]> {
    const coachee = await this.service.findOne(id);
    if (!coachee) {
      throw new NotFoundException(`Model with id ${id} does not exist`);
    }
    if (!coachee?.invited) {
      throw new BadRequestException(`Coachee id ${id} has no invitation.`);
    }
    return this.service.update(id, { invitationAccepted: true });
  }
}
