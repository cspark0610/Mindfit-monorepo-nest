import { Test, TestingModule } from '@nestjs/testing';
import { CoachAgendaDayResolver } from 'src/agenda/resolvers/coachAgendaDay.resolver';
import { CoachAgendaDayService } from 'src/agenda/services/coachAgendaDay.service';
import { UsersService } from 'src/users/services/users.service';
import { CoachAgendaDayValidator } from 'src/agenda/resolvers/validators/CoachAgendaDayValidator';
import { CoachAgenda } from 'src/agenda/models/coachAgenda.model';
import { Coach } from 'src/coaching/models/coach.model';
import { Roles } from 'src/users/enums/roles.enum';
import { HttpStatus } from '@nestjs/common';
import { CoachErrors } from 'src/coaching/enums/coachErrors.enum';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { AgendaErrorsEnum } from 'src/agenda/enums/agendaErrors.enum';
import { CreateCoachAgendaDayDto } from 'src/agenda/dto/coachAgendaDay.dto';
//import dayjs from 'dayjs';

describe('CoachAgendaDayResolver', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  let resolver: CoachAgendaDayResolver;

  const now = new Date();
  const createCoachAgendaDayDtoMock = {
    day: now,
    availableHours: [{ from: '12:00', to: '18:00' }],
    exclude: false,
  };

  const coachAgendaDayMock = {
    id: 1,
    coachAgenda: {
      id: 1,
    } as CoachAgenda,
    day: now,
    availableHours: createCoachAgendaDayDtoMock.availableHours,
    exclude: false,
  };
  const coachAgendaDayArrayMock = [{ ...coachAgendaDayMock }];

  const userMock = {
    id: 1,
    name: 'TEST_NAME',
    email: 'TEST_EMAIL',
    password: 'TEST_PASSWORD',
    languages: 'TEST_LANGUAGE',
    coach: {
      id: 1,
    } as Coach,
    isActive: true,
    isVerified: true,
    isStaff: false,
    isSuperUser: true,
    role: Roles.COACH,
  };

  const sessionMock = {
    userId: userMock.id,
    email: userMock.email,
    role: Roles.COACH,
  };

  const CoachAgendaDayServiceMock = {
    create: jest.fn(),
    update: jest.fn(),
    getDayConfig: jest.fn(),
  };
  const UsersServiceMock = {
    findOne: jest.fn(),
  };

  const CoachAgendaDayValidatorMock = {
    validateHoursIntervals: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoachAgendaDayResolver,
        {
          provide: CoachAgendaDayService,
          useValue: CoachAgendaDayServiceMock,
        },
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
        {
          provide: CoachAgendaDayValidator,
          useValue: CoachAgendaDayValidatorMock,
        },
      ],
    }).compile();
    resolver = module.get<CoachAgendaDayResolver>(CoachAgendaDayResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createCoachAgendaDay', () => {
    it('should return a new coachAgendaDay when all validatiosn are passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      CoachAgendaDayServiceMock.getDayConfig.mockResolvedValue([]);
      CoachAgendaDayValidatorMock.validateHoursIntervals.mockResolvedValue(
        true,
      );
      CoachAgendaDayServiceMock.create.mockResolvedValue(coachAgendaDayMock);

      const result = await resolver.create(
        sessionMock,
        createCoachAgendaDayDtoMock,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(coachAgendaDayMock);
    });

    it('should throw an error when first validation is not passed', async () => {
      const user = { ...userMock, coach: null };
      UsersServiceMock.findOne.mockResolvedValue(user);

      try {
        await resolver.create(sessionMock, createCoachAgendaDayDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual('You do not have a Coach profile');
        expect(error.response.errorCode).toEqual(CoachErrors.NO_COACH_PROFILE);
        expect(error.status).toEqual(HttpStatus.FORBIDDEN);
      }
    });

    it('should throw an error when second validation is not passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      CoachAgendaDayServiceMock.getDayConfig.mockResolvedValue(
        coachAgendaDayArrayMock,
      );

      try {
        await resolver.create(sessionMock, createCoachAgendaDayDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual(
          'This day has already been set. Use update instead.',
        );
        expect(error.response.errorCode).toEqual(
          AgendaErrorsEnum.DAY_ALREADY_CONFIGURED,
        );
        expect(error.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });

    // xit('should throw an error when third validation is not passed', async () => {
    //   const date = dayjs(now);
    //   UsersServiceMock.findOne.mockResolvedValue(userMock);
    //   CoachAgendaDayServiceMock.getDayConfig.mockResolvedValue([]);

    //   jest.spyOn(date, 'isBefore').mockReturnValue(false);

    //   try {
    //     await resolver.create(sessionMock, createCoachAgendaDayDtoMock);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // });
  });

  describe('updateCoachAgendaDay', () => {
    const editCoachAgendaDayDtoMock = { exclude: true };
    const editedCoachAgendaDayMock = {
      ...coachAgendaDayMock,
      exclude: editCoachAgendaDayDtoMock.exclude,
    };
    it('should return a updated coachAgendaDay when all validations are passed', async () => {
      UsersServiceMock.findOne.mockResolvedValue(userMock);
      CoachAgendaDayValidatorMock.validateHoursIntervals.mockResolvedValue(
        true,
      );

      CoachAgendaDayServiceMock.update.mockResolvedValue(
        editedCoachAgendaDayMock,
      );

      const res = await resolver.update(
        sessionMock,
        coachAgendaDayMock.id,
        editCoachAgendaDayDtoMock as CreateCoachAgendaDayDto,
      );

      expect(res).toBeDefined();
      expect(res).toEqual(editedCoachAgendaDayMock);
    });
    it('should throw an error when first validation is not passed', async () => {
      const user = { ...userMock, coach: null };
      UsersServiceMock.findOne.mockResolvedValue(user);

      try {
        await resolver.update(
          sessionMock,
          coachAgendaDayMock.id,
          editCoachAgendaDayDtoMock as CreateCoachAgendaDayDto,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toEqual('You do not have a Coach profile');
        expect(error.response.errorCode).toEqual(CoachErrors.NO_COACH_PROFILE);
        expect(error.status).toEqual(HttpStatus.FORBIDDEN);
      }
    });
  });
});
