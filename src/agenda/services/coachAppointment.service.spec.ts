import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoachAppointmentDto } from 'src/agenda/dto/coachAppointment.dto';
import { CoachAppointment } from 'src/agenda/models/coachAppointment.model';
import { CoachAppointmentService } from 'src/agenda/services/coachAppointment.service';

describe('CoachAppointmentService', () => {
  let service: CoachAppointmentService;

  const coachAgendaDayMock = {
    id: 1,
    coachAgenda: {
      id: 1,
    },
    coachee: {
      id: 1,
    },
    coach: {
      id: 1,
    },
    coachingSession: {
      id: 1,
    },
    title: 'TEST_TITLE',
    date: new Date(),
    remarks: 'TEST_REMARKS',
    coacheeConfirmation: new Date(),
    coachConfirmation: new Date(),
    accomplished: false,
  };

  const data = {
    coachAgendaId: coachAgendaDayMock.coachAgenda.id,
    coacheeId: coachAgendaDayMock.coachee.id,
    title: coachAgendaDayMock.title,
    date: coachAgendaDayMock.date,
    remarks: coachAgendaDayMock.remarks,
    coacheeConfirmation: coachAgendaDayMock.coacheeConfirmation,
    coachConfirmation: coachAgendaDayMock.coachConfirmation,
    accomplished: coachAgendaDayMock.accomplished,
  };

  const coachAppointmentRepositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachAppointmentService,
        {
          provide: getRepositoryToken(CoachAppointment),
          useValue: coachAppointmentRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CoachAppointmentService>(CoachAppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCoachAppointment', () => {
    beforeAll(() => {
      jest
        .spyOn(CoachAppointmentDto, 'from')
        .mockResolvedValue(coachAgendaDayMock as any);

      coachAppointmentRepositoryMock.save.mockResolvedValue(coachAgendaDayMock);
    });

    it('Should create a CoachAppointment', async () => {
      const result = await service.createCoachAppointment(data);

      expect(result).toEqual(coachAgendaDayMock);
      expect(jest.spyOn(CoachAppointmentDto, 'from')).toHaveBeenCalledWith(
        data,
      );
      expect(coachAppointmentRepositoryMock.save).toHaveBeenCalledWith(
        coachAgendaDayMock,
      );
    });
  });

  describe('editCoachAppointments', () => {
    beforeAll(() => {
      coachAppointmentRepositoryMock.createQueryBuilder.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          raw: [coachAgendaDayMock],
        }),
      });
    });

    it('Should edit a CoachAppointment', async () => {
      const result = await service.editCoachAppointments(
        coachAgendaDayMock.id,
        data,
      );

      expect(result).toEqual(coachAgendaDayMock);
      expect(
        coachAppointmentRepositoryMock.createQueryBuilder,
      ).toHaveBeenCalled();
    });

    it('Should edit multiple CoachAppointments', async () => {
      const result = await service.editCoachAppointments(
        [coachAgendaDayMock.id],
        data,
      );

      expect(result).toEqual([coachAgendaDayMock]);
      expect(
        coachAppointmentRepositoryMock.createQueryBuilder,
      ).toHaveBeenCalled();
    });
  });

  describe('getCoachAppointments', () => {
    beforeAll(() => {
      coachAppointmentRepositoryMock.find.mockResolvedValue([
        coachAgendaDayMock,
      ]);
    });

    it('Should return multiple CoachAppointments', async () => {
      const result = await service.getCoachAppointments(undefined);

      expect(result).toEqual([coachAgendaDayMock]);
      expect(coachAppointmentRepositoryMock.find).toHaveBeenCalledWith(
        undefined,
      );
    });
  });

  describe('getCoachAppointment', () => {
    beforeAll(() => {
      coachAppointmentRepositoryMock.findOne.mockResolvedValue(
        coachAgendaDayMock,
      );
    });

    it('Should return a CoachAppointment', async () => {
      const result = await service.getCoachAppointment(coachAgendaDayMock.id);

      expect(result).toEqual(coachAgendaDayMock);
      expect(coachAppointmentRepositoryMock.findOne).toHaveBeenCalledWith(
        coachAgendaDayMock.id,
      );
    });
  });

  describe('deleteCoachAppointments', () => {
    beforeAll(() => {
      coachAppointmentRepositoryMock.createQueryBuilder.mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          affected: 1,
        }),
      });
    });

    it('Should delete a specific CoachAppointment', async () => {
      const result = await service.deleteCoachAppointments(
        coachAgendaDayMock.id,
      );

      expect(result).toEqual(1);
      expect(
        coachAppointmentRepositoryMock.createQueryBuilder,
      ).toHaveBeenCalled();
    });

    it('Should delete multiple CoachAppointments', async () => {
      const result = await service.deleteCoachAppointments([
        coachAgendaDayMock.id,
      ]);

      expect(result).toEqual(1);
      expect(
        coachAppointmentRepositoryMock.createQueryBuilder,
      ).toHaveBeenCalled();
    });
  });
});
