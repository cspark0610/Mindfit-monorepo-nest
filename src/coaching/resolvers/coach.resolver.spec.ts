import { Test, TestingModule } from '@nestjs/testing';
import { CoachResolver } from 'src/coaching/resolvers/coach.resolver';
import { CoachService } from 'src/coaching/services/coach.service';
import { CoacheeService } from 'src/coaching/services/coachee.service';
//import { Roles } from 'src/users/enums/roles.enum';
//import { CoachDto } from 'src/coaching/dto/coach.dto';

describe('CoachResolver', () => {
  let resolver: CoachResolver;

  const coachDtoMock = {
    bio: 'TEST_BIO',
    coachApplicationId: 1,
    coachingAreas: [],
    profilePicture: 'TEST_PROFILE_PICTURE',
    phoneNumber: 'TEST_PHONE_NUMBER',
    userId: 1,
    videoPresentation: 'TEST_VIDEO_PRESENTATION',
  };
  const editCoachDtoMock = {
    bio: 'update bio',
  };
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
    profilePicture: 'TEST_PROFILE_PICTURE',
    videoPresentation: 'TEST_VIDEO_PRESENTATION',
    phoneNumber: 'TEST_PHONE_NUMBER',
    isActive: true,
  };
  const coachMock2 = { ...coachMock };

  const CoachsServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    getCoachByUserEmail: jest.fn(),
  };

  // const sessionMock = {
  //   userId: 1,
  //   email: 'TEST_EMAIL@mail.com',
  //   role: Roles.COACH,
  // };

  const coacheeServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachResolver,
        {
          provide: CoachService,
          useValue: CoachsServiceMock,
        },
        {
          provide: CoacheeService,
          useValue: coacheeServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<CoachResolver>(CoachResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAllCoaches', () => {
    beforeAll(() => {
      CoachsServiceMock.findAll.mockResolvedValue([coachMock]);
    });
    it('should call findAll and return and array of coaches', async () => {
      const result = await resolver.findAll();
      expect(CoachsServiceMock.findAll).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Array);
      expect(result).toEqual([coachMock]);
    });
  });

  describe('findCoachById', () => {
    beforeAll(() => {
      CoachsServiceMock.findOne.mockResolvedValue(coachMock);
    });
    it('should call findOne and return and a coach by id', async () => {
      const result = await resolver.findOne(coachMock.id);
      expect(CoachsServiceMock.findOne).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(coachMock);
    });
  });

  describe('createCoach', () => {
    beforeAll(() => {
      CoachsServiceMock.create.mockResolvedValue(coachMock);
    });
    it('should call create and return and a new coach', async () => {
      const result = await resolver.create(coachDtoMock);
      expect(CoachsServiceMock.create).toHaveBeenCalled();
      expect(CoachsServiceMock.create).toHaveBeenCalledWith(coachDtoMock);
      expect(result).toBeInstanceOf(Object);
      expect(result).toEqual(coachMock);
    });
  });

  describe('createManyCoach', () => {
    beforeAll(() => {
      CoachsServiceMock.createMany.mockResolvedValue([coachMock, coachMock2]);
    });
    it('should call createMany and return and a array of coachs', async () => {
      const result = await resolver.createMany([coachDtoMock, coachDtoMock]);
      expect(CoachsServiceMock.createMany).toHaveBeenCalled();
      expect(CoachsServiceMock.createMany).toHaveBeenCalledWith([
        coachDtoMock,
        coachDtoMock,
      ]);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(coachMock);
      expect(result[1]).toEqual(coachMock2);
    });
  });

  // describe('updateCoach', () => {
  //   const updatedCoach = { ...coachMock, bio: 'update bio' };
  //   beforeAll(() => {
  //     CoachsServiceMock.update.mockResolvedValue(updatedCoach);
  //   });
  //   it('should call update and return and coach updated', async () => {
  //     CoachsServiceMock.getCoachByUserEmail.mockResolvedValue(coachMock);
  //     const fromSpy = jest
  //       .spyOn(CoachDto, 'from')
  //       .mockImplementation()
  //       .mockResolvedValue(coachDtoMock);

  //     const result = await resolver.update(
  //       sessionMock,
  //       editCoachDtoMock as any,
  //     );

  //     expect(fromSpy).toHaveBeenCalled();
  //     expect(fromSpy).toHaveBeenCalledWith(editCoachDtoMock);
  //     expect(CoachsServiceMock.update).toHaveBeenCalled();
  //     expect(CoachsServiceMock.update).toHaveBeenCalledWith(
  //       coachMock.id,
  //       coachDtoMock,
  //     );
  //     expect(result).toBeInstanceOf(Object);
  //     expect(result).toEqual(updatedCoach);
  //   });
  // });

  describe('updateManyCoach', () => {
    const updatedCoaches = [
      { ...coachMock, bio: 'update bio' },
      { ...coachMock, bio: 'update bio' },
    ];
    const ids = [coachMock.id, coachMock2.id];
    beforeAll(() => {
      CoachsServiceMock.updateMany.mockResolvedValue(updatedCoaches);
    });
    it('should call updateMany and return and a array of updated coaches', async () => {
      const result = await resolver.updateMany(editCoachDtoMock, ids);
      expect(CoachsServiceMock.updateMany).toHaveBeenCalled();
      expect(CoachsServiceMock.updateMany).toHaveBeenCalledWith(
        editCoachDtoMock,
        ids,
      );
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(updatedCoaches[0]);
      expect(result[1]).toEqual(updatedCoaches[1]);
    });
  });

  describe('deleteCoach', () => {
    beforeAll(() => {
      CoachsServiceMock.delete.mockResolvedValue(coachMock.id);
    });
    it('should call delete and return the id of the coach deleted', async () => {
      const result = await resolver.delete(coachMock.id);
      expect(CoachsServiceMock.delete).toHaveBeenCalled();
      expect(CoachsServiceMock.delete).toHaveBeenCalledWith(coachMock.id);
      expect(result).toBe(coachMock.id);
    });
  });

  describe('deleteManyCoachs', () => {
    beforeAll(() => {
      CoachsServiceMock.delete.mockResolvedValue([coachMock.id, coachMock2.id]);
    });
    it('should call delete and return an array of ids of the coaches deleted', async () => {
      const result = await resolver.deleteMany([coachMock.id, coachMock2.id]);

      expect(CoachsServiceMock.delete).toHaveBeenCalled();
      expect(CoachsServiceMock.delete).toHaveBeenCalledWith([
        coachMock.id,
        coachMock2.id,
      ]);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
      expect(result[0]).toBe(coachMock.id);
      expect(result[1]).toBe(coachMock2.id);
    });
  });
});
