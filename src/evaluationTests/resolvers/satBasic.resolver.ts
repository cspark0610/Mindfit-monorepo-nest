import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BaseResolver } from 'src/common/resolvers/base.resolver';
import { Repository } from 'typeorm';
import { SatBasicDto } from '../dto/satBasic.dto';
import { SatBasic } from '../models/satBasic.model';
import { SatBasicService } from '../services/satBasic.service';
@Resolver(() => SatBasic)
@UseGuards(JwtAuthGuard)
export class SatBasicsResolver extends BaseResolver(SatBasic, {
  create: SatBasicDto,
  update: SatBasicDto,
}) {
  constructor(
    protected readonly service: SatBasicService,

    @InjectRepository(SatBasic)
    protected readonly repository: Repository<SatBasic>,
  ) {
    super();
  }

  @Mutation(() => SatBasic, { name: 'createSatBasic' })
  async create(
    @Args('data', { type: () => SatBasicDto })
    data: SatBasicDto,
  ): Promise<SatBasic> {
    const satTest = await this.service.createFullTest(data);
    return satTest;
  }
}
