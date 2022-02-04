import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coachee } from 'src/coaching/models/coachee.model';
import { BaseService } from 'src/common/service/base.service';
import { FindOneOptions, Repository } from 'typeorm';
@Injectable()
export class CoacheeService extends BaseService<Coachee> {
  constructor(
    @InjectRepository(Coachee)
    protected readonly repository: Repository<Coachee>,
  ) {
    super();
  }
  async findOne(
    id: number,
    options?: FindOneOptions<Coachee>,
  ): Promise<Coachee> {
    const result = await this.repository.findOne(id, {
      ...options,
      relations: ['organization'],
    });
    if (!result) {
      throw new NotFoundException(
        `${this.repository.metadata.name} with id ${id} not found.`,
      );
    }
    return result;
  }
}
