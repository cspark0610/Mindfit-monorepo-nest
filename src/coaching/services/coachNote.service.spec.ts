import { Test, TestingModule } from '@nestjs/testing';
import { CoachNoteRepository } from 'src/coaching/repositories/coachNote.repository';
import { CoachNoteService } from 'src/coaching/services/coachNote.service';
import { UsersService } from 'src/users/services/users.service';
import { CoacheeService } from 'src/coaching/services/coachee.service';
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
    getQueryBuilder: jest.fn(),
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
  const CoacheesServiceMock = {
    findCoacheesByCoachId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachNoteService,
        {
          provide: CoachNoteRepository,
          useValue: CoachNoteRepositoryMock,
        },
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
        {
          provide: CoacheeService,
          useValue: CoacheesServiceMock,
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
      CoachNoteRepositoryMock.create.mockResolvedValue(coachNoteMock);
    });

    it('Should create a CoachNote', async () => {
      const result = await service.create(data);

      expect(result).toEqual(coachNoteMock);
      expect(CoachNoteRepositoryMock.create).toHaveBeenCalledWith(data);
    });
  });

  describe('editCoachNotes', () => {
    beforeAll(() => {
      CoachNoteRepositoryMock.update.mockReturnValue(coachNoteMock);
      CoachNoteRepositoryMock.updateMany.mockReturnValue([coachNoteMock]);
    });

    it('Should edit a CoachNote', async () => {
      const result = await service.update(coachNoteMock.id, data);

      expect(result).toEqual(coachNoteMock);
      expect(CoachNoteRepositoryMock.update).toHaveBeenCalledWith(
        coachNoteMock.id,
        data,
      );
    });

    it('Should edit multiple CoachNotes', async () => {
      const result = await service.updateMany([coachNoteMock.id], data);

      expect(result).toEqual([coachNoteMock]);
      expect(CoachNoteRepositoryMock.updateMany).toHaveBeenCalledWith(
        [coachNoteMock.id],
        data,
      );
    });
  });

  describe('getCoachNotes', () => {
    beforeAll(() => {
      CoachNoteRepositoryMock.findAll.mockResolvedValue([coachNoteMock]);
    });

    it('Should return multiple CoachNotes', async () => {
      const result = await service.findAll(undefined);

      expect(result).toEqual([coachNoteMock]);
      expect(CoachNoteRepositoryMock.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('getCoachNote', () => {
    beforeAll(() => {
      CoachNoteRepositoryMock.findOneBy.mockResolvedValue(coachNoteMock);
    });

    it('Should return a CoachNote', async () => {
      const result = await service.findOne(coachNoteMock.id);

      expect(result).toEqual(coachNoteMock);
      expect(CoachNoteRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: coachNoteMock.id,
      });
    });
  });

  describe('deleteCoachNotes', () => {
    beforeAll(() => {
      CoachNoteRepositoryMock.delete.mockReturnValue(1);
    });

    it('Should delete a specific CoachNote', async () => {
      const result = await service.delete(coachNoteMock.id);

      expect(result).toEqual(1);
      expect(CoachNoteRepositoryMock.delete).toHaveBeenCalledWith(
        coachNoteMock.id,
      );
    });

    it('Should delete multiple CoachNotes', async () => {
      const result = await service.delete([coachNoteMock.id]);

      expect(result).toEqual(1);
      expect(CoachNoteRepositoryMock.delete).toHaveBeenCalledWith([
        coachNoteMock.id,
      ]);
    });
  });
});
