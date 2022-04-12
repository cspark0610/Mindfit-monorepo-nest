import { Test, TestingModule } from '@nestjs/testing';
import { CoacheeObjectiveResolver } from 'src/coaching/resolvers/coacheeObjective.resolver';
import { CoacheeObjective } from 'src/coaching/models/coacheeObjective.model';
import { Coachee } from 'src/coaching/models/coachee.model';
import { CoacheeObjectiveService } from 'src/coaching/services/coacheeObjective.service';

describe('CoacheeObjectiveResolver', () => {
  let resolver: CoacheeObjectiveResolver;

  const coacheeObjectiveMock = {
    id: 1,
    coachee: { id: 1 } as Coachee,
    tasks: [],
    title: 'title',
    icon: 'objective-icon',
  } as CoacheeObjective;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...coacheeObjectiveDtoMock } = coacheeObjectiveMock;
  const sessionMock = { userId: 1 } as any;

  const CoacheeObjectiveServiceMock = {
    createByCoachee: jest.fn(),
    updateByCoachee: jest.fn(),
    deleteByCoachee: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoacheeObjectiveResolver,
        {
          provide: CoacheeObjectiveService,
          useValue: CoacheeObjectiveServiceMock,
        },
      ],
    }).compile();
    resolver = module.get<CoacheeObjectiveResolver>(CoacheeObjectiveResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createCoacheeObjective', () => {
    beforeAll(() => {
      CoacheeObjectiveServiceMock.createByCoachee.mockResolvedValue(
        coacheeObjectiveMock,
      );
    });
    it('should call createByCoachee method', async () => {
      const result = await resolver.create(
        sessionMock,
        coacheeObjectiveDtoMock,
      );
      expect(CoacheeObjectiveServiceMock.createByCoachee).toHaveBeenCalled();
      expect(result).toEqual(coacheeObjectiveMock);
    });
  });

  describe('updateCoacheeObjective', () => {
    const editCoacheeObjectiveDtoMock = { title: 'new title' } as any;
    const editedCoacheeObjectiveMock = {
      ...coacheeObjectiveMock,
      title: editCoacheeObjectiveDtoMock.title,
    };
    beforeAll(() => {
      CoacheeObjectiveServiceMock.updateByCoachee.mockResolvedValue(
        editedCoacheeObjectiveMock,
      );
    });
    it('should call updateByCoachee method', async () => {
      const result = await resolver.update(
        sessionMock,
        coacheeObjectiveMock.id,
        editCoacheeObjectiveDtoMock,
      );
      expect(CoacheeObjectiveServiceMock.updateByCoachee).toHaveBeenCalled();
      expect(result).toEqual(editedCoacheeObjectiveMock);
    });
  });

  describe('deleteCoacheeObjective', () => {
    const affected = 1;
    beforeAll(() => {
      CoacheeObjectiveServiceMock.deleteByCoachee.mockResolvedValue(affected);
    });
    it('should call deleteByCoachee method', async () => {
      const result = await resolver.delete(
        sessionMock,
        coacheeObjectiveMock.id,
      );
      expect(CoacheeObjectiveServiceMock.deleteByCoachee).toHaveBeenCalled();
      expect(result).toEqual(affected);
    });
  });
});
