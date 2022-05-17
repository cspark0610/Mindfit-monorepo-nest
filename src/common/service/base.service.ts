import { BaseRepository } from 'src/common/repositories/base.repository';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';
import { ObjectLiteral } from 'typeorm';

export abstract class BaseService<T extends ObjectLiteral> {
  protected repository: BaseRepository<T>;

  findAll({
    where = {},
    relations,
  }: {
    where?: Partial<T>;
    relations?: QueryRelationsType;
  }): Promise<Array<T>> {
    return this.repository.findAll(where, relations);
  }

  async findOne({
    id,
    relations,
  }: {
    id: number;
    relations?: QueryRelationsType;
  }): Promise<T> {
    return this.repository.findOneBy({ id } as any, relations);
  }

  findOneBy({
    where = {},
    relations,
  }: {
    where: Partial<T>;
    relations?: QueryRelationsType;
  }): Promise<T> {
    return this.repository.findOneBy(where, relations);
  }

  create(data: Partial<T>): Promise<T> {
    return this.repository.create(data);
  }

  createMany(data: Partial<T>[]): Promise<Array<T>> {
    return this.repository.createMany(data);
  }

  update(id: number, data: Partial<T>): Promise<T> {
    return this.repository.update(id, data);
  }

  updateMany(ids: Array<number>, data: Partial<T>): Promise<Array<T>> {
    return this.repository.updateMany(ids, data);
  }

  delete(id: number | Array<number>): Promise<number> {
    return this.repository.delete(id);
  }
}
