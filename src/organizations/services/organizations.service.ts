import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { Organization } from 'src/organizations/models/organization.model';
import { OrganizationRepository } from 'src/organizations/repositories/organization.repository';

@Injectable()
export class OrganizationsService extends BaseService<Organization> {
  constructor(protected readonly repository: OrganizationRepository) {
    super();
  }
}
