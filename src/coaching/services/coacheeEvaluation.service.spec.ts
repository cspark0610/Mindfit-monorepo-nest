import { Test, TestingModule } from '@nestjs/testing';
import { CoacheeEvaluationRepository } from 'src/coaching/repositories/coacheeEvaluation.repository';
import { CoacheeEvaluationService } from 'src/coaching/services/coacheeEvaluation.service';
import { UsersService } from 'src/users/services/users.service';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { Roles } from 'src/users/enums/roles.enum';
import { User } from 'src/users/models/users.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { Coach } from 'src/coaching/models/coach.model';
import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';
import { HttpStatus } from '@nestjs/common';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { CoachErrors } from '../enums/coachErrors.enum';
import { CoacheeErrors } from 'src/coaching/enums/coacheeErrors.enum';

describe('CoacheeEvaluationService', () => {
  let service: CoacheeEvaluationService;

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
    phoneNumber: 'TEST_PHONE_NUMBER',
    isActive: true,
  } as Coach;

  const coacheeMock = {
    id: 1,
    user: {
      id: 1,
    },
    organization: { id: 1 },
    coachingAreas: [],
    coachAppointments: [],
    coachNotes: [],
    coachingSessions: [],
    coacheeEvaluations: [],
    phoneNumber: 'TEST_PHONE_NUMBER',
    position: 'TEST_POSITION',
    isAdmin: false,
    isActive: true,
    isSuspended: false,
    canViewDashboard: false,
    bio: 'TEST_BIO',
    aboutPosition: 'TEST_ABOUT_POSITION',
    invited: true,
    invitationAccepted: false,
    assignedCoach: {
      id: 1,
    },
  } as Coachee;

  const userMock = {
    id: 1,
    coachee: coacheeMock,
    coach: coachMock,
    name: 'TEST_NAME',
    email: 'TEST_EMAIL@mail.com',
    password: '123',
    role: Roles.COACHEE_OWNER,
  } as User;

  const coacheeEvaluationMock = {
    id: 1,
    coach: coachMock,
    coachee: coacheeMock,
    evaluation: 'TEST_EVALUATION',
  } as CoacheeEvaluation;

  const coacheeEvaluationMock2 = { ...coacheeEvaluationMock, id: 2 };

  const createCoacheeEvaluationDtoMock = {
    coachId: coacheeEvaluationMock.coach.id,
    coacheeId: coacheeEvaluationMock.coachee.id,
    evaluation: coacheeEvaluationMock.evaluation,
  };
  const UpdateCoacheeEvaluationDtoMock = {
    evaluation: 'update evaluation',
  };
  const sessionMock = { userId: 1 } as any;

  const CoacheeEvaluationRepositoryMock = {
    findAll: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  };
  const UsersServiceMock = {
    findOne: jest.fn(),
  };
  const CoacheeServiceMock = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoacheeEvaluationService,
        {
          provide: CoacheeEvaluationRepository,
          useValue: CoacheeEvaluationRepositoryMock,
        },
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
        {
          provide: CoacheeService,
          useValue: CoacheeServiceMock,
        },
      ],
    }).compile();

    service = module.get<CoacheeEvaluationService>(CoacheeEvaluationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllCoacheesEvaluation', () => {
    beforeAll(() => {
      CoacheeEvaluationRepositoryMock.findAll.mockResolvedValue([
        coacheeEvaluationMock,
      ]);
    });
    it('should call findAll and return and array of coacheeEvaluation', async () => {
      const result = await service.findAll({});
      expect(CoacheeEvaluationRepositoryMock.findAll).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
      expect(result).toEqual([coacheeEvaluationMock]);
    });
  });

  describe('findAllCoacheesEvaluationById', () => {
    beforeAll(() => {
      CoacheeEvaluationRepositoryMock.findOneBy.mockResolvedValue(
        coacheeEvaluationMock,
      );
    });
    it('should call findOneBy and return and a coacheeEvaluation by id', async () => {
      const result = await service.findOneBy({
        where: { id: coacheeEvaluationMock.id },
      });
      expect(CoacheeEvaluationRepositoryMock.findOneBy).toHaveBeenCalledWith(
        {
          id: coacheeEvaluationMock.id,
        },
        undefined,
      );
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(coacheeEvaluationMock);
    });
  });

  describe('createCoacheeEvaluation', () => {
    beforeAll(() => {
      CoacheeEvaluationRepositoryMock.create.mockResolvedValue(
        coacheeEvaluationMock,
      );
    });
    it('should call create and return and a new coacheeEvaluation', async () => {
      const result = await service.create(createCoacheeEvaluationDtoMock);
      expect(CoacheeEvaluationRepositoryMock.create).toHaveBeenCalled();
      expect(CoacheeEvaluationRepositoryMock.create).toHaveBeenCalledWith(
        createCoacheeEvaluationDtoMock,
      );
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(coacheeEvaluationMock);
    });
  });

  describe('createManyCoacheeEvaluation', () => {
    beforeAll(() => {
      CoacheeEvaluationRepositoryMock.createMany.mockResolvedValue([
        coacheeEvaluationMock,
        coacheeEvaluationMock2,
      ]);
    });
    it('should call createMany and return and a array of coacheeEvaluation', async () => {
      const result = await service.createMany([
        createCoacheeEvaluationDtoMock,
        createCoacheeEvaluationDtoMock,
      ]);
      expect(CoacheeEvaluationRepositoryMock.createMany).toHaveBeenCalled();
      expect(CoacheeEvaluationRepositoryMock.createMany).toHaveBeenCalledWith([
        createCoacheeEvaluationDtoMock,
        createCoacheeEvaluationDtoMock,
      ]);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(coacheeEvaluationMock);
      expect(result[1]).toEqual(coacheeEvaluationMock2);
    });
  });

  describe('updateCoacheeEvaluation', () => {
    const updatedCoacheeEvaluation = {
      ...coacheeEvaluationMock,
      evaluation: 'update evaluation',
    };
    beforeAll(() => {
      CoacheeEvaluationRepositoryMock.update.mockResolvedValue(
        updatedCoacheeEvaluation,
      );
    });
    it('should call update and return a coacheeEvaluation updated', async () => {
      const result = await service.update(
        coacheeEvaluationMock.id,
        UpdateCoacheeEvaluationDtoMock,
      );
      expect(CoacheeEvaluationRepositoryMock.update).toHaveBeenCalled();
      expect(CoacheeEvaluationRepositoryMock.update).toHaveBeenCalledWith(
        coacheeEvaluationMock.id,
        UpdateCoacheeEvaluationDtoMock,
      );
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(updatedCoacheeEvaluation);
    });
  });

  describe('updateManyCoacheeEvaluation', () => {
    const updatedCoacheeEvaluations = [
      { ...coacheeEvaluationMock, evaluation: 'update evaluation' },
      { ...coacheeEvaluationMock2, evaluation: 'update evaluation' },
    ];
    const ids = [coacheeEvaluationMock.id, coacheeEvaluationMock2.id];
    beforeAll(() => {
      CoacheeEvaluationRepositoryMock.updateMany.mockResolvedValue(
        updatedCoacheeEvaluations,
      );
    });
    it('should call updateMany and return and a array of updated coachees evaluations', async () => {
      const result = await service.updateMany(
        ids,
        UpdateCoacheeEvaluationDtoMock,
      );
      expect(CoacheeEvaluationRepositoryMock.updateMany).toHaveBeenCalled();
      expect(CoacheeEvaluationRepositoryMock.updateMany).toHaveBeenCalledWith(
        ids,
        UpdateCoacheeEvaluationDtoMock,
      );
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(updatedCoacheeEvaluations[0]);
      expect(result[1]).toEqual(updatedCoacheeEvaluations[1]);
    });
  });

  describe('deleteCoacheeEvaluation', () => {
    beforeAll(() => {
      CoacheeEvaluationRepositoryMock.delete.mockResolvedValue(
        coacheeEvaluationMock.id,
      );
    });
    it('should call delete and return the id of the coachee Evaluation deleted', async () => {
      const result = await service.delete(coacheeEvaluationMock.id);
      expect(CoacheeEvaluationRepositoryMock.delete).toHaveBeenCalled();
      expect(CoacheeEvaluationRepositoryMock.delete).toHaveBeenCalledWith(
        coacheeEvaluationMock.id,
      );
      expect(result).toBe(coacheeEvaluationMock.id);
    });
  });

  describe('coachCreateCoacheeEvaluation', () => {
    it('should return a coachee evaluation when all validations are passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);

      CoacheeServiceMock.findOne.mockResolvedValue(coacheeMock);
      CoacheeEvaluationRepositoryMock.create.mockResolvedValue(
        coacheeEvaluationMock,
      );

      await expect(
        Promise.resolve(
          service.coachCreateCoacheeEvaluation(
            sessionMock.userId,
            createCoacheeEvaluationDtoMock,
          ),
        ),
      ).resolves.toEqual(coacheeEvaluationMock);
    });

    it('should throw exception when first validation is not passed', async () => {
      const user = { ...userMock, coach: null };
      UsersServiceMock.findOne.mockResolvedValue(user);

      try {
        await service.coachCreateCoacheeEvaluation(
          sessionMock.userId,
          createCoacheeEvaluationDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe('You do not have a Coach profile');
        expect(error.response.errorCode).toBe(CoachErrors.NO_COACH_PROFILE);
        expect(error.status).toBe(HttpStatus.FORBIDDEN);
      }
    });
    it('should throw exception when second validation is not passed', async () => {
      const user = { ...userMock, coach: { id: 8 } };
      UsersServiceMock.findOne.mockResolvedValue(user);
      CoacheeServiceMock.findOne.mockResolvedValue(coacheeMock);

      try {
        await service.coachCreateCoacheeEvaluation(
          sessionMock.userId,
          createCoacheeEvaluationDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe(
          'The coachee is not assigned to you.',
        );
        expect(error.response.errorCode).toBe(
          CoacheeErrors.COACHEE_NOT_ASSIGNED_TO_COACH,
        );
        expect(error.status).toBe(HttpStatus.FORBIDDEN);
      }
    });
  });

  describe('coachUpdateCoacheeEvaluation', () => {
    const updateCoacheeEvaluationDtoMock = {
      evaluation: 'updatedEvaluation',
    } as any;
    const updatedCoacheeEvaluationMock = {
      ...coacheeEvaluationMock,
      evaluation: updateCoacheeEvaluationDtoMock.evaluation,
    } as CoacheeEvaluation;

    it('should return a coachee evaluation updated when all validations are passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);

      CoacheeEvaluationRepositoryMock.findOneBy.mockResolvedValue(
        coacheeEvaluationMock,
      );

      jest
        .spyOn(service, 'update')
        .mockImplementation(() =>
          Promise.resolve(updatedCoacheeEvaluationMock),
        );

      await expect(
        Promise.resolve(
          service.coachUpdateCoacheeEvaluation(
            sessionMock.userId,
            coacheeEvaluationMock.id,
            updateCoacheeEvaluationDtoMock,
          ),
        ),
      ).resolves.toEqual(updatedCoacheeEvaluationMock);
    });

    it('should throw exception when first validation is not passed', async () => {
      const user = { ...userMock, coach: null };
      UsersServiceMock.findOne.mockResolvedValue(user);

      try {
        await service.coachUpdateCoacheeEvaluation(
          sessionMock.userId,
          coacheeEvaluationMock.id,
          updateCoacheeEvaluationDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe('You do not have a Coach profile');
        expect(error.response.errorCode).toBe(CoachErrors.NO_COACH_PROFILE);
        expect(error.status).toBe(HttpStatus.FORBIDDEN);
      }
    });

    it('should throw exception when second validation is not passed', async () => {
      const user = { ...userMock, coach: { id: 8 } };
      UsersServiceMock.findOne.mockResolvedValue(user);
      CoacheeEvaluationRepositoryMock.findOneBy.mockResolvedValue(
        coacheeEvaluationMock,
      );

      try {
        await service.coachUpdateCoacheeEvaluation(
          sessionMock.userId,
          coacheeEvaluationMock.id,
          updateCoacheeEvaluationDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe(
          'The Coachee Evaluation does not belong to you.',
        );
        expect(error.response.errorCode).toBe(
          CoacheeErrors.NOT_COACHEE_EVALUATION_OWNER,
        );
        expect(error.status).toBe(HttpStatus.FORBIDDEN);
      }
    });

    it('should throw exception when third validation is not passed', async () => {
      const coacheeEvaluation = {
        ...coacheeEvaluationMock,
        coachee: {
          assignedCoach: { id: 8 },
        },
      };
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      CoacheeEvaluationRepositoryMock.findOneBy.mockResolvedValue(
        coacheeEvaluation,
      );

      try {
        await service.coachUpdateCoacheeEvaluation(
          sessionMock.userId,
          coacheeEvaluation.id,
          updateCoacheeEvaluationDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe(
          'The coachee is no longer assigned to you.',
        );
        expect(error.response.errorCode).toBe(
          CoacheeErrors.COACHEE_NOT_ASSIGNED_TO_COACH,
        );
        expect(error.status).toBe(HttpStatus.FORBIDDEN);
      }
    });
  });

  describe('coachDeleteCoacheeEvaluation', () => {
    const affected = 1;
    it('should return the number of coachee evaluation deleted when all validations are passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);

      CoacheeEvaluationRepositoryMock.findOneBy.mockResolvedValue(
        coacheeEvaluationMock,
      );

      jest
        .spyOn(service, 'delete')
        .mockImplementation(() => Promise.resolve(affected));

      await expect(
        Promise.resolve(
          service.coachDeleteCoacheeEvaluation(
            sessionMock.userId,
            coacheeEvaluationMock.id,
          ),
        ),
      ).resolves.toEqual(affected);
    });
  });
});
