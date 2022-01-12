import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Coachee } from '../models/coachee.model';
import { CoacheeService } from '../services/coachee.service';
import {
  CoacheeDto,
  EditCoacheeDto,
  InviteCoacheeDto,
} from '../dto/coachee.dto';
import { UsersService } from '../../users/services/users.service';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AwsSesService } from 'src/aws/services/ses.service';

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
    @Args('data', { type: () => InviteCoacheeDto }) data: InviteCoacheeDto,
  ): Promise<Coachee> {
    const { user: userData, ...coacheeData } = data;

    const user = await this.userService.createInvitedUser(userData);

    try {
      const coachee = await this.service.create({
        user: user,
        ...coacheeData,
      });
      console.log('coachee creado', coachee);

      await this.sesService.sendEmail({
        template: 'invitationTemplate',
        subject: 'Has sido invitado a Mindfit',
        to: [user.email],
      });
      return coachee;
    } catch (error) {
      console.log(error);

      await this.userService.delete(user.id);
    }
  }
}
