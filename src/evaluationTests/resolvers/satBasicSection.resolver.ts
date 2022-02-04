import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import {
  EditSatBasicSectionDto,
  SatBasicSectionDto,
} from 'src/evaluationTests/dto/satBasicSection.dto';
import { SatBasicSection } from 'src/evaluationTests/models/satBasicSection.model';
import { SatBasicSectionsService } from 'src/evaluationTests/services/satBasicSection.service';
@Resolver(() => SatBasicSection)
@UseGuards(JwtAuthGuard)
export class SatBasicSectionsResolver extends BaseResolver(SatBasicSection, {
  create: SatBasicSectionDto,
  update: EditSatBasicSectionDto,
}) {
  constructor(protected readonly service: SatBasicSectionsService) {
    super();
  }
  // TODO Validate only staff and superuser
}
