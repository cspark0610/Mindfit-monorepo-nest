import { AbstractRepository, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { BaseRepositoryInterface } from 'src/common/interfaces/baseRepository.interface';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { HttpStatus } from '@nestjs/common';

export abstract class BaseRepository<T extends ObjectLiteral>
  extends AbstractRepository<T>
  implements BaseRepositoryInterface<T>
{
  getQueryBuilder(): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder();
  }

  async findAll(where: Partial<T> = {}): Promise<Array<T>> {
    return this.getQueryBuilder().where(where).getMany();
  }

  async findOneBy(where: Partial<T> = {}): Promise<T> {
    const result = await this.getQueryBuilder().where(where).getOne();
    if (!result) {
      throw new MindfitException({
        error: `${this.repository.metadata.name} not Found.`,
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: '404',
      });
    }
    return result;
  }

  async create(data: Partial<T>): Promise<T> {
    return this.repository.save(this.repository.create(data));
  }

  async createMany(data: Array<Partial<T>>): Promise<Array<T>> {
    return this.repository.save(this.repository.create(data));
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    await this.repository.update(id, this.repository.create(data));
    return this.findOneBy({ id } as any);
  }

  async updateMany(ids: Array<number>, data: Partial<T>): Promise<Array<T>> {
    await this.repository.update(ids, this.repository.create(data));
    return Promise.all(ids.map((id) => this.findOneBy({ id } as any)));
  }

  async delete(id: number | Array<number>): Promise<number> {
    const result = await this.repository.delete(id);
    return result.affected;
  }
}
