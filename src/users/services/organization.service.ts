import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/service/base.service';
import { Organization } from 'src/users/models/organization.model';
@Injectable()
export class OrganizationService extends BaseService<Organization> {
  constructor(
    @InjectRepository(Organization)
    protected readonly repository: Repository<Organization>,
  ) {
    super();
  }
}
