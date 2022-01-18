import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { SatReportDto } from '../dto/satReport.dto';
import { SatReport } from '../models/satReport.model';
import { SatReportsService } from '../services/satReport.service';

@Resolver(() => SatReport)
@UseGuards(JwtAuthGuard)
export class SatReportsResolver extends BaseResolver(SatReport, {
  create: SatReportDto,
  update: SatReportDto,
}) {
  constructor(protected readonly service: SatReportsService) {
    super();
  }
}
