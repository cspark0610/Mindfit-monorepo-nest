import { Test, TestingModule } from '@nestjs/testing';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { AwsSesService } from 'src/aws/services/ses.service';
import { CoacheeRepository } from 'src/coaching/repositories/coachee.repository';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { SuggestedCoachesService } from 'src/coaching/services/suggestedCoaches.service';
import { SatReportsService } from 'src/evaluationTests/services/satReport.service';
import { UsersService } from 'src/users/services/users.service';
import * as UsersValidators from 'src/users/validators/users.validators';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { Roles } from 'src/users/enums/roles.enum';
import { HistoricalAssigmentService } from 'src/coaching/services/historicalAssigment.service';
import { SatReportEvaluationService } from 'src/evaluationTests/services/satReportEvaluation.service';
import { AwsS3Service } from 'src/aws/services/s3.service';
import { OrganizationsService } from 'src/organizations/services/organizations.service';
import { actionType } from 'src/coaching/enums/actionType.enum';
import * as validateIfHostUserIsSuspendingOrActivatingHimself from 'src/coaching/validators/coachee.validators';
import * as validateIfCoacheeToSuspenIsInCoacheeOrganization from 'src/coaching/validators/coachee.validators';
import * as validateIfUserHasCoacheeProfile from 'src/users/validators/users.validators';
import * as validateIfUserHasCoacheeRole from 'src/users/validators/users.validators';
import * as validateIfUserCoacheeIsInvited from 'src/users/validators/users.validators';
import {
  DEFAULT_COACH_IMAGE,
  DEFAULT_COACHEE_IMAGE,
  DEFAULT_COACH_VIDEO,
} from 'src/coaching/utils/coach.constants';
import { HttpStatus } from '@nestjs/common';
import { CoacheeErrors } from 'src/coaching/enums/coacheeErrors.enum';
import { CoachingError } from 'src/coaching/enums/coachingErrors.enum';

