import { Resolver } from '@nestjs/graphql';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { CreateCoachAgendaDto } from '../dto/coachAgenda.dto';
import { CoachAgenda } from '../models/coachAgenda.model';
import { CoachAgendaService } from '../services/coachAgenda.service';

@Resolver(() => CoachAgenda)
export class CoachAgendaResolver extends BaseResolver(CoachAgenda, {
  create: CreateCoachAgendaDto,
  edit: CreateCoachAgendaDto,
}) {
  constructor(protected readonly service: CoachAgendaService) {
    super();
  }
}
