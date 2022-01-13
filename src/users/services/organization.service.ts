import { Injectable } from '@nestjs/common';
import { Organization } from '../models/organization.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
@Injectable()
export class OrganizationService extends BaseService<Organization> {
  constructor(
    @InjectRepository(Organization)
    protected readonly repository: Repository<Organization>,
  ) {
    super();
  }
}
