import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { Organization } from 'src/users/models/organization.model';
import { OrganizationRepository } from 'src/users/repositories/organization.repository';
@Injectable()
export class OrganizationService extends BaseService<Organization> {
  constructor(protected readonly repository: OrganizationRepository) {
    super();
  }
}
