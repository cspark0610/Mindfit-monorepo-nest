import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CoreConfigDto } from '../dto/coreConfig.dto';
import { CoreConfig } from '../models/coreConfig.model';

@Injectable()
export class CoreConfigService {
  constructor(
    @InjectRepository(CoreConfig)
    private coreConfigRepository: Repository<CoreConfig>,
  ) {}

  async createCoreConfig(coreConfigData: CoreConfigDto): Promise<CoreConfig> {
    return this.coreConfigRepository.save(coreConfigData);
  }
  async editCoreConfigs(
    id: number | Array<number>,
    coreConfigData: CoreConfigDto,
  ): Promise<CoreConfig> {
    const result = await this.coreConfigRepository
      .createQueryBuilder()
      .update()
      .set({ ...coreConfigData })
      .whereInIds(Array.isArray(id) ? id : [id])
      .returning('*')
      .execute();

    return Array.isArray(id) ? result.raw : result.raw[0];
  }

  async deleteCoreConfigs(id: number | Array<number>): Promise<number> {
    const result = await this.coreConfigRepository
      .createQueryBuilder()
      .delete()
      .whereInIds(Array.isArray(id) ? id : [id])
      .execute();

    return result.affected;
  }

  async getCoreConfig(id: number): Promise<CoreConfig> {
    return this.coreConfigRepository.findOne(id);
  }

  async getCoreConfigs(
    where: FindManyOptions<CoreConfig>,
  ): Promise<CoreConfig[]> {
    return this.coreConfigRepository.find(where);
  }
}
