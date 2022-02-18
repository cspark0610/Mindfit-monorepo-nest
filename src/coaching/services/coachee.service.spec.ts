import { Test, TestingModule } from '@nestjs/testing';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';
import { AwsSesService } from 'src/aws/services/ses.service';
import { CoacheeRepository } from 'src/coaching/repositories/coachee.repository';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { SuggestedCoachesService } from 'src/coaching/services/suggestedCoaches.service';
import { SatReportsService } from 'src/evaluationTests/services/satReport.service';
import { UsersService } from 'src/users/services/users.service';

describe('CoacheeService', () => {
  let service: CoacheeService;

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
    canViewDashboard: false,
    bio: 'TEST_BIO',
    aboutPosition: 'TEST_ABOUT_POSITION',
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
  };

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

  const AwsSesServiceMock = {};

  const UsersServiceMock = {};

  const SuggestedCoachesServiceMock = {};

  const SatReportsServiceMock = {};

  const CoachAppointmentServiceMock = {};

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

  describe('deleteCoachs', () => {
    beforeAll(() => {
      CoacheeRepositoryMock.delete.mockReturnValue(1);
    });

    it('Should delete a specific Coach', async () => {
      const result = await service.delete(coacheeMock.id);

      expect(result).toEqual(1);
      expect(CoacheeRepositoryMock.delete).toHaveBeenCalledWith(coacheeMock.id);
    });

    it('Should delete multiple Coachs', async () => {
      const result = await service.delete([coacheeMock.id]);

      expect(result).toEqual(1);
      expect(CoacheeRepositoryMock.delete).toHaveBeenCalledWith([
        coacheeMock.id,
      ]);
    });
  });
});
