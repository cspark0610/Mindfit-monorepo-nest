import { HttpStatus } from '@nestjs/common';
import { MindfitException } from 'src/common/exceptions/mindfitException';
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

  async findOne(id: number, options?: FindOneOptions<T>): Promise<T> {
    const result = await this.repository.findOne(id, options);
    if (!result) {
      throw new MindfitException({
        error: `${this.repository.metadata.name} with id ${id} not found.`,
        errorCode: `NOT_FOUNT`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    return result;
  }

  async findOneBy(where: FindOneOptions<T>): Promise<T> {
    return this.repository.findOne(where);
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = this.repository.create(data);
    const result = await this.repository.save(entity);
    return result;
  }

  async createMany(data: Partial<T>[]): Promise<T[]> {
    const entities = this.repository.create(data);
    return this.repository.save(entities);
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
