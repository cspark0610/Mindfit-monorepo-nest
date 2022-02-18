import { Test, TestingModule } from '@nestjs/testing';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { AgoraService } from 'src/agora/services/agora.service';
import { CoachingSessionRepository } from 'src/videoSessions/repositories/coachingSession.repository';
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

  const CoachingSessionRepositoryMock = {
    getQueryBuilder: jest.fn(),
    findAll: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  };

  const AgoraServiceMock = {};

  const CoachAppointmentServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachingSessionService,
        {
          provide: CoachingSessionRepository,
          useValue: CoachingSessionRepositoryMock,
        },
        {
          provide: AgoraService,
          useValue: AgoraServiceMock,
        },
        {
          provide: CoachAppointmentService,
          useValue: CoachAppointmentServiceMock,
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
      CoachingSessionRepositoryMock.create.mockResolvedValue(
        coachingSessionMock,
      );
    });

    it('Should create a CoachingSession', async () => {
      const result = await service.create(data);

      expect(result).toEqual(coachingSessionMock);
      expect(CoachingSessionRepositoryMock.create).toHaveBeenCalledWith(data);
    });
  });

  describe('editCoachingSessions', () => {
    beforeAll(() => {
      CoachingSessionRepositoryMock.update.mockReturnValue(coachingSessionMock);
      CoachingSessionRepositoryMock.updateMany.mockReturnValue([
        coachingSessionMock,
      ]);
    });

    it('Should edit a CoachingSession', async () => {
      const result = await service.update(coachingSessionMock.id, data);

      expect(result).toEqual(coachingSessionMock);
      expect(CoachingSessionRepositoryMock.update).toHaveBeenCalledWith(
        coachingSessionMock.id,
        data,
      );
    });

    it('Should edit multiple CoachingSessions', async () => {
      const result = await service.updateMany([coachingSessionMock.id], data);

      expect(result).toEqual([coachingSessionMock]);
      expect(CoachingSessionRepositoryMock.updateMany).toHaveBeenCalledWith(
        [coachingSessionMock.id],
        data,
      );
    });
  });

  describe('getCoachingSessions', () => {
    beforeAll(() => {
      CoachingSessionRepositoryMock.findAll.mockResolvedValue([
        coachingSessionMock,
      ]);
    });

    it('Should return multiple CoachingSessions', async () => {
      const result = await service.findAll(undefined);

      expect(result).toEqual([coachingSessionMock]);
      expect(CoachingSessionRepositoryMock.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('getCoachingSession', () => {
    beforeAll(() => {
      CoachingSessionRepositoryMock.findOneBy.mockResolvedValue(
        coachingSessionMock,
      );
    });

    it('Should return a CoachingSession', async () => {
      const result = await service.findOne(coachingSessionMock.id);

      expect(result).toEqual(coachingSessionMock);
      expect(CoachingSessionRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: coachingSessionMock.id,
      });
    });
  });

  describe('deleteCoachingSessions', () => {
    beforeAll(() => {
      CoachingSessionRepositoryMock.delete.mockReturnValue(1);
    });

    it('Should delete a specific CoachingSession', async () => {
      const result = await service.delete(coachingSessionMock.id);

      expect(result).toEqual(1);
      expect(CoachingSessionRepositoryMock.delete).toHaveBeenCalledWith(
        coachingSessionMock.id,
      );
    });

    it('Should delete multiple CoachingSessions', async () => {
      const result = await service.delete([coachingSessionMock.id]);

      expect(result).toEqual(1);
      expect(CoachingSessionRepositoryMock.delete).toHaveBeenCalledWith([
        coachingSessionMock.id,
      ]);
    });
  });
});
