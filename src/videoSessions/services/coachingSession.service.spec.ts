import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoachingSessionDto } from 'src/videoSessions/dto/coachingSession.dto';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';
import { CoachingSessionService } from 'src/videoSessions/services/coachingSession.service';

describe('CoachingSessionService', () => {
  let service: CoachingSessionService;

  const coachingSessionMock = {
    id: 1,
    coach: {
      id: 1,
    },
    coachee: {
      id: 1,
    },
    appointmentRelated: {
      id: 1,
    },
    name: 'TEST_NAME',
    remarks: 'TEST_REMARKS',
    area: 'TEST_AREA',
    coachFeedback: 'TEST_COACH_FEEDBACK',
    coachEvaluation: 'TEST_COACH_EVALUATION',
    coacheeFeedback: 'TEST_COACHEE_FEEDBACK',
  };

  const data = {
    coachId: coachingSessionMock.coach.id,
    coacheeId: coachingSessionMock.coachee.id,
    name: coachingSessionMock.name,
    remarks: coachingSessionMock.remarks,
    area: coachingSessionMock.area,
    coachFeedback: coachingSessionMock.coachFeedback,
    coachEvaluation: coachingSessionMock.coachEvaluation,
    coacheeFeedback: coachingSessionMock.coacheeFeedback,
  };

  const coachingSessionRepositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachingSessionService,
        {
          provide: getRepositoryToken(CoachingSession),
          useValue: coachingSessionRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CoachingSessionService>(CoachingSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCoachingSession', () => {
    beforeAll(() => {
      jest
        .spyOn(CoachingSessionDto, 'from')
        .mockResolvedValue(coachingSessionMock as any);

      coachingSessionRepositoryMock.save.mockResolvedValue(coachingSessionMock);
    });

    it('Should create a CoachingSession', async () => {
      const result = await service.createCoachingSession(data);

      expect(result).toEqual(coachingSessionMock);
      expect(jest.spyOn(CoachingSessionDto, 'from')).toHaveBeenCalledWith(data);
      expect(coachingSessionRepositoryMock.save).toHaveBeenCalledWith(
        coachingSessionMock,
      );
    });
  });

  describe('editCoachingSessions', () => {
    beforeAll(() => {
      coachingSessionRepositoryMock.createQueryBuilder.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          raw: [coachingSessionMock],
        }),
      });
    });

    it('Should edit a CoachingSession', async () => {
      const result = await service.editCoachingSessions(
        coachingSessionMock.id,
        data,
      );

      expect(result).toEqual(coachingSessionMock);
      expect(
        coachingSessionRepositoryMock.createQueryBuilder,
      ).toHaveBeenCalled();
    });

    it('Should edit multiple CoachingSessions', async () => {
      const result = await service.editCoachingSessions(
        [coachingSessionMock.id],
        data,
      );

      expect(result).toEqual([coachingSessionMock]);
      expect(
        coachingSessionRepositoryMock.createQueryBuilder,
      ).toHaveBeenCalled();
    });
  });

  describe('getCoachingSessions', () => {
    beforeAll(() => {
      coachingSessionRepositoryMock.find.mockResolvedValue([
        coachingSessionMock,
      ]);
    });

    it('Should return multiple CoachingSessions', async () => {
      const result = await service.getCoachingSessions(undefined);

      expect(result).toEqual([coachingSessionMock]);
      expect(coachingSessionRepositoryMock.find).toHaveBeenCalledWith(
        undefined,
      );
    });
  });

  describe('getCoachingSession', () => {
    beforeAll(() => {
      coachingSessionRepositoryMock.findOne.mockResolvedValue(
        coachingSessionMock,
      );
    });

    it('Should return a CoachingSession', async () => {
      const result = await service.getCoachingSession(coachingSessionMock.id);

      expect(result).toEqual(coachingSessionMock);
      expect(coachingSessionRepositoryMock.findOne).toHaveBeenCalledWith(
        coachingSessionMock.id,
      );
    });
  });

  describe('deleteCoachingSessions', () => {
    beforeAll(() => {
      coachingSessionRepositoryMock.createQueryBuilder.mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          affected: 1,
        }),
      });
    });

    it('Should delete a specific CoachingSession', async () => {
      const result = await service.deleteCoachingSessions(
        coachingSessionMock.id,
      );

      expect(result).toEqual(1);
      expect(
        coachingSessionRepositoryMock.createQueryBuilder,
      ).toHaveBeenCalled();
    });

    it('Should delete multiple CoachingSessions', async () => {
      const result = await service.deleteCoachingSessions([
        coachingSessionMock.id,
      ]);

      expect(result).toEqual(1);
      expect(
        coachingSessionRepositoryMock.createQueryBuilder,
      ).toHaveBeenCalled();
    });
  });
});
