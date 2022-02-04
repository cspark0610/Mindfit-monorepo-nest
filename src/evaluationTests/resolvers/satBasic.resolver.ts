import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { SatBasicDto } from 'src/evaluationTests/dto/satBasic.dto';
import { SatBasic } from 'src/evaluationTests/models/satBasic.model';
import { SatBasicService } from 'src/evaluationTests/services/satBasic.service';
import { UsersService } from 'src/users/services/users.service';
@Resolver(() => SatBasic)
@UseGuards(JwtAuthGuard)
export class SatBasicsResolver extends BaseResolver(SatBasic, {
  create: SatBasicDto,
  update: SatBasicDto,
}) {
  constructor(
    protected readonly service: SatBasicService,
    private userService: UsersService,
  ) {
    super();
  }

  @Mutation(() => SatBasic, { name: 'createSatBasic' })
  async create(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => SatBasicDto })
    data: SatBasicDto,
  ): Promise<SatBasic> {
    const hostUser = await this.userService.findOne(session.userId);
    if (!hostUser.isStaff && !hostUser.isSuperUser) {
      throw new ForbiddenException(
        'You do not have permissions to perfom this action.',
      );
    }
    const satTest = await this.service.createFullTest(data);
    return satTest;
  }
}
