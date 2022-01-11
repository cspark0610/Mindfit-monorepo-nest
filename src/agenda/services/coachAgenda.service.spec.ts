import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoachAgendaDto } from '../dto/CoachAgenda.dto';
import { CoachAgenda } from '../models/CoachAgenda.model';
import { CoachAgendaService } from './coachAgenda.service';

describe('CoachAgendaService', () => {
  let service: CoachAgendaService;

  const coachAgendaMock = {
    id: 1,
    coach: {
      id: 1,
    },
    coachAgendaDays: [],
    coachAppointments: [],
    availabilityRange: 'TEST_AVAILABILITY_RANGE',
    outOfService: false,
  };

  const data = {
    coachId: coachAgendaMock.coach.id,
    coachAgendaDays: coachAgendaMock.coachAgendaDays,
    coachAppointments: coachAgendaMock.coachAppointments,
    availabilityRange: coachAgendaMock.availabilityRange,
    outOfService: coachAgendaMock.outOfService,
  };

  const CoachAgendaRepositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachAgendaService,
        {
          provide: getRepositoryToken(CoachAgenda),
          useValue: CoachAgendaRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CoachAgendaService>(CoachAgendaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCoachAgenda', () => {
    beforeAll(() => {
      jest
        .spyOn(CoachAgendaDto, 'from')
        .mockResolvedValue(coachAgendaMock as any);

      CoachAgendaRepositoryMock.save.mockResolvedValue(coachAgendaMock);
    });

    it('Should create a CoachAgenda', async () => {
      const result = await service.createCoachAgenda(data);

      expect(result).toEqual(coachAgendaMock);
      expect(jest.spyOn(CoachAgendaDto, 'from')).toHaveBeenCalledWith(data);
      expect(CoachAgendaRepositoryMock.save).toHaveBeenCalledWith(
        coachAgendaMock,
      );
    });
  });

  describe('editCoachAgendas', () => {
    beforeAll(() => {
      CoachAgendaRepositoryMock.createQueryBuilder.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          raw: [coachAgendaMock],
        }),
      });
    });

    it('Should edit a CoachAgenda', async () => {
      const result = await service.editCoachAgendas(coachAgendaMock.id, data);

      expect(result).toEqual(coachAgendaMock);
      expect(CoachAgendaRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });

    it('Should edit multiple CoachAgendas', async () => {
      const result = await service.editCoachAgendas([coachAgendaMock.id], data);

      expect(result).toEqual([coachAgendaMock]);
      expect(CoachAgendaRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getCoachAgendas', () => {
    beforeAll(() => {
      CoachAgendaRepositoryMock.find.mockResolvedValue([coachAgendaMock]);
    });

    it('Should return multiple CoachAgendas', async () => {
      const result = await service.getCoachAgendas(undefined);

      expect(result).toEqual([coachAgendaMock]);
      expect(CoachAgendaRepositoryMock.find).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getCoachAgenda', () => {
    beforeAll(() => {
      CoachAgendaRepositoryMock.findOne.mockResolvedValue(coachAgendaMock);
    });

    it('Should return a CoachAgenda', async () => {
      const result = await service.getCoachAgenda(coachAgendaMock.id);

      expect(result).toEqual(coachAgendaMock);
      expect(CoachAgendaRepositoryMock.findOne).toHaveBeenCalledWith(
        coachAgendaMock.id,
      );
    });
  });

  describe('deleteCoachAgendas', () => {
    beforeAll(() => {
      CoachAgendaRepositoryMock.createQueryBuilder.mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          affected: 1,
        }),
      });
    });

    it('Should delete a specific CoachAgenda', async () => {
      const result = await service.deleteCoachAgendas(coachAgendaMock.id);

      expect(result).toEqual(1);
      expect(CoachAgendaRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });

    it('Should delete multiple CoachAgendas', async () => {
      const result = await service.deleteCoachAgendas([coachAgendaMock.id]);

      expect(result).toEqual(1);
      expect(CoachAgendaRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
