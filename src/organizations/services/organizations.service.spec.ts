import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationRepository } from 'src/organizations/repositories/organization.repository';
import { OrganizationsService } from 'src/organizations/services/organizations.service';
import { UsersService } from 'src/users/services/users.service';
import { SatReportsService } from 'src/evaluationTests/services/satReport.service';
import { SatReportEvaluationService } from 'src/evaluationTests/services/satReportEvaluation.service';
import { CoachingSessionFeedbackService } from 'src/videoSessions/services/coachingSessionFeedback.service';
import { CoachingSessionService } from 'src/videoSessions/services/coachingSession.service';
import { AwsS3Service } from 'src/aws/services/s3.service';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import {
  DEFAULT_COACHEE_IMAGE,
  DEFAULT_ORGANIZATION_IMAGE,
} from 'src/coaching/utils/coach.constants';
import * as validateIfCoacheeHasOrganization from 'src/coaching/validators/coachee.validators';
import * as validateIfDtoIncludesPicture from 'src/coaching/validators/coachee.validators';
import * as validateIfHostUserIdIsUserToDelete from 'src/users/validators/users.validators';
import * as validateIfHostUserIdIsInUsersIdsToDelete from 'src/users/validators/users.validators';
import * as ownOrganization from 'src/users/validators/users.validators';
import * as validateOwnerCanEditOrganization from 'src/users/validators/users.validators';
import * as validateCoacheeAdminCanEditOrganization from 'src/users/validators/users.validators';
import { Roles } from 'src/users/enums/roles.enum';
import { OrganizationDto } from 'src/organizations/dto/organization.dto';
import { FileMedia } from 'src/aws/models/file.model';
import { HttpStatus } from '@nestjs/common';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { createOrganizationError } from '../enums/createOrganization.enum';
import { editOrganizationError } from 'src/organizations/enums/editOrganization.enum';
import { CoachingError } from 'src/coaching/enums/coachingErrors.enum';

