import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CoachNoteDto } from '../dto/coachNote.dto';
import { CoachNote } from '../models/coachNote.model';
import { CoachNoteService } from './coachNote.service';

describe('CoachNoteService', () => {
  let service: CoachNoteService;

  const coachNoteMock = {
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
    note: 'TEST_NOTE',
  };

  const data = {
    coachId: coachNoteMock.coach.id,
    coacheeId: coachNoteMock.coachee.id,
    note: coachNoteMock.note,
  };

  const CoachNoteRepositoryMock = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachNoteService,
        {
          provide: getRepositoryToken(CoachNote),
          useValue: CoachNoteRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CoachNoteService>(CoachNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCoachNote', () => {
    beforeAll(() => {
      jest.spyOn(CoachNoteDto, 'from').mockResolvedValue(coachNoteMock as any);

      CoachNoteRepositoryMock.save.mockResolvedValue(coachNoteMock);
    });

    it('Should create a CoachNote', async () => {
      const result = await service.createCoachNote(data);

      expect(result).toEqual(coachNoteMock);
      expect(jest.spyOn(CoachNoteDto, 'from')).toHaveBeenCalledWith(data);
      expect(CoachNoteRepositoryMock.save).toHaveBeenCalledWith(coachNoteMock);
    });
  });

  describe('editCoachNotes', () => {
    beforeAll(() => {
      CoachNoteRepositoryMock.createQueryBuilder.mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        returning: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          raw: [coachNoteMock],
        }),
      });
    });

    it('Should edit a CoachNote', async () => {
      const result = await service.editCoachNotes(coachNoteMock.id, data);

      expect(result).toEqual(coachNoteMock);
      expect(CoachNoteRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });

    it('Should edit multiple CoachNotes', async () => {
      const result = await service.editCoachNotes([coachNoteMock.id], data);

      expect(result).toEqual([coachNoteMock]);
      expect(CoachNoteRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('getCoachNotes', () => {
    beforeAll(() => {
      CoachNoteRepositoryMock.find.mockResolvedValue([coachNoteMock]);
    });

    it('Should return multiple CoachNotes', async () => {
      const result = await service.getCoachNotes(undefined);

      expect(result).toEqual([coachNoteMock]);
      expect(CoachNoteRepositoryMock.find).toHaveBeenCalledWith(undefined);
    });
  });

  describe('getCoachNote', () => {
    beforeAll(() => {
      CoachNoteRepositoryMock.findOne.mockResolvedValue(coachNoteMock);
    });

    it('Should return a CoachNote', async () => {
      const result = await service.getCoachNote(coachNoteMock.id);

      expect(result).toEqual(coachNoteMock);
      expect(CoachNoteRepositoryMock.findOne).toHaveBeenCalledWith(
        coachNoteMock.id,
      );
    });
  });

  describe('deleteCoachNotes', () => {
    beforeAll(() => {
      CoachNoteRepositoryMock.createQueryBuilder.mockReturnValue({
        delete: jest.fn().mockReturnThis(),
        whereInIds: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({
          affected: 1,
        }),
      });
    });

    it('Should delete a specific CoachNote', async () => {
      const result = await service.deleteCoachNotes(coachNoteMock.id);

      expect(result).toEqual(1);
      expect(CoachNoteRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });

    it('Should delete multiple CoachNotes', async () => {
      const result = await service.deleteCoachNotes([coachNoteMock.id]);

      expect(result).toEqual(1);
      expect(CoachNoteRepositoryMock.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
