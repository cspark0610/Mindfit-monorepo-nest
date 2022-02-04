import { Test, TestingModule } from '@nestjs/testing';
import { CoachResolver } from 'src/coaching/resolvers/coach.resolver';
import { CoachService } from 'src/coaching/services/coach.service';

describe('CoachResolver', () => {
  let resolver: CoachResolver;

  // const coachMock = {
  //   id: 1,
  //   user: {
  //     id: 1,
  //   },
  //   coachApplication: {
  //     id: 1,
  //   },
  //   coachingAreas: [],
  //   bio: 'TEST_BIO',
  //   profilePicture: 'TEST_PROFILE_PICTURE',
  //   videoPresentation: 'TEST_VIDEO_PRESENTATION',
  //   phoneNumber: 'TEST_PHONE_NUMBER',
  //   isActive: true,
  // };

  const CoachsServiceMock = {
    getCoach: jest.fn(),
    getCoachs: jest.fn(),
    createCoach: jest.fn(),
    editCoachs: jest.fn(),
    deleteCoachs: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachResolver,
        {
          provide: CoachService,
          useValue: CoachsServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<CoachResolver>(CoachResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
