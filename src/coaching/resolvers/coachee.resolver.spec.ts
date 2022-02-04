import { Test, TestingModule } from '@nestjs/testing';
import { AwsSesService } from 'src/aws/services/ses.service';
import { CoacheesResolver } from 'src/coaching/resolvers/coachee.resolver';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { UsersService } from 'src/users/services/users.service';

describe('CoacheesResolver', () => {
  let resolver: CoacheesResolver;
  // TODO Auth

  // const coacheeMock = {
  //   id: 1,
  //   user: {
  //     id: 1,
  //   },
  //   organizations: [
  //     {
  //       id: 1,
  //     },
  //   ],
  //   coachingAreas: [],
  //   coachAppointments: [],
  //   coachNotes: [],
  //   coachingSessions: [],
  //   coacheeEvaluations: [],
  //   phoneNumber: 'TEST_PHONE_NUMBER',
  //   profilePicture: 'TEST_PROFILE_PICTURE',
  //   position: 'TEST_POSITION',
  //   isAdmin: false,
  //   isActive: true,
  //   canViewDashboard: false,
  //   bio: 'TEST_BIO',
  //   aboutPosition: 'TEST_ABOUT_POSITION',
  // };

  // const data = {
  //   userId: coacheeMock.user.id,
  //   organizationsId: coacheeMock.organizations.map(({ id }) => id),
  //   coachingAreasId: coacheeMock.coachingAreas.map(({ id }) => id),
  //   phoneNumber: coacheeMock.phoneNumber,
  //   profilePicture: coacheeMock.profilePicture,
  //   position: coacheeMock.position,
  //   isAdmin: coacheeMock.isAdmin,
  //   canViewDashboard: coacheeMock.canViewDashboard,
  //   bio: coacheeMock.bio,
  //   aboutPosition: coacheeMock.aboutPosition,
  // };

  const CoacheesServiceMock = {
    getCoachee: jest.fn(),
    getCoachees: jest.fn(),
    createCoachee: jest.fn(),
    editCoachees: jest.fn(),
    deleteCoachees: jest.fn(),
  };

  const UsersServiceMock = {};

  const AwsSesServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoacheesResolver,
        {
          provide: CoacheeService,
          useValue: CoacheesServiceMock,
        },
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
        {
          provide: AwsSesService,
          useValue: AwsSesServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<CoacheesResolver>(CoacheesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
