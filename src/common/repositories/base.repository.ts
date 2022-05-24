import { AbstractRepository, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { BaseRepositoryInterface } from 'src/common/interfaces/baseRepository.interface';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { HttpStatus } from '@nestjs/common';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

export abstract class BaseRepository<T extends ObjectLiteral>
  extends AbstractRepository<T>
  implements BaseRepositoryInterface<T>
{
  getQueryBuilder(relations?: QueryRelationsType): SelectQueryBuilder<T> {
    console.log(relations.relations, 'tuplas');
    const query = this.repository.createQueryBuilder(relations.ref || '');

    if (Array.isArray(relations.relations)) {
      relations.relations.map(([relation, ref]) =>
        query.leftJoinAndSelect(relation, ref),
      );
    }
    return query;
  }

  async findAll(
    where: Partial<T> = {},
    relations?: QueryRelationsType,
  ): Promise<Array<T>> {
    return this.getQueryBuilder(relations).where(where).getMany();
  }

  async findOneBy(
    where: Partial<T> = {},
    relations?: QueryRelationsType,
  ): Promise<T> {
    const result = await this.getQueryBuilder(relations).where(where).getOne();
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
    await this.repository.save(this.repository.create({ id, ...data }));
    return this.findOneBy({ id } as any);
  }

  async updateMany(ids: Array<number>, data: Partial<T>): Promise<Array<T>> {
    await Promise.all(ids.map((id) => this.repository.save({ id, ...data })));
    return Promise.all(ids.map((id) => this.findOneBy({ id } as any)));
  }

  async delete(id: number | Array<number>): Promise<number> {
    const result = await this.repository.delete(id);
    return result.affected;
  }
}
