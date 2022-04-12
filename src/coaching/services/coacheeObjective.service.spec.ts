import { Test, TestingModule } from '@nestjs/testing';
import { CoacheeObjectiveService } from 'src/coaching/services/coacheeObjective.service';
import { CoacheeObjectiveRepository } from 'src/coaching/repositories/coacheeObjective.repository';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoacheeObjective } from 'src/coaching/models/coacheeObjective.model';
import { HttpStatus } from '@nestjs/common';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { CoacheeErrors } from '../enums/coacheeErrors.enum';

describe('CoacheeObjectiveService', () => {
  let service: CoacheeObjectiveService;

  const coacheeObjectiveMock = {
    id: 1,
    coachee: { id: 1 } as Coachee,
    tasks: [],
    title: 'title',
    icon: 'objective-icon',
  } as CoacheeObjective;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...coacheeObjectiveDtoMock } = coacheeObjectiveMock;
  const sessionMock = { userId: 1 };

  const CoacheeObjectiveRepositoryMock = {};
  const CoacheeServiceMock = {
    validateActiveCoacheeProfile: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoacheeObjectiveService,
        {
          provide: CoacheeObjectiveRepository,
          useValue: CoacheeObjectiveRepositoryMock,
        },
        {
          provide: CoacheeService,
          useValue: CoacheeServiceMock,
        },
      ],
    }).compile();
    service = module.get<CoacheeObjectiveService>(CoacheeObjectiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createByCoachee', () => {
    it('should create a new coachee objective', async () => {
      CoacheeServiceMock.validateActiveCoacheeProfile.mockImplementation();

      jest
        .spyOn(service, 'create')
        .mockImplementation()
        .mockResolvedValue(coacheeObjectiveMock);

      await expect(
        Promise.resolve(
          service.createByCoachee(sessionMock.userId, coacheeObjectiveDtoMock),
        ),
      ).resolves.toEqual(coacheeObjectiveMock);
    });

    it('should throw exception when validation is not passed', async () => {
      CoacheeServiceMock.validateActiveCoacheeProfile.mockImplementation(() => {
        throw new MindfitException({
          error: `Coachee Profile Suspended or not active`,
          errorCode: CoacheeErrors.COACHEE_PROFILE_SUSPENDED,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      });

      try {
        await service.createByCoachee(
          sessionMock.userId,
          coacheeObjectiveDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe(
          `Coachee Profile Suspended or not active`,
        );
        expect(error.response.errorCode).toBe(
          CoacheeErrors.COACHEE_PROFILE_SUSPENDED,
        );
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('updateByCoachee', () => {
    const editCoacheeObjectiveDtoMock = { title: 'new title' };
    const editedCoacheeObjectiveMock = {
      ...coacheeObjectiveMock,
      title: editCoacheeObjectiveDtoMock.title,
    };
    it('should update a coachee objective', async () => {
      CoacheeServiceMock.validateActiveCoacheeProfile.mockImplementation();
      jest
        .spyOn(service, 'validateCoacheeObjectiveOwnership')
        .mockImplementation();

      jest
        .spyOn(service, 'update')
        .mockImplementation()
        .mockResolvedValue(editedCoacheeObjectiveMock);

      await expect(
        Promise.resolve(
          service.updateByCoachee(
            sessionMock.userId,
            coacheeObjectiveMock.id,
            editCoacheeObjectiveDtoMock as any,
          ),
        ),
      ).resolves.toEqual(editedCoacheeObjectiveMock);
    });

    it('should throw exception when second validation is not passed', async () => {
      CoacheeServiceMock.validateActiveCoacheeProfile.mockImplementation();
      jest
        .spyOn(service, 'validateCoacheeObjectiveOwnership')
        .mockImplementation(() => {
          throw new MindfitException({
            error: `The Objective does not belong to you`,
            errorCode: CoacheeErrors.NOT_OBJECTIVE_OWNER,
            statusCode: HttpStatus.BAD_REQUEST,
          });
        });

      try {
        await service.updateByCoachee(
          sessionMock.userId,
          coacheeObjectiveMock.id,
          editCoacheeObjectiveDtoMock as any,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe(
          `The Objective does not belong to you`,
        );
        expect(error.response.errorCode).toBe(
          CoacheeErrors.NOT_OBJECTIVE_OWNER,
        );
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('deleteByCoachee', () => {
    const affected = 1;
    it('should delete a coachee objective and return the number of rows affected', async () => {
      CoacheeServiceMock.validateActiveCoacheeProfile.mockImplementation();
      jest
        .spyOn(service, 'validateCoacheeObjectiveOwnership')
        .mockImplementation();

      jest
        .spyOn(service, 'deleteByCoachee')
        .mockImplementation()
        .mockResolvedValue(affected);

      await expect(
        Promise.resolve(
          service.deleteByCoachee(sessionMock.userId, coacheeObjectiveMock.id),
        ),
      ).resolves.toEqual(affected);
    });

    it('should throw exception when second validation is not passed', async () => {
      CoacheeServiceMock.validateActiveCoacheeProfile.mockImplementation();
      jest
        .spyOn(service, 'validateCoacheeObjectiveOwnership')
        .mockImplementation(() => {
          throw new MindfitException({
            error: `The Objective does not belong to you`,
            errorCode: CoacheeErrors.NOT_OBJECTIVE_OWNER,
            statusCode: HttpStatus.BAD_REQUEST,
          });
        });

      try {
        await service.deleteByCoachee(
          sessionMock.userId,
          coacheeObjectiveMock.id,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe(
          `The Objective does not belong to you`,
        );
        expect(error.response.errorCode).toBe(
          CoacheeErrors.NOT_OBJECTIVE_OWNER,
        );
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });
});
