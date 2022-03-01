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
import { HistoricalAssigmentRepository } from 'src/coaching/repositories/historicalAssigment.repository';

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
    profilePicture: 'TEST_PROFILE_PICTURE',
    videoPresentation: 'TEST_VIDEO_PRESENTATION',
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
    profilePicture: 'TEST_PROFILE_PICTURE',
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
    role: Roles.COACHEE,
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

  // const suspendedCoacheeMock = {
  //   ...coacheeMock,
  //   isSuspended: true,
  //   isActive: false,
  // };
  // const activatedCoacheeMock = { ...coacheeMock };

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

  const SatReportsServiceMock = {};

  const CoachAppointmentServiceMock = {
    findOneBy: jest.fn(),
  };

  const historicalAssigmentRepositoryMock = {};

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
          provide: HistoricalAssigmentRepository,
          useValue: historicalAssigmentRepositoryMock,
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
      CoacheeRepositoryMock.create.mockReturnValue(coacheeMock);
    });

    it('Should create a Coachee', async () => {
      const result = await service.create(data);

      expect(result).toEqual(coacheeMock);
      expect(CoacheeRepositoryMock.create).toHaveBeenCalledWith(data);
    });
  });

  describe('editCoachees', () => {
    beforeAll(() => {
      CoacheeRepositoryMock.update.mockReturnValue(coacheeMock);
      CoacheeRepositoryMock.updateMany.mockReturnValue([coacheeMock]);
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
      const result = await service.findAll();

      expect(result).toEqual([coacheeMock]);
      expect(CoacheeRepositoryMock.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('getCoachee', () => {
    beforeAll(() => {
      CoacheeRepositoryMock.findOneBy.mockResolvedValue(coacheeMock);
    });

    it('Should return a Coach', async () => {
      const result = await service.findOne(coacheeMock.id);

      expect(result).toEqual(coacheeMock);
      expect(CoacheeRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: coacheeMock.id,
      });
    });
  });

  describe('deleteCoachees', () => {
    beforeAll(() => {
      CoacheeRepositoryMock.delete.mockReturnValue(1);
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
      expect(UsersServiceMock.findOne).toHaveBeenCalledWith(userMock.id);
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

  describe('acceptInvitattion', () => {
    it('should returns a coachee when all validations are passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);

      CoacheeRepositoryMock.update.mockResolvedValue({
        ...coachMock,
        invitationAccepted: true,
      });

      expect(service.acceptInvitation(userMock.id)).resolves.toEqual(
        userMock.coachee,
      );
    });

    it('throws new mindfit error when user is not a coachee', async () => {
      UsersServiceMock.findOne.mockResolvedValue({
        ...userMock,
        coachee: null,
      });
      await expect(service.acceptInvitation(userMock.id)).rejects.toThrow(
        MindfitException,
      );
    });

    it('throws new mindfit error when user has not a coachee role', async () => {
      UsersServiceMock.findOne.mockResolvedValue({
        ...userMock,
        role: Roles.STAFF,
      });
      await expect(service.acceptInvitation(userMock.id)).rejects.toThrow(
        MindfitException,
      );
    });

    it('throws new mindfit error when user has not a invitation', async () => {
      UsersServiceMock.findOne.mockResolvedValue({
        ...userMock,
        coachee: { ...coacheeMock, invited: false },
      });
      await expect(service.acceptInvitation(userMock.id)).rejects.toThrow(
        MindfitException,
      );
    });
  });

  describe('selectCoach', () => {
    xit('should update assignedCoach field when a coachee selects a Coach successfully', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);

      SuggestedCoachesServiceMock.findOne.mockResolvedValue(
        SuggestedCoachesMock,
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
      UsersServiceMock.findOne.mockResolvedValue({
        ...userMock,
        coachee: null,
      });
      await expect(
        service.selectCoach(userMock.id, userMock.coach.id, coachMock.id),
      ).rejects.toThrow(MindfitException);
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

    xit('throws new mindfit error when "The Coach is not in suggestion"', async () => {
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

  // describe('suspendCoacheeByOrganization', () => {
  //   const suspendUpdateData = { isSuspended: true, isActive: false };
  //   it('should return a suspended coachee when validations are passed', async () => {
  //     UsersServiceMock.findOne.mockResolvedValue(userMock);
  //     CoacheeServiceMock.findOne.mockResolvedValue(suspendedCoacheeMock);
  //     CoacheeServiceMock.updateCoachee.mockResolvedValue(suspendedCoacheeMock);

  //     const result = await resolver.suspendCoacheeByOrganization(
  //       sessionMock,
  //       coacheeMock.id,
  //     );
  //     expect(UsersServiceMock.findOne).toHaveBeenCalled();
  //     expect(CoacheeServiceMock.findOne).toHaveBeenCalled();
  //     expect(CoacheeServiceMock.updateCoachee).toHaveBeenCalled();
  //     expect(result).toBeDefined();
  //     expect(result).toEqual(suspendedCoacheeMock);
  //     expect(result.isSuspended).toBe(suspendUpdateData.isSuspended);
  //     expect(result.isActive).toBe(suspendUpdateData.isActive);
  //   });
  // });

  // describe('activateCoacheeByOrganization', () => {
  //   const activateUpdateData = { isSuspended: false, isActive: true };
  //   it('should return a activated coachee when validations are passed', async () => {
  //     UsersServiceMock.findOne.mockResolvedValue(userMock);
  //     CoacheeServiceMock.findOne.mockResolvedValue(activatedCoacheeMock);
  //     CoacheeServiceMock.updateCoachee.mockResolvedValue(activatedCoacheeMock);

  //     const result = await resolver.suspendCoacheeByOrganization(
  //       sessionMock,
  //       coacheeMock.id,
  //     );
  //     expect(UsersServiceMock.findOne).toHaveBeenCalled();
  //     expect(CoacheeServiceMock.findOne).toHaveBeenCalled();
  //     expect(CoacheeServiceMock.updateCoachee).toHaveBeenCalled();
  //     expect(result).toBeDefined();
  //     expect(result).toEqual(activatedCoacheeMock);
  //     expect(result.isSuspended).toBe(activateUpdateData.isSuspended);
  //     expect(result.isActive).toBe(activateUpdateData.isActive);
  //   });
  // });
});