describe('CoacheeService', () => {
  let service: CoacheeService;

  const coachMock = {
    id: 1,
    user: {
      id: 1,
    },
    coachApplication: {
      id: 1,
    },
    coachingAreas: [],
    bio: 'TEST_BIO',
    profilePicture: DEFAULT_COACH_IMAGE,
    videoPresentation: DEFAULT_COACH_VIDEO,
    phoneNumber: 'TEST_PHONE_NUMBER',
    isActive: true,
  };

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

  const SuggestedCoachesMock = {
    id: 1,
    coachee: { ...coacheeMock },
    coaches: [
      { ...coachMock, id: 1 },
      { ...coachMock, id: 2 },
      { ...coachMock, id: 3 },
    ],
    rejected: false,
    rejectionReason: 'PORQUE SI',
  };
  // const coachAppointmentMock = {
  //   id: 1,
  //   coach: coachMock,
  //   coachee: coacheeMock,
  //   startDate: new Date(),
  //   endDate: new Date(),
  //   remarks: 'TEST_REMARKS',
  //   accomplished: false,
  // };
  const userMock = {
    id: 1,
    coachee: coacheeMock,
    coach: coachMock,
    organization: { id: 1 },
    name: 'TEST_NAME',
    email: 'TEST_EMAIL@mail.com',
    password: '123',
    role: Roles.COACHEE_OWNER,
  };
  const data = {
    userId: coacheeMock.user.id,
    organizationsId: coacheeMock.organizations.map(({ id }) => id),
    coachingAreasId: coacheeMock.coachingAreas.map(({ id }) => id),
    phoneNumber: coacheeMock.phoneNumber,
    profilePicture: coacheeMock.profilePicture,
    position: coacheeMock.position,
    isAdmin: coacheeMock.isAdmin,
    canViewDashboard: coacheeMock.canViewDashboard,
    bio: coacheeMock.bio,
    aboutPosition: coacheeMock.aboutPosition,
    invited: coacheeMock.invited,
    invitationAccepted: coacheeMock.invitationAccepted,
    //user: userMock,
  };

  // const sessionMock = {
  //   userId: 1,
  //   email: 'TEST_EMAIL@mail.com',
  //   role: Roles.COACHEE,
  //   organization: { id: 1 } as any,
  //   coachee: {
  //     id: 1,
  //     organization: {
  //       id: 1,
  //     },
  //     isAdmin: true,
  //   },
  // };

  const AwsSesServiceMock = {
    sendEmail: jest.fn(),
  };

  const UsersServiceMock = {
    findOne: jest.fn(),
    createInvitedUser: jest.fn(),
    update: jest.fn(),
  };

  const SuggestedCoachesServiceMock = {
    findOne: jest.fn(),
    coaches: {
      find: jest.fn(),
    },
  };
  const historicalAssigmentMock = {
    id: 1,
    coachee: coacheeMock,
    coach: coachMock,
    assidmentDate: new Date(),
  };

  const SatReportsServiceMock = {};

  const CoachAppointmentServiceMock = {
    findOneBy: jest.fn(),
  };

  const HistoricalAssigmentServiceMock = {
    create: jest.fn(),
  };

  const SatReportEvaluationServiceMock = {};

  const AwsS3ServiceMock = {};

  const OrganizationsServiceMock = {};

  const CoacheeRepositoryMock = {
    getQueryBuilder: jest.fn(),
    findAll: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoacheeService,
        {
          provide: CoacheeRepository,
          useValue: CoacheeRepositoryMock,
        },
        {
          provide: AwsSesService,
          useValue: AwsSesServiceMock,
        },
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
        {
          provide: SuggestedCoachesService,
          useValue: SuggestedCoachesServiceMock,
        },
        {
          provide: SatReportsService,
          useValue: SatReportsServiceMock,
        },
        {
          provide: CoachAppointmentService,
          useValue: CoachAppointmentServiceMock,
        },
        {
          provide: HistoricalAssigmentService,
          useValue: HistoricalAssigmentServiceMock,
        },
        {
          provide: SatReportEvaluationService,
          useValue: SatReportEvaluationServiceMock,
        },
        {
          provide: AwsS3Service,
          useValue: AwsS3ServiceMock,
        },
        {
          provide: OrganizationsService,
          useValue: OrganizationsServiceMock,
        },
      ],
    }).compile();

    service = module.get<CoacheeService>(CoacheeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCoachee', () => {
    beforeAll(() => {
      CoacheeRepositoryMock.create.mockResolvedValue(coacheeMock);
    });

    it('Should create a Coachee', async () => {
      const result = await service.create(data);

      expect(result).toEqual(coacheeMock);
      expect(CoacheeRepositoryMock.create).toHaveBeenCalledWith(data);
    });
  });

  describe('editCoachees', () => {
    beforeAll(() => {
      CoacheeRepositoryMock.update.mockResolvedValue(coacheeMock);
      CoacheeRepositoryMock.updateMany.mockResolvedValue([coacheeMock]);
    });

    it('Should edit a Coachee', async () => {
      const result = await service.update(coacheeMock.id, data);

      expect(result).toEqual(coacheeMock);
      expect(CoacheeRepositoryMock.update).toHaveBeenCalledWith(
        coacheeMock.id,
        data,
      );
    });

    it('Should edit multiple Coachees', async () => {
      const result = await service.updateMany([coacheeMock.id], data);

      expect(result).toEqual([coacheeMock]);
      expect(CoacheeRepositoryMock.updateMany).toHaveBeenCalledWith(
        [coacheeMock.id],
        data,
      );
    });
  });

  describe('getCoachees', () => {
    beforeAll(() => {
      CoacheeRepositoryMock.findAll.mockResolvedValue([coacheeMock]);
    });

    it('Should return multiple Coachs', async () => {
      const result = await service.findAll({});

      expect(result).toEqual([coacheeMock]);
      expect(CoacheeRepositoryMock.findAll).toHaveBeenCalledWith({}, undefined);
    });
  });

  describe('getCoachee', () => {
    beforeAll(() => {
      CoacheeRepositoryMock.findOneBy.mockResolvedValue(coacheeMock);
    });

    it('Should return a Coach', async () => {
      const result = await service.findOne({ id: coacheeMock.id });

      expect(result).toEqual(coacheeMock);
      expect(CoacheeRepositoryMock.findOneBy).toHaveBeenCalledWith(
        {
          id: coacheeMock.id,
        },
        undefined,
      );
    });
  });

  describe('deleteCoachees', () => {
    beforeAll(() => {
      CoacheeRepositoryMock.delete.mockResolvedValue(1);
    });

    it('Should delete a specific Coachee', async () => {
      const result = await service.delete(coacheeMock.id);

      expect(result).toEqual(1);
      expect(CoacheeRepositoryMock.delete).toHaveBeenCalledWith(coacheeMock.id);
    });

    it('Should delete multiple Coachees', async () => {
      const result = await service.delete([coacheeMock.id]);

      expect(result).toEqual(1);
      expect(CoacheeRepositoryMock.delete).toHaveBeenCalledWith([
        coacheeMock.id,
      ]);
    });
  });

  describe('invite Coachee', () => {
    const inviteCoacheeQueryRelationsMock = {
      ref: 'user',
      relations: [
        ['user.organization', 'organization'],
        ['user.coachee', 'coachee'],
        ['coachee.organization', 'coacheeOrganization'],
      ],
    };
    it('should return a coachee when all validations are passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);

      jest
        .spyOn(UsersValidators, 'ownOrganization')
        .mockImplementation()
        .mockReturnValue(true);
      UsersServiceMock.createInvitedUser.mockResolvedValue({
        user: userMock,
        password: '123',
      });

      jest
        .spyOn(service, 'create')
        .mockImplementation()
        .mockResolvedValue(coacheeMock as any);
      UsersServiceMock.update.mockResolvedValue(userMock);
      AwsSesServiceMock.sendEmail.mockResolvedValue({} as any);

      const result = await service.inviteCoachee(
        coacheeMock.user.id,
        data as any,
      );
      expect(result).toEqual(coacheeMock);

      expect(UsersServiceMock.findOne).toHaveBeenCalledTimes(1);
      expect(UsersServiceMock.findOne).toHaveBeenCalledWith({
        id: userMock.id,
        relations: inviteCoacheeQueryRelationsMock,
      });
      expect(UsersServiceMock.createInvitedUser).toHaveBeenCalledTimes(1);
      expect(AwsSesServiceMock.sendEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw new mindfit Error when user has own Organization', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      jest
        .spyOn(UsersValidators, 'ownOrganization')
        .mockImplementation()
        .mockReturnValue(false);
      await expect(
        service.inviteCoachee(coacheeMock.user.id, data as any),
      ).rejects.toThrow(MindfitException);
    });

    it('should throw new mindfit Error when user has own Organization and is admin of his own organization', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      jest
        .spyOn(UsersValidators, 'ownOrganization')
        .mockImplementation()
        .mockReturnValue(false);
      jest
        .spyOn(UsersValidators, 'isOrganizationAdmin')
        .mockImplementation()
        .mockReturnValue(false);
      await expect(
        service.inviteCoachee(coacheeMock.user.id, data as any),
      ).rejects.toThrow(MindfitException);
    });
  });

  describe('acceptInvitation', () => {
    it('should returns a coachee when all validations are passed', async () => {
      const coacheeInvitationAcceptedMock = {
        ...coacheeMock,
        invitationAccepted: true,
      };
      UsersServiceMock.findOne.mockResolvedValue(userMock);

      jest
        .spyOn(
          validateIfUserHasCoacheeProfile,
          'validateIfUserHasCoacheeProfile',
        )
        .mockImplementation();
      jest
        .spyOn(validateIfUserHasCoacheeRole, 'validateIfUserHasCoacheeRole')
        .mockImplementation();
      jest
        .spyOn(validateIfUserCoacheeIsInvited, 'validateIfUserCoacheeIsInvited')
        .mockImplementation();

      jest
        .spyOn(service, 'update')
        .mockImplementation()
        .mockResolvedValue(coacheeInvitationAcceptedMock as any);
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(coacheeInvitationAcceptedMock as any);
      const result = await service.acceptInvitation(userMock.id);
      expect(result).toBeDefined();
      expect(result).toEqual(coacheeInvitationAcceptedMock);
    });

    it('throws new mindfit error when user dont have a coachee profile', async () => {
      UsersServiceMock.findOne.mockImplementation(() => {
        throw new MindfitException({
          error: `The user does not have a coachee profile`,
          errorCode: CoacheeErrors.NO_COACHEE_PROFILE,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      });
      try {
        await service.acceptInvitation(userMock.id);
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.errorCode).toEqual(
          CoacheeErrors.NO_COACHEE_PROFILE,
        );
        expect(error.response.error).toEqual(
          `The user does not have a coachee profile`,
        );
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });

    it('throws new mindfit error when user has not a coachee role', async () => {
      UsersServiceMock.findOne.mockImplementation(() => {
        throw new MindfitException({
          error: `The coachee profile does not have a COACHEE role.`,
          errorCode: CoacheeErrors.NO_COACHEE_ROLE,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      });
      try {
        await service.acceptInvitation(userMock.id);
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.errorCode).toEqual(CoacheeErrors.NO_COACHEE_ROLE);
        expect(error.response.error).toEqual(
          `The coachee profile does not have a COACHEE role.`,
        );
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });

    it('throws new mindfit error when user has not an invitation', async () => {
      jest
        .spyOn(service, 'update')
        .mockImplementation()
        .mockResolvedValue({ ...userMock, invitationAccepted: false } as any);

      UsersServiceMock.findOne.mockImplementation(() => {
        throw new MindfitException({
          error: `Coachee id ${userMock.coachee.id} has no invitation.`,
          errorCode: CoacheeErrors.COACHEE_NOT_INVITED,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      });
      try {
        await service.acceptInvitation(userMock.id);
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.errorCode).toEqual(
          CoacheeErrors.COACHEE_NOT_INVITED,
        );
        expect(error.response.error).toEqual(
          `Coachee id ${userMock.coachee.id} has no invitation.`,
        );
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('selectCoach', () => {
    it('should update assignedCoach field when a coachee selects a Coach successfully', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);

      SuggestedCoachesServiceMock.findOne.mockResolvedValue(
        SuggestedCoachesMock,
      );
      HistoricalAssigmentServiceMock.create.mockResolvedValue(
        historicalAssigmentMock,
      );

      CoacheeRepositoryMock.update.mockResolvedValue({
        ...coacheeMock,
        assignedCoach: coachMock,
      });
      const result = await service.selectCoach(
        userMock.id,
        userMock.coach.id,
        coachMock.id,
      );
      expect(result.assignedCoach).toBeDefined();
      expect(result.assignedCoach).toBeInstanceOf(Object);
      expect(result.assignedCoach).toEqual(coachMock);
    });

    it('throws new mindfit error when user does not have a coachee profile', async () => {
      UsersServiceMock.findOne.mockImplementation(() => {
        throw new MindfitException({
          error: `The user does not have a coachee profile`,
          errorCode: CoacheeErrors.NO_COACHEE_PROFILE,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      });
      try {
        await service.selectCoach(userMock.id, userMock.coach.id, coachMock.id);
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.errorCode).toEqual(
          CoacheeErrors.NO_COACHEE_PROFILE,
        );
        expect(error.response.error).toEqual(
          `The user does not have a coachee profile`,
        );
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });

    it('throws new mindfit error when user has already a coach assigned', async () => {
      UsersServiceMock.findOne.mockResolvedValue({
        ...userMock,
        coachee: {
          ...coacheeMock,
          assignedCoach: coachMock,
        },
      });
      await expect(
        service.selectCoach(userMock.id, userMock.coach.id, coachMock.id),
      ).rejects.toThrow(MindfitException);
    });

    it('throws new mindfit error when "The Coach is not in suggestion"', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      SuggestedCoachesServiceMock.findOne.mockResolvedValue({
        ...SuggestedCoachesMock,
        coaches: [],
      });
      await expect(
        service.selectCoach(userMock.id, userMock.coach.id, coachMock.id),
      ).rejects.toThrow(MindfitException);
    });
  });

  describe('suspendOrActivateCoachee', () => {
    const suspendUpdateData = { isSuspended: true, isActive: false };
    const suspendedCoacheeMock = { ...coacheeMock, isSuspended: true };

    const userOwnerMock = { ...userMock, id: 2 };
    it('should return a suspended coachee when validations are passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userOwnerMock);
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue(coacheeMock as any);
      jest
        .spyOn(
          validateIfHostUserIsSuspendingOrActivatingHimself,
          'validateIfHostUserIsSuspendingOrActivatingHimself',
        )
        .mockImplementation();
      jest
        .spyOn(
          validateIfCoacheeToSuspenIsInCoacheeOrganization,
          'validateIfCoacheeToSuspenIsInCoacheeOrganization',
        )
        .mockImplementation();

      jest
        .spyOn(service, 'update')
        .mockImplementation()
        .mockResolvedValue(suspendedCoacheeMock as any);

      const result = await service.suspendOrActivateCoachee(
        userOwnerMock.id,
        coacheeMock.id,
        actionType.SUSPEND,
      );

      expect(UsersServiceMock.findOne).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result).toEqual(suspendedCoacheeMock);
      expect(result.isSuspended).toBe(suspendUpdateData.isSuspended);
    });

    it('throws new mindfit error when hostUser is suspending himself', async () => {
      UsersServiceMock.findOne.mockImplementation(() => {
        throw new MindfitException({
          error: 'You cannot suspend your own profile',
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: CoachingError.ACTION_NOT_ALLOWED,
        });
      });
      try {
        await service.suspendOrActivateCoachee(
          userMock.id,
          coacheeMock.id,
          actionType.SUSPEND,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual(
          'You cannot suspend your own profile',
        );
        expect(error.response.errorCode).toEqual(
          CoachingError.ACTION_NOT_ALLOWED,
        );
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });

    it('throws new mindfit error when hostUser is suspending a coachee from another organization', async () => {
      UsersServiceMock.findOne.mockImplementation(() => {
        throw new MindfitException({
          error:
            'You cannot suspend this Coachee because he/she does not belong to your organization',
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: CoacheeErrors.COACHEE_FROM_ANOTHER_ORGANIZATION,
        });
      });

      try {
        await service.suspendOrActivateCoachee(
          userMock.id,
          coacheeMock.id,
          actionType.SUSPEND,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual(
          'You cannot suspend this Coachee because he/she does not belong to your organization',
        );
        expect(error.response.errorCode).toEqual(
          CoacheeErrors.COACHEE_FROM_ANOTHER_ORGANIZATION,
        );
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });

    it('throws new mindfit error when hostUser is suspending a coachee already suspended', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValue({ ...coacheeMock, isSuspended: true } as any);

      await expect(
        service.suspendOrActivateCoachee(
          userMock.id,
          coacheeMock.id,
          actionType.SUSPEND,
        ),
      ).rejects.toThrow(MindfitException);
    });
  });
});
