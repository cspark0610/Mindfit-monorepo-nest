import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentSession } from 'src/auth/decorators/currentSession.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserSession } from 'src/auth/interfaces/session.interface';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { SatBasicDto } from 'src/evaluationTests/dto/satBasic.dto';
import { SatBasic } from 'src/evaluationTests/models/satBasic.model';
import { SatBasicService } from 'src/evaluationTests/services/satBasic.service';
import { Roles } from 'src/users/enums/roles.enum';
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

  @UseGuards(RolesGuard(Roles.STAFF, Roles.SUPER_USER))
  @Mutation(() => SatBasic, { name: 'createSatBasic' })
  async create(
    @CurrentSession() session: UserSession,
    @Args('data', { type: () => SatBasicDto })
    data: SatBasicDto,
  ): Promise<SatBasic> {
    const satTest = await this.service.createFullTest(data);
    return satTest;
  }
}
