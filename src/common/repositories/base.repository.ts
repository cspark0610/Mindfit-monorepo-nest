import { AbstractRepository, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { BaseRepositoryInterface } from 'src/common/interfaces/baseRepository.interface';

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

  findOneBy(where: Partial<T> = {}): Promise<T> {
    return this.getQueryBuilder().where(where).getOne();
  }

  async create(data: Partial<T>): Promise<T> {
    const result = await this.repository.insert(this.repository.create(data));
    return this.findOneBy({ id: result.raw[0].id } as any);
  }

  async createMany(data: Array<Partial<T>>): Promise<Array<T>> {
    const result = await this.repository.insert(this.repository.create(data));
    return result.raw.map((item: T) => this.findOneBy({ id: item.id } as any));
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
