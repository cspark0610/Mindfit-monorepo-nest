import { EntityTarget, getRepository, Repository } from 'typeorm';

export const getEntity = <T>(
  id: number,
  model: EntityTarget<T>,
): Promise<T> => {
  const repository: Repository<T> = getRepository<T>(model);
  return repository.findOne(id);
};
