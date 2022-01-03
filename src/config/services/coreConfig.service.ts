import { Injectable } from '@nestjs/common';
import { CoreConfigDto } from '../dto/coreConfig.dto';
import { CoreConfig } from '../models/coreConfig.model';

@Injectable()
export class CoreConfigService {
  async createCoreConfig(coreConfigData: CoreConfigDto): Promise<CoreConfig> {
    return CoreConfig.create({ ...coreConfigData });
  }

  async editCoreConfig(
    id: number,
    coreConfigData: CoreConfigDto,
  ): Promise<CoreConfig> {
    return CoreConfig.update({ ...coreConfigData }, { where: { id } })[1];
  }

  async bulkEditCoreConfigs(
    ids: Array<number>,
    coreConfigData: CoreConfigDto,
  ): Promise<[number, CoreConfig[]]> {
    return CoreConfig.update({ ...coreConfigData }, { where: { id: ids } });
  }

  async deleteCoreConfig(id: number): Promise<number> {
    return CoreConfig.destroy({ where: { id } });
  }

  async bulkDeleteCoreConfigs(ids: Array<number>): Promise<number> {
    return CoreConfig.destroy({ where: { id: ids } });
  }

  async getCoreConfig(id: number): Promise<CoreConfig> {
    return CoreConfig.findByPk(id);
  }

  async getCoreConfigs(where: object): Promise<CoreConfig[]> {
    return CoreConfig.findAll({ where });
  }
}
