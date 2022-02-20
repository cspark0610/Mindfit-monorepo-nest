import { Test, TestingModule } from '@nestjs/testing';
import { CoachingAreaRepository } from 'src/coaching/repositories/coachingArea.repository';
import { CoachingAreaService } from 'src/coaching/services/coachingArea.service';

describe('CoachingAreaService', () => {
  let service: CoachingAreaService;

  // const coachingAreaMock = {
  //   id: 1,
  //   coach: {
  //     id: 1,
  //   },
  //   coachee: {
  //     id: 1,
  //   },
  //   appointmentRelated: {
  //     id: 1,
  //   },
  //   name: 'TEST_NAME',
  //   coverPicture: 'TEST_COVER_PICTURE',
  //   description: 'TEST_DESCRIPTION',
  // };

  // const data = {
  //   name: coachingAreaMock.name,
  //   coverPicture: coachingAreaMock.coverPicture,
  //   description: coachingAreaMock.description,
  // };

  const CoachingAreaRepositoryMock = {
    getQueryBuilder: jest.fn(),
    findAll: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachingAreaService,
        {
          provide: CoachingAreaRepository,
          useValue: CoachingAreaRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CoachingAreaService>(CoachingAreaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
