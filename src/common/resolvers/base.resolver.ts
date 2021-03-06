import { Type, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BaseService } from 'src/common/service/base.service';
import { Roles } from 'src/users/enums/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { QueryRelations } from 'src/common/decorators/queryRelations.decorator';
import { QueryRelationsType } from 'src/common/types/queryRelations.type';

export function BaseResolver<T extends Type<unknown>>(
  classRef: T,
  dto: any,
): any {
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost {
    protected service: BaseService<T>;

    @UseGuards(RolesGuard(Roles.SUPER_USER, Roles.STAFF))
    @Query(() => [classRef], { name: `findAll${classRef.name}s` })
    protected async findAll(
      @QueryRelations(classRef.name) relations: QueryRelationsType,
    ): Promise<T[]> {
      return this.service.findAll({ relations });
    }

    @Query(() => classRef, { name: `find${classRef.name}ById` })
    protected async findOne(
      @Args('id', { type: () => Int }) id: number,
      @QueryRelations(classRef.name) relations: QueryRelationsType,
    ): Promise<T> {
      return this.service.findOne({ id, relations });
    }

    @Mutation(() => classRef, { name: `create${classRef.name}` })
    protected async create(
      @Args('data', { type: () => dto.create }) data: typeof dto.create,
    ): Promise<T> {
      return this.service.create(data);
    }

    @Mutation(() => [classRef], { name: `createMany${classRef.name}` })
    protected async createMany(
      @Args('data', { type: () => [dto.create] }) data: typeof dto.create[],
    ): Promise<T[]> {
      return this.service.createMany(data);
    }

    @Mutation(() => classRef, { name: `update${classRef.name}` })
    protected async update(
      @Args('id', { type: () => Number })
      id: number,
      @Args('data', { type: () => dto.update }) data: typeof dto.update,
    ): Promise<T> {
      return this.service.update(id, data);
    }

    @Mutation(() => [classRef], { name: `updateMany${classRef.name}s` })
    protected async updateMany(
      @Args('ids', { type: () => [Number] })
      ids: Array<number>,
      @Args('data', { type: () => dto.update }) data: typeof dto.update,
    ): Promise<T[]> {
      return this.service.updateMany(ids, data);
    }

    @Mutation(() => Number, { name: `delete${classRef.name}` })
    protected async delete(
      @Args('id', { type: () => Number }) id: number,
    ): Promise<number> {
      return this.service.delete(id);
    }

    @Mutation(() => Number, { name: `deleteMany${classRef.name}s` })
    protected async deleteMany(
      @Args('ids', { type: () => [Number] }) ids: Array<number>,
    ): Promise<number> {
      return this.service.delete(ids);
    }
  }

  return BaseResolverHost;
}
