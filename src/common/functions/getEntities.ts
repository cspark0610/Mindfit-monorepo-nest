import { EntityTarget, getRepository, Repository } from 'typeorm';

export const getEntities = <T>(
  ids: number[],
  model: EntityTarget<T>,
): Promise<T[]> => {
  const repository: Repository<T> = getRepository<T>(model);
  return repository.createQueryBuilder().whereInIds(ids).getMany();
};
