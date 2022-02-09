import { BaseRepository } from 'src/common/repositories/base.repository';
import { ObjectLiteral } from 'typeorm';

export abstract class BaseService<T extends ObjectLiteral> {
  protected repository: BaseRepository<T>;

  findAll(where: Partial<T> = {}): Promise<Array<T>> {
    return this.repository.findAll(where);
  }

  findOne(id: number): Promise<T> {
    return this.repository.findOneBy({ id } as any);
  }

  findOneBy(where: Partial<T>): Promise<T> {
    return this.repository.findOneBy(where);
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
