import { Test, TestingModule } from '@nestjs/testing';
import { SatBasicsResolver } from 'src/evaluationTests/resolvers/satBasic.resolver';
import { SatBasicService } from 'src/evaluationTests/services/satBasic.service';
import { UsersService } from 'src/users/services/users.service';
import { SatBasic } from 'src/evaluationTests/models/satBasic.model';
import { SatBasicDto } from '../dto/satBasic.dto';
import { NestedSatBasicAnswerDto } from 'src/evaluationTests/dto/satBasicAnswer.dto';
import { NestedSatBasicQuestionDto } from 'src/evaluationTests/dto/satBasicQuestion.dto';
import { NestedSatBasicSectionDto } from 'src/evaluationTests/dto/satBasicSection.dto';
import { AnswerDimensions } from 'src/evaluationTests/enums/answerDimentions.enum';
import { QuestionDimentions } from 'src/evaluationTests/enums/questionDimentions.enum';
import { SectionCodenames } from 'src/evaluationTests/enums/sectionCodenames.enum';
import { Roles } from 'src/users/enums/roles.enum';

describe('SatBasicsResolver', () => {
  let resolver: SatBasicsResolver;

  const now = new Date();
  const SatBasicMock = {
    id: 1,
    sections: null,
    testsReports: null,
    title: 'title',
    translations: null,
    description: 'description',
    createdAt: now,
    updatedAt: now,
  } as SatBasic;

  const SatBasicDtoMock = {
    title: 'title',
    description: 'description',
    satBasicSections: [
      {
        title: 'title',
        translations: null,
        questions: [
          {
            title: 'title',
            translations: null,
            satBasicAnswers: [
              {
                title: 'title',
                translations: null,
                answerDimension: AnswerDimensions.IMPROVE_COMMUNICATION_SKILLS,
                value: 1,
                order: 1,
              } as NestedSatBasicAnswerDto,
            ],
            order: 1,
            dimension: QuestionDimentions.GENERAL,
          } as NestedSatBasicQuestionDto,
        ],
        order: 1,
        codename: SectionCodenames.GENERAL,
      } as NestedSatBasicSectionDto,
    ],
  } as SatBasicDto;
  const sessionMock = {
    userId: 1,
    email: 'email@gmail.com',
    role: Roles.STAFF,
  };

  const SatBasicServiceMock = {
    createFullTest: jest.fn().mockResolvedValue(SatBasicMock),
  };
  const UsersServiceMock = {};

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SatBasicsResolver,
        {
          provide: SatBasicService,
          useValue: SatBasicServiceMock,
        },
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
      ],
    }).compile();
    resolver = module.get<SatBasicsResolver>(SatBasicsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createFullTest', () => {
    it('should call createFullTest method', async () => {
      const result = await resolver.create(sessionMock, SatBasicDtoMock);
      expect(SatBasicServiceMock.createFullTest).toHaveBeenCalledWith(
        SatBasicDtoMock,
      );
      expect(result).toEqual(SatBasicMock);
    });
  });
});
