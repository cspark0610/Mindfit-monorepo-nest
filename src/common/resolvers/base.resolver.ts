import { Type } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BaseService } from '../service/base.service';

export function BaseResolver<T extends Type<unknown>>(
  classRef: T,
  dto: any,
): any {
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost {
    protected service: BaseService<T>;

    @Query(() => [classRef], { name: `findAll${classRef.name}s` })
    async findAll(): Promise<T[]> {
      return this.service.findAll();
    }

    @Query(() => classRef, { name: `find${classRef.name}ById` })
    async findOne(@Args('id', { type: () => Int }) id: number): Promise<T> {
      return this.service.findOne(id);
    }

    @Mutation(() => classRef, { name: `create${classRef.name}` })
    async create(
      @Args('data', { type: () => dto.create }) data: typeof dto.create,
    ): Promise<T> {
      return this.service.create(data);
    }

    @Mutation(() => classRef, { name: `update${classRef.name}` })
    async update(
      @Args('id', { type: () => Number })
      id: number,
      @Args('data', { type: () => dto.update }) data: typeof dto.update,
    ): Promise<T | T[]> {
      return this.service.update(id, data);
    }

    @Mutation(() => [classRef], { name: `updateMany${classRef.name}s` })
    async updateMany(
      @Args('ids', { type: () => [Number] })
      ids: Array<number>,
      @Args('data', { type: () => dto.update }) data: typeof dto.update,
    ): Promise<T | T[]> {
      return this.service.update(ids, data);
    }

    @Mutation(() => Number, { name: `delete${classRef.name}` })
    async delete(
      @Args('id', { type: () => Number }) id: number,
    ): Promise<number> {
      return this.service.delete(id);
    }

    @Mutation(() => Number, { name: `deleteMany${classRef.name}s` })
    async deleteMany(
      @Args('ids', { type: () => [Number] }) ids: Array<number>,
    ): Promise<number> {
      return this.service.delete(ids);
    }
  }

  return BaseResolverHost;
}
