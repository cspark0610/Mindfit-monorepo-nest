import { Test, TestingModule } from '@nestjs/testing';
import { PostsProgressResolver } from 'src/digitalLibrary/resolvers/postsProgress.resolver';
import { Roles } from 'src/users/enums/roles.enum';
import { User } from 'src/users/models/users.model';
import { PostsProgressService } from 'src/digitalLibrary/services/postsProgress.service';
import { PostProgressDto } from 'src/digitalLibrary/dto/postProgress.dto';

describe('PostsProgressResolver', () => {
  let resolver: PostsProgressResolver;

  const userMock = {
    id: 1,
    name: 'TEST_NAME',
    email: 'TEST_EMAIL',
    languages: 'TEST_LANGUAGE',
    password: 'TEST_PASSWORD',
    isActive: true,
    isVerified: true,
    isStaff: false,
    isSuperUser: false,
    role: Roles.COACH,
  } as unknown as User;

  const sessionMock = {
    userId: userMock.id,
    email: userMock.email,
    role: userMock.role,
  };

  const PostProgressMock = {
    id: 1,
    user: userMock,
    strapiPostId: 1,
    progress: 5,
  };
  const PostProgressDtoMock = {
    strapiPostId: PostProgressMock.strapiPostId,
    progress: PostProgressMock.progress,
  };
  const PostProgressArrayMock = [{ ...PostProgressMock }];

  const PostsProgressServiceMock = {
    getUserPostsProgress: jest.fn().mockResolvedValue(PostProgressArrayMock),
    create: jest.fn().mockResolvedValue(PostProgressMock),
    createMany: jest.fn().mockResolvedValue(PostProgressArrayMock),
  };
  const relationsPostProgressMock = {
    ref: 'postProgress',
    relations: [['postProgress.user', 'user']],
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsProgressResolver,
        {
          provide: PostsProgressService,
          useValue: PostsProgressServiceMock,
        },
      ],
    }).compile();
    resolver = module.get<PostsProgressResolver>(PostsProgressResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAllPostProgresss', () => {
    beforeAll(() => {
      PostsProgressServiceMock.getUserPostsProgress();
    });
    it('should call getUserPostsProgress', async () => {
      const result = await resolver.findAll(
        sessionMock,
        relationsPostProgressMock,
      );
      expect(result).toEqual(PostProgressArrayMock);
    });
  });

  describe('createPostProgress', () => {
    beforeAll(() => {
      PostsProgressServiceMock.create();
    });

    it('should call create method', async () => {
      jest
        .spyOn(PostProgressDto, 'from')
        .mockImplementation()
        .mockReturnValue(PostProgressMock as any);

      const result = await resolver.create(sessionMock, PostProgressDtoMock);
      expect(result).toEqual(PostProgressMock);
    });
  });

  describe('createManyPostProgress', () => {
    beforeAll(() => {
      PostsProgressServiceMock.createMany();
    });

    it('should call createMany method', async () => {
      jest
        .spyOn(PostProgressDto, 'from')
        .mockImplementation()
        .mockReturnValue(PostProgressMock as any);

      const result = await resolver.createMany(sessionMock, [
        PostProgressDtoMock,
      ]);
      expect(result).toEqual(PostProgressArrayMock);
    });
  });
});
