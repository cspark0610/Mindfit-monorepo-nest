import { Test, TestingModule } from '@nestjs/testing';
import { ObjectiveTaskResolver } from 'src/coaching/resolvers/objectiveTask.resolver';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoacheeObjective } from 'src/coaching/models/coacheeObjective.model';
import { ObjectiveTask } from 'src/coaching/models/objetiveTask.model';
import { ObjectiveTaskService } from 'src/coaching/services/objectiveTask.service';

describe('ObjectiveTaskResolver', () => {
  let resolver: ObjectiveTaskResolver;

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

  const sessionMock = { userId: 1 } as any;

  const ObjectiveTaskServiceMock = {
    createByCoachee: jest.fn(),
    updateByCoachee: jest.fn(),
    deleteByCoachee: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObjectiveTaskResolver,
        {
          provide: ObjectiveTaskService,
          useValue: ObjectiveTaskServiceMock,
        },
      ],
    }).compile();
    resolver = module.get<ObjectiveTaskResolver>(ObjectiveTaskResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createObjectiveTask', () => {
    beforeAll(() => {
      ObjectiveTaskServiceMock.createByCoachee.mockResolvedValue(
        objectiveTaskMock,
      );
    });
    it('should call createByCoachee method', async () => {
      const result = await resolver.create(
        sessionMock,
        objectiveTaskDtoMock as any,
      );
      expect(ObjectiveTaskServiceMock.createByCoachee).toHaveBeenCalled();
      expect(result).toEqual(objectiveTaskMock);
    });
  });

  describe('updateObjectiveTask', () => {
    const editObjectiveTaskDtoMock = { title: 'new title' } as any;
    const editedObjectiveTaskMock = {
      ...objectiveTaskMock,
      title: editObjectiveTaskDtoMock.title,
    };
    beforeAll(() => {
      ObjectiveTaskServiceMock.updateByCoachee.mockResolvedValue(
        editedObjectiveTaskMock,
      );
    });
    it('should call updateByCoachee method', async () => {
      const result = await resolver.update(
        sessionMock,
        objectiveTaskMock.id,
        editObjectiveTaskDtoMock,
      );
      expect(ObjectiveTaskServiceMock.updateByCoachee).toHaveBeenCalled();
      expect(result).toEqual(editedObjectiveTaskMock);
    });
  });

  describe('deleteCoacheeObjective', () => {
    const affected = 1;
    beforeAll(() => {
      ObjectiveTaskServiceMock.deleteByCoachee.mockResolvedValue(affected);
    });
    it('should call deleteByCoachee method', async () => {
      const result = await resolver.delete(sessionMock, objectiveTaskMock.id);
      expect(ObjectiveTaskServiceMock.deleteByCoachee).toHaveBeenCalled();
      expect(result).toEqual(affected);
    });
  });
});
