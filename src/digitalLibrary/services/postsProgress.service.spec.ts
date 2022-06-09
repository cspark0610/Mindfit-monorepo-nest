import { Test, TestingModule } from '@nestjs/testing';
import { Roles } from 'src/users/enums/roles.enum';
import { User } from 'src/users/models/users.model';
import { PostProgressRepository } from 'src/digitalLibrary/repositories/postProgress.repository';
import { PostsProgressService } from 'src/digitalLibrary/services/postsProgress.service';
import { PostProgress } from 'src/digitalLibrary/models/postProgress.model';

describe('PostsProgressService', () => {
  let service: PostsProgressService;

  const userMock = {
    id: 1,
    name: 'TEST_NAME',
    email: 'TEST_EMAIL',
    languages: 'TEST_LANGUAGE',
    password: 'TEST_PASSWORD',
    isActive: true,
    isVerified: true,
    isStaff: false,
    isSuperUser: true,
    role: Roles.SUPER_USER,
  } as unknown as User;

  const PostProgressMock = {
    id: 1,
    user: userMock,
    strapiPostId: 1,
    progress: 2,
  } as PostProgress;

  const PostProgressRepositoryMock = {
    getUserPostsProgress: jest.fn().mockResolvedValue([PostProgressMock]),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsProgressService,
        {
          provide: PostProgressRepository,
          useValue: PostProgressRepositoryMock,
        },
      ],
    }).compile();
    service = module.get<PostsProgressService>(PostsProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserPostsProgress', () => {
    it('should return an array of posts progress', async () => {
      PostProgressRepositoryMock.getUserPostsProgress();
      expect(
        PostProgressRepositoryMock.getUserPostsProgress,
      ).toHaveBeenCalled();

      await expect(
        Promise.resolve(service.getUserPostsProgress({ userId: userMock.id })),
      ).resolves.toEqual([PostProgressMock]);
    });
  });
});
