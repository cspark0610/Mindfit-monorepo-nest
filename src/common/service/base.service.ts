import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';

export abstract class BaseService<T extends ObjectLiteral> {
  protected repository: Repository<T>;

  async findAll(where?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(where);
  }

  async findOne(id: number): Promise<T> {
    return this.repository.findOne(id);
  }

  async findOneBy(where: Partial<T>): Promise<T> {
    return this.repository.findOne(where);
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
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
