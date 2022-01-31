import { NotFoundException } from '@nestjs/common';
import {
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export abstract class BaseService<T extends ObjectLiteral> {
  protected repository: Repository<T>;

  async findAll(where?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(where);
  }

  async findOne(id: number, options?: FindOneOptions): Promise<T> {
    const result = await this.repository.findOne(id, options);
    if (!result) {
      throw new NotFoundException(
        `${this.repository.metadata.name} with id ${id} not found.`,
      );
    }
    return result;
  }

  async findOneBy(where: Partial<T>): Promise<T> {
    return this.repository.findOne(where);
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async createMany(data: Partial<T>[]): Promise<Promise<T>[]> {
    // const entities = await this.repository.insert(data);
    const entities = await this.repository
      .createQueryBuilder()
      .insert()
      .values(data)
      .returning('*')
      .execute();

    return entities.raw;
  }

  async update(id: number | Array<number>, data: Partial<T>): Promise<T | T[]> {
    const result = await this.repository
      .createQueryBuilder()
      .update()
      .set(this.repository.create(data))
      .whereInIds(Array.isArray(id) ? id : [id])
      .returning('*')
      .execute();
    return Array.isArray(id) ? result.raw : result.raw[0];
  }

  async delete(id: number | Array<number>): Promise<number> {
    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .whereInIds(Array.isArray(id) ? id : [id])
      .execute();
    return result.affected;
  }
}