describe('OrganizationService', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  let service: OrganizationsService;
  const coacheeMock = {
    id: 1,
    user: {
      id: 1,
    },
    organizations: [
      {
        id: 1,
      },
    ],
    organization: { id: 1 },
    coachingAreas: [],
    coachAppointments: [],
    coachNotes: [],
    coachingSessions: [],
    coacheeEvaluations: [],
    phoneNumber: 'TEST_PHONE_NUMBER',
    profilePicture: DEFAULT_COACHEE_IMAGE,
    position: 'TEST_POSITION',
    isAdmin: false,
    isActive: true,
    isSuspended: false,
    canViewDashboard: false,
    bio: 'TEST_BIO',
    aboutPosition: 'TEST_ABOUT_POSITION',
    invited: true,
    invitationAccepted: false,
    assignedCoach: null,
  };
  const userMock = {
    id: 1,
    name: 'TEST_NAME',
    email: 'TEST_EMAIL',
    languages: 'TEST_LANGUAGE',
    password: 'TEST_PASSWORD',
    isActive: true,
    isVerified: true,
    isStaff: false,
    isSuperUser: false,
    role: Roles.SUPER_USER,
  };

  const organizationMock = {
    id: 1,
    owner: { id: 1 },
    coachees: [],
    name: 'TEST_ORGANIZATION',
    about: 'TEST_ABOUT',
    profilePicture: DEFAULT_ORGANIZATION_IMAGE,
    isActive: true,
  };
  const organizationsMock = [
    { ...organizationMock, id: 1 },
    { ...organizationMock, id: 2 },
  ];
  const sessionMock = {
    userId: 1,
    email: 'TEST_EMAIL@mail.com',
    role: Roles.COACHEE,
    organization: { id: 1 } as any,
    coachee: {
      id: 1,
      organization: {
        id: 1,
      },
      isAdmin: true,
    },
  };
  const data = {
    userId: sessionMock.userId,
    name: organizationMock.name,
    about: organizationMock.about,
  };
  const organizationDtoArrMock = [
    { ...data, userId: 1 },
    { ...data, userId: 2 },
  ];

  const OrganizationRepositoryMock = {
    getQueryBuilder: jest.fn(),
    findAll: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  };
  const UsersServiceMock = {
    delete: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    getUserByOrganizationId: jest.fn(),
  };
  const SatReportsServiceMock = {};
  const SatReportEvaluationServiceMock = {};
  const CoachingSessionFeedbackServiceMock = {};
  const CoachingSessionServiceMock = {};
  const AwsS3ServiceMock = {
    delete: jest.fn(),
    formatS3LocationInfo: jest.fn(),
  };
  const CoacheeServiceMock = {
    getCoacheeByUserEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        {
          provide: OrganizationRepository,
          useValue: OrganizationRepositoryMock,
        },
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
        {
          provide: SatReportsService,
          useValue: SatReportsServiceMock,
        },
        {
          provide: SatReportEvaluationService,
          useValue: SatReportEvaluationServiceMock,
        },
        {
          provide: CoachingSessionFeedbackService,
          useValue: CoachingSessionFeedbackServiceMock,
        },
        {
          provide: CoachingSessionService,
          useValue: CoachingSessionServiceMock,
        },
        {
          provide: AwsS3Service,
          useValue: AwsS3ServiceMock,
        },
        {
          provide: CoacheeService,
          useValue: CoacheeServiceMock,
        },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrganizationProfile', () => {
    it('should return organization of coachee profile', async () => {
      CoacheeServiceMock.getCoacheeByUserEmail.mockResolvedValue(coacheeMock);
      jest
        .spyOn(
          validateIfCoacheeHasOrganization,
          'validateIfCoacheeHasOrganization',
        )
        .mockImplementation();

      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(organizationMock as any);
      const result = await service.getOrganizationProfile(sessionMock);

      expect(CoacheeServiceMock.getCoacheeByUserEmail).toHaveBeenCalledWith(
        sessionMock.email,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(organizationMock);
    });
  });

  describe('createOrganization', () => {
    const profilePicture = organizationMock.profilePicture as FileMedia;
    it('Should call createOrganization and create an Organization', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      jest
        .spyOn(OrganizationDto, 'from')
        .mockImplementation()
        .mockResolvedValue(organizationMock as any);

      jest.spyOn(ownOrganization, 'ownOrganization').mockImplementation();

      UsersServiceMock.update.mockResolvedValue({
        ...userMock,
        role: Roles.COACHEE_OWNER,
      });
      AwsS3ServiceMock.formatS3LocationInfo.mockResolvedValue(profilePicture);
      jest
        .spyOn(service, 'create')
        .mockImplementation()
        .mockResolvedValue({ ...organizationMock, profilePicture } as any);

      const result = await service.create(data);
      /// no es await service.createOrganization
      expect(result).toBeDefined();
      expect(result).toEqual(organizationMock);
    });

    it('should throw mindfit exception when validation is not passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      jest
        .spyOn(OrganizationDto, 'from')
        .mockImplementation()
        .mockResolvedValue(organizationMock as any);

      jest.spyOn(ownOrganization, 'ownOrganization').mockImplementation(() => {
        throw new MindfitException({
          error: 'User already own an organization.',
          errorCode: createOrganizationError.USER_ALREADY_HAS_ORGANIZATION,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      });

      try {
        await service.create(data);
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual(
          'User already own an organization.',
        );
        expect(error.response.errorCode).toEqual(
          createOrganizationError.USER_ALREADY_HAS_ORGANIZATION,
        );
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('createManyOrganizations', () => {
    it('Should create many organizations', async () => {
      jest
        .spyOn(validateIfDtoIncludesPicture, 'validateIfDtoIncludesPicture')
        .mockImplementation();

      jest
        .spyOn(OrganizationDto, 'fromArray')
        .mockImplementation()
        .mockResolvedValue(organizationsMock as any);
      jest
        .spyOn(service, 'createMany')
        .mockImplementation()
        .mockResolvedValue(organizationsMock as any);
      const result = await service.createMany(organizationDtoArrMock);
      expect(result).toBeDefined();
      expect(result).toEqual(organizationsMock);
    });
  });

  describe('updateOrganization', () => {
    const data = { name: 'updatedName' };
    const updatedOrganizationMock = { ...organizationMock, name: data.name };
    it('Should update an Organization when all validations are passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue({ ...userMock });
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(organizationMock as any);

      jest
        .spyOn(service, 'updateOrganizationAndFile')
        .mockImplementation()
        .mockResolvedValue(updatedOrganizationMock as any);

      const result = await service.updateOrganization(
        sessionMock,
        organizationMock.id,
        data,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(updatedOrganizationMock);
    });
    it('should throw mindfit exception when user is editing an org that does not own', async () => {
      UsersServiceMock.findOne.mockResolvedValue({
        ...userMock,
        role: Roles.COACHEE_OWNER,
      });
      jest
        .spyOn(
          validateOwnerCanEditOrganization,
          'validateOwnerCanEditOrganization',
        )
        .mockImplementation(() => {
          throw new MindfitException({
            error: 'Owner can only edit its own organization',
            errorCode:
              editOrganizationError.USER_CAN_ONLY_EDIT_OWN_ORGANIZATION,
            statusCode: HttpStatus.BAD_REQUEST,
          });
        });
      try {
        await service.updateOrganization(
          sessionMock,
          organizationMock.id,
          data,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual(
          'Owner can only edit its own organization',
        );
        expect(error.response.errorCode).toEqual(
          editOrganizationError.USER_CAN_ONLY_EDIT_OWN_ORGANIZATION,
        );
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw mindfit exception when coachee admin is editing another org that does not belongs', async () => {
      UsersServiceMock.findOne.mockResolvedValue({
        ...userMock,
        role: Roles.COACHEE_ADMIN,
      });
      jest
        .spyOn(
          validateCoacheeAdminCanEditOrganization,
          'validateCoacheeAdminCanEditOrganization',
        )
        .mockImplementation(() => {
          throw new MindfitException({
            error: 'Coachee admin can only edit its own organization',
            errorCode:
              editOrganizationError.COACHEE_CAN_ONLY_EDIT_OWN_ORGANIZATION,
            statusCode: HttpStatus.BAD_REQUEST,
          });
        });
      try {
        await service.updateOrganization(
          sessionMock,
          organizationMock.id,
          data,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual(
          'Coachee admin can only edit its own organization',
        );
        expect(error.response.errorCode).toEqual(
          editOrganizationError.COACHEE_CAN_ONLY_EDIT_OWN_ORGANIZATION,
        );
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('updateOrganizationAndFile', () => {
    it('Should update an Organization and file', async () => {
      const profilePicture = organizationMock.profilePicture as FileMedia;
      AwsS3ServiceMock.delete.mockResolvedValue(true);
      AwsS3ServiceMock.formatS3LocationInfo.mockResolvedValue(profilePicture);
      jest
        .spyOn(service, 'update')
        .mockImplementation()
        .mockResolvedValue(organizationMock as any);

      const data = { ...profilePicture } as any;
      const result = await service.update(organizationMock.id, data);
      expect(result).toBeDefined();
      expect(result).toEqual(organizationMock);
    });
  });

  describe('updateManyOrganizations', () => {
    const body = { isActive: false };
    const editedOrganizationsMock = [
      { ...organizationMock, id: 1, isActive: false },
      { ...organizationMock, id: 2, isActive: false },
    ];
    it('should update many organizations', async () => {
      jest
        .spyOn(validateIfDtoIncludesPicture, 'validateIfDtoIncludesPicture')
        .mockImplementation();

      OrganizationRepositoryMock.updateMany.mockResolvedValue(
        editedOrganizationsMock,
      );
      const result = await service.updateManyOrganizations(
        [organizationsMock[0].id, organizationsMock[1].id],
        body,
      );
      expect(result).toBeDefined();
      expect(OrganizationRepositoryMock.updateMany).toHaveBeenCalled();
      expect(result).toEqual(editedOrganizationsMock);
    });

    it('should throw mindfit exception when validation is not passed', async () => {
      jest
        .spyOn(validateIfDtoIncludesPicture, 'validateIfDtoIncludesPicture')
        .mockImplementation(() => {
          throw new MindfitException({
            error: 'You cannot create/edit picture',
            errorCode: CoachingError.ACTION_NOT_ALLOWED,
            statusCode: HttpStatus.BAD_REQUEST,
          });
        });

      try {
        await service.updateManyOrganizations(
          [organizationsMock[0].id, organizationsMock[1].id],
          body,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual('You cannot create/edit picture');
        expect(error.response.errorCode).toEqual(
          CoachingError.ACTION_NOT_ALLOWED,
        );
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('getOrganizations', () => {
    beforeAll(() => {
      OrganizationRepositoryMock.findAll.mockResolvedValue([organizationMock]);
    });

    it('Should return multiple Organizations', async () => {
      const result = await service.findAll();

      expect(result).toEqual([organizationMock]);
      expect(OrganizationRepositoryMock.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('getOrganization', () => {
    beforeAll(() => {
      OrganizationRepositoryMock.findOneBy.mockResolvedValue(organizationMock);
    });

    it('Should return an Organization', async () => {
      const result = await service.findOne(organizationMock.id);

      expect(result).toEqual(organizationMock);
      expect(OrganizationRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: organizationMock.id,
      });
    });
  });

  describe('deleteOrganization', () => {
    it('should delete an organization', async () => {
      const rowsAffected = 1;
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(organizationMock as any);

      jest
        .spyOn(
          validateIfHostUserIdIsUserToDelete,
          'validateIfHostUserIdIsUserToDelete',
        )
        .mockImplementation();
      UsersServiceMock.delete.mockResolvedValue(rowsAffected);

      const result = await service.deleteOrganization(
        sessionMock,
        organizationMock.id,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(rowsAffected);
    });
    it('should throw mindfit exception when user is the hostuser', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(organizationMock as any);

      jest
        .spyOn(
          validateIfHostUserIdIsUserToDelete,
          'validateIfHostUserIdIsUserToDelete',
        )
        .mockImplementation(() => {
          throw new MindfitException({
            error: 'You cannot delete yourself as staff or super_user',
            statusCode: HttpStatus.BAD_REQUEST,
            errorCode: 'You cannot delete yourself as staff or super_user',
          });
        });

      try {
        await service.deleteOrganization(sessionMock, organizationMock.id);
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual(
          'You cannot delete yourself as staff or super_user',
        );
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('deleteManyOrganizations', () => {
    it('should delete many organizations', async () => {
      const rowsAffected = organizationsMock.length;
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      UsersServiceMock.getUserByOrganizationId.mockResolvedValue(userMock);
      jest
        .spyOn(
          validateIfHostUserIdIsInUsersIdsToDelete,
          'validateIfHostUserIdIsInUsersIdsToDelete',
        )
        .mockImplementation();
      UsersServiceMock.delete.mockResolvedValue(rowsAffected);

      const result = await service.deleteManyOrganizations(sessionMock, [
        organizationsMock[0].id,
        organizationsMock[1].id,
      ]);
      expect(result).toBeDefined();
      expect(result).toEqual(rowsAffected);
    });

    it('should throw mindfit exception when validation is not passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      UsersServiceMock.getUserByOrganizationId.mockResolvedValue(userMock);
      jest
        .spyOn(
          validateIfHostUserIdIsInUsersIdsToDelete,
          'validateIfHostUserIdIsInUsersIdsToDelete',
        )
        .mockImplementation(() => {
          throw new MindfitException({
            error: 'You cannot delete yourself as staff or super_user',
            errorCode: 'You cannot delete yourself as staff or super_user',
            statusCode: HttpStatus.BAD_REQUEST,
          });
        });

      try {
        await service.deleteManyOrganizations(sessionMock, [
          organizationsMock[0].id,
          organizationsMock[1].id,
        ]);
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual(
          'You cannot delete yourself as staff or super_user',
        );
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });
  });
});
