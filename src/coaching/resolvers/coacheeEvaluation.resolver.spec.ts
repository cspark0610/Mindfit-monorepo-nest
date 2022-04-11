import { Test, TestingModule } from '@nestjs/testing';
import { CoacheeEvaluationResolver } from 'src/coaching/resolvers/coacheeEvaluation.resolver';
import { CoacheeEvaluationService } from 'src/coaching/services/coacheeEvaluation.service';
import { Coach } from 'src/coaching/models/coach.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoacheeEvaluation } from 'src/coaching/models/coacheeEvaluation.model';

describe('CoacheeEvaluationResolver', () => {
  let resolver: CoacheeEvaluationResolver;

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

  const coacheeEvaluationMock = {
    id: 1,
    coach: coachMock,
    coachee: coacheeMock,
    evaluation: 'TEST_EVALUATION',
  } as CoacheeEvaluation;

  const createCoacheeEvaluationDtoMock = {
    coachId: coacheeEvaluationMock.coach.id,
    coacheeId: coacheeEvaluationMock.coachee.id,
    evaluation: coacheeEvaluationMock.evaluation,
  };
  const sessionMock = { userId: 1 } as any;

  const CoacheeEvaluationServiceMock = {
    coachCreateCoacheeEvaluation: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoacheeEvaluationResolver,
        {
          provide: CoacheeEvaluationService,
          useValue: CoacheeEvaluationServiceMock,
        },
      ],
    }).compile();
    resolver = module.get<CoacheeEvaluationResolver>(CoacheeEvaluationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createCoacheeEvaluation', () => {
    beforeAll(() => {
      CoacheeEvaluationServiceMock.coachCreateCoacheeEvaluation.mockResolvedValue(
        coacheeEvaluationMock,
      );
    });
    it('should call coachCreateCoacheeEvaluation method', async () => {
      const result = await resolver.create(
        sessionMock,
        createCoacheeEvaluationDtoMock,
      );
      expect(
        CoacheeEvaluationServiceMock.coachCreateCoacheeEvaluation,
      ).toHaveBeenCalled();
      expect(result).toEqual(coacheeEvaluationMock);
    });
  });

  describe('updateCoacheeEvaluation', () => {
    const updateCoacheeEvaluationDtoMock = {
      evaluation: 'updatedEvaluation',
    } as any;
    const updatedCoacheeEvaluationMock = {
      ...coacheeEvaluationMock,
      evaluation: updateCoacheeEvaluationDtoMock.evaluation,
    } as CoacheeEvaluation;

    beforeAll(() => {
      CoacheeEvaluationServiceMock.update.mockResolvedValue(
        updatedCoacheeEvaluationMock,
      );
    });
    it('should call update method', async () => {
      const result = await resolver.update(
        coacheeEvaluationMock.id,
        updateCoacheeEvaluationDtoMock,
      );
      expect(CoacheeEvaluationServiceMock.update).toHaveBeenCalled();
      expect(result).toEqual(updatedCoacheeEvaluationMock);
    });
  });

  describe('deleteCoacheeEvaluation', () => {
    const affected = 1;
    beforeAll(() => {
      CoacheeEvaluationServiceMock.delete.mockResolvedValue(affected);
    });
    it('should call delete method', async () => {
      const result = await resolver.delete(coacheeEvaluationMock.id);
      expect(CoacheeEvaluationServiceMock.delete).toHaveBeenCalled();
      expect(result).toEqual(affected);
    });
  });
});
