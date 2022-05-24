import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Int, Args } from '@nestjs/graphql';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { QueryRelations } from 'src/common/decorators/queryRelations.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';
import { Roles } from 'src/users/enums/roles.enum';

@Resolver(() => CoachAppointment)
@UseGuards(JwtAuthGuard)
export class CoachAppointmentResolver extends BaseResolver(
  CoachAppointment,
  {},
) {
  constructor() {
    super();
  }
  @UseGuards(RolesGuard(Roles.SUPER_USER))
  @Mutation(() => CoachAppointment, { name: `findAllCoachAppointments` })
  async findAllCoachAppointments(
    @QueryRelations('coachAppointment') relations: QueryRelationsType,
  ): Promise<CoachAppointment> {
    return this.service.findAll({ relations });
  }

  @UseGuards(RolesGuard(Roles.SUPER_USER))
  @Mutation(() => CoachAppointment, { name: `findCoachAppointmentById` })
  async findCoachAppointmentById(
    @Args('id', { type: () => Int }) id: number,
    @QueryRelations('coachAppointment') relations: QueryRelationsType,
  ): Promise<CoachAppointment> {
    return this.service.findOne({ id, relations });
  }
}
