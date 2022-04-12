import { Test, TestingModule } from '@nestjs/testing';
import { ObjectiveTaskService } from 'src/coaching/services/objectiveTask.service';
import { ObjectiveTaskRepository } from 'src/coaching/repositories/objectiveTask.repository';
import { CoacheeObjectiveService } from 'src/coaching/services/coacheeObjective.service';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoacheeObjective } from 'src/coaching/models/coacheeObjective.model';
import { ObjectiveTask } from 'src/coaching/models/objetiveTask.model';
import { HttpStatus } from '@nestjs/common';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { CoacheeErrors } from '../enums/coacheeErrors.enum';
import { ObjectiveTaskErrors } from 'src/coaching/enums/objectiveTaskErrors.enum';

describe('ObjectiveTaskService', () => {
  let service: ObjectiveTaskService;

  const coacheeObjectiveMock = {
    id: 1,
    coachee: { id: 1 } as Coachee,
    tasks: [],
    title: 'title',
    icon: 'objective-icon',
  } as CoacheeObjective;

  const objectiveTaskMock = {
    id: 1,
    objective: coacheeObjectiveMock,
    title: 'title',
    repetitions: 10,
    executions: 0,
  } as ObjectiveTask;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...objectiveTaskDtoMock } = objectiveTaskMock;

  const sessionMock = { userId: 1 };

  const ObjectiveTaskRepositoryMock = {};
  const CoacheeObjectiveServiceMock = {
    findOne: jest.fn(),
  };
  const CoacheeServiceMock = {
    validateActiveCoacheeProfile: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObjectiveTaskService,
        {
          provide: ObjectiveTaskRepository,
          useValue: ObjectiveTaskRepositoryMock,
        },
        {
          provide: CoacheeObjectiveService,
          useValue: CoacheeObjectiveServiceMock,
        },
        {
          provide: CoacheeService,
          useValue: CoacheeServiceMock,
        },
      ],
    }).compile();
    service = module.get<ObjectiveTaskService>(ObjectiveTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createByCoachee', () => {
    it('should create a new objectiveTask', async () => {
      CoacheeServiceMock.validateActiveCoacheeProfile.mockImplementation();

      CoacheeObjectiveServiceMock.findOne.mockResolvedValue(
        coacheeObjectiveMock,
      );

      jest
        .spyOn(service, 'create')
        .mockImplementation()
        .mockResolvedValue(objectiveTaskMock);

      await expect(
        Promise.resolve(
          service.createByCoachee(
            sessionMock.userId,
            objectiveTaskDtoMock as any,
          ),
        ),
      ).resolves.toEqual(objectiveTaskMock);
    });

    it('it should throw exception when validation is not passed', async () => {
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
          objectiveTaskDtoMock as any,
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
    const updateObjectiveTaskDtoMock = {
      title: 'updated title',
    };
    const updatedObjectiveTaskMock = {
      ...objectiveTaskMock,
      title: updateObjectiveTaskDtoMock.title,
    };
    it('should update a objectiveTask', async () => {
      CoacheeServiceMock.validateActiveCoacheeProfile.mockImplementation();
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValueOnce(objectiveTaskMock);

      jest.spyOn(service, 'validateTaskOwnership').mockImplementation();

      jest
        .spyOn(service, 'update')
        .mockImplementation()
        .mockResolvedValueOnce(updatedObjectiveTaskMock);

      await expect(
        Promise.resolve(
          service.updateByCoachee(
            sessionMock.userId,
            objectiveTaskMock.id,
            updateObjectiveTaskDtoMock,
          ),
        ),
      ).resolves.toEqual(updatedObjectiveTaskMock);
    });

    it('it should throw exception when second validation is not passed', async () => {
      CoacheeServiceMock.validateActiveCoacheeProfile.mockImplementation();
      jest
        .spyOn(service, 'findOne')
        .mockImplementation()
        .mockResolvedValueOnce(objectiveTaskMock);

      jest.spyOn(service, 'validateTaskOwnership').mockImplementation(() => {
        throw new MindfitException({
          error: `The task does not belong to you`,
          errorCode: ObjectiveTaskErrors.NO_TASK_OWNER,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      });

      try {
        await service.updateByCoachee(
          sessionMock.userId,
          objectiveTaskMock.id,
          updateObjectiveTaskDtoMock,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe(`The task does not belong to you`);
        expect(error.response.errorCode).toBe(
          ObjectiveTaskErrors.NO_TASK_OWNER,
        );
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('deleteByCoachee', () => {
    const affected = 1;
    it('should delete a objectiveTask', async () => {
      CoacheeServiceMock.validateActiveCoacheeProfile.mockImplementation();
      jest.spyOn(service, 'validateTaskOwnership').mockImplementation();

      jest
        .spyOn(service, 'delete')
        .mockImplementation()
        .mockResolvedValueOnce(affected);

      await expect(
        Promise.resolve(
          service.deleteByCoachee(sessionMock.userId, objectiveTaskMock.id),
        ),
      ).resolves.toEqual(affected);
    });
    it('it should throw exception when second validation is not passed', async () => {
      CoacheeServiceMock.validateActiveCoacheeProfile.mockImplementation();

      jest.spyOn(service, 'validateTaskOwnership').mockImplementation(() => {
        throw new MindfitException({
          error: `The task does not belong to you`,
          errorCode: ObjectiveTaskErrors.NO_TASK_OWNER,
          statusCode: HttpStatus.BAD_REQUEST,
        });
      });

      try {
        await service.deleteByCoachee(sessionMock.userId, objectiveTaskMock.id);
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe(`The task does not belong to you`);
        expect(error.response.errorCode).toBe(
          ObjectiveTaskErrors.NO_TASK_OWNER,
        );
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });
});
