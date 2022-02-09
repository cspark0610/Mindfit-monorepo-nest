import { SelectQueryBuilder } from 'typeorm';

export interface BaseRepositoryInterface<T> {
  getQueryBuilder(): SelectQueryBuilder<T>;
  findAll(where?: Partial<T>): Promise<Array<T>>;
  findOneBy(where: Partial<T>): Promise<T>;
  create(data: Partial<T>): Promise<T>;
  createMany(data: Array<Partial<T>>): Promise<Array<T>>;
  update(id: number, data: Partial<T>): Promise<T>;
  updateMany(ids: Array<number>, data: Partial<T>): Promise<Array<T>>;
  delete(id: number | Array<number>): Promise<number>;
}
