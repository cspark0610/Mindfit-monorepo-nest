import { Test, TestingModule } from '@nestjs/testing';
import { FavoritePostsService } from 'src/digitalLibrary/services/favoritePosts.service';
import { FavoritePostRepository } from 'src/digitalLibrary/repositories/favoritePost.repository';
import { Roles } from 'src/users/enums/roles.enum';
import { User } from 'src/users/models/users.model';

describe('FavoritePostsService', () => {
  let service: FavoritePostsService;

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

  const FavoritePostMock = {
    id: 1,
    user: userMock,
    strapiPostId: 1,
  };
  const FavoritePostRepositoryMock = {
    getUserFavoritePosts: jest.fn().mockResolvedValue([FavoritePostMock]),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritePostsService,
        {
          provide: FavoritePostRepository,
          useValue: FavoritePostRepositoryMock,
        },
      ],
    }).compile();
    service = module.get<FavoritePostsService>(FavoritePostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserFavoritePosts', () => {
    it('should return an array of favorite posts', async () => {
      FavoritePostRepositoryMock.getUserFavoritePosts();
      expect(
        FavoritePostRepositoryMock.getUserFavoritePosts,
      ).toHaveBeenCalled();

      await expect(
        Promise.resolve(service.getUserFavoritePosts({ userId: userMock.id })),
      ).resolves.toEqual([FavoritePostMock]);
    });
  });
});
