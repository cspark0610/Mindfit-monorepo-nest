import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoachAgendaDayDto } from 'src/agenda/dto/coachAgendaDay.dto';
import { CoachAgendaDay } from 'src/agenda/models/coachAgendaDay.model';
import { coachAgendaDayService } from 'src/agenda/services/coachAgendaDay.service';

describe('CoachAgendaDayService', () => {
  let service: coachAgendaDayService;

  const coachAgendaDayMock = {
    id: 1,
    coachAgenda: {
      id: 1,
    },
    day: new Date(),
    availableHours: 'TEST_AVAILABILITY_HOURS',
    exclude: false,
  };

  const data = {
    coachAgendaId: coachAgendaDayMock.coachAgenda.id,
    day: coachAgendaDayMock.day,
    availableHours: coachAgendaDayMock.availableHours,
    exclude: coachAgendaDayMock.exclude,
  };

  const CoachAgendaDayRepositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        coachAgendaDayService,
        {
          provide: getRepositoryToken(CoachAgendaDay),
          useValue: CoachAgendaDayRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<coachAgendaDayService>(coachAgendaDayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCoachAgendaDay', () => {
    beforeAll(() => {
      jest
        .spyOn(CoachAgendaDayDto, 'from')
        .mockResolvedValue(coachAgendaDayMock as any);

      CoachAgendaDayRepositoryMock.save.mockResolvedValue(coachAgendaDayMock);
    });

    it('Should create a CoachAgendaDay', async () => {
      const result = await service.createCoachAgendaDay(data);

      expect(result).toEqual(coachAgendaDayMock);
      expect(jest.spyOn(CoachAgendaDayDto, 'from')).toHaveBeenCalledWith(data);
      expect(CoachAgendaDayRepositoryMock.save).toHaveBeenCalledWith(
        coachAgendaDayMock,
      );
    });
  });

  describe('editCoachAgendaDays', () => {
    beforeAll(() => {
      CoachAgendaDayRepositoryMock.createQueryBuilder.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          raw: [coachAgendaDayMock],
        }),
      });
    });

    it('Should edit a CoachAgendaDay', async () => {
      const result = await service.editCoachAgendaDays(
        coachAgendaDayMock.id,
        data,
      );

      expect(result).toEqual(coachAgendaDayMock);
      expect(
        CoachAgendaDayRepositoryMock.createQueryBuilder,
      ).toHaveBeenCalled();
    });

    it('Should edit multiple CoachAgendaDays', async () => {
      const result = await service.editCoachAgendaDays(
        [coachAgendaDayMock.id],
        data,
      );

      expect(result).toEqual([coachAgendaDayMock]);
      expect(
        CoachAgendaDayRepositoryMock.createQueryBuilder,
      ).toHaveBeenCalled();
    });
  });

  describe('getCoachAgendaDays', () => {
    beforeAll(() => {
      CoachAgendaDayRepositoryMock.find.mockResolvedValue([coachAgendaDayMock]);
    });

    it('Should return multiple CoachAgendaDays', async () => {
      const result = await service.getCoachAgendaDays(undefined);

      expect(result).toEqual([coachAgendaDayMock]);
      expect(CoachAgendaDayRepositoryMock.find).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getCoachAgendaDay', () => {
    beforeAll(() => {
      CoachAgendaDayRepositoryMock.findOne.mockResolvedValue(
        coachAgendaDayMock,
      );
    });

    it('Should return a CoachAgendaDay', async () => {
      const result = await service.getCoachAgendaDay(coachAgendaDayMock.id);

      expect(result).toEqual(coachAgendaDayMock);
      expect(CoachAgendaDayRepositoryMock.findOne).toHaveBeenCalledWith(
        coachAgendaDayMock.id,
      );
    });
  });

  describe('deleteCoachAgendaDays', () => {
    beforeAll(() => {
      CoachAgendaDayRepositoryMock.createQueryBuilder.mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          affected: 1,
        }),
      });
    });

    it('Should delete a specific CoachAgendaDay', async () => {
      const result = await service.deleteCoachAgendaDays(coachAgendaDayMock.id);

      expect(result).toEqual(1);
      expect(
        CoachAgendaDayRepositoryMock.createQueryBuilder,
      ).toHaveBeenCalled();
    });

    it('Should delete multiple CoachAgendaDays', async () => {
      const result = await service.deleteCoachAgendaDays([
        coachAgendaDayMock.id,
      ]);

      expect(result).toEqual(1);
      expect(
        CoachAgendaDayRepositoryMock.createQueryBuilder,
      ).toHaveBeenCalled();
    });
  });
});
