import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/models/users.model';
import { FavoritePostsResolver } from 'src/digitalLibrary/resolvers/favoritePosts.resolver';
import { FavoritePostsService } from 'src/digitalLibrary/services/favoritePosts.service';
import { Roles } from 'src/users/enums/roles.enum';
import { FavoritePostDto } from 'src/digitalLibrary/dto/favoritePost.dto';

describe('FavoritePostsResolver', () => {
  let resolver: FavoritePostsResolver;

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

  const FavoritePostMock = {
    id: 1,
    user: userMock,
    strapiPostId: 1,
  };
  const FavoritePostDtoMock = { strapiPostId: FavoritePostMock.strapiPostId };
  const FavoritePostsArrayMock = [{ ...FavoritePostMock }];

  const FavoritePostsServiceMock = {
    getUserFavoritePosts: jest.fn().mockResolvedValue(FavoritePostsArrayMock),
    create: jest.fn().mockResolvedValue(FavoritePostMock),
    createMany: jest.fn().mockResolvedValue(FavoritePostsArrayMock),
  };
  const relationsMock = {
    ref: 'favoritePost',
    relations: [['favoritePost.user', 'user']],
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritePostsResolver,
        {
          provide: FavoritePostsService,
          useValue: FavoritePostsServiceMock,
        },
      ],
    }).compile();
    resolver = module.get<FavoritePostsResolver>(FavoritePostsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAllFavoritePosts', () => {
    beforeAll(() => {
      FavoritePostsServiceMock.getUserFavoritePosts();
    });
    it('should call getUserFavoritePosts', async () => {
      const result = await resolver.findAll(sessionMock, relationsMock);
      expect(result).toEqual(FavoritePostsArrayMock);
    });
  });

  describe('createFavoritePost', () => {
    beforeAll(() => {
      FavoritePostsServiceMock.create();
    });

    it('should call create method', async () => {
      jest
        .spyOn(FavoritePostDto, 'from')
        .mockImplementation()
        .mockReturnValue(FavoritePostMock as any);

      const result = await resolver.create(sessionMock, FavoritePostDtoMock);
      expect(result).toEqual(FavoritePostMock);
    });
  });

  describe('createManyFavoritePost', () => {
    beforeAll(() => {
      FavoritePostsServiceMock.createMany();
    });

    it('should call createMany method', async () => {
      jest
        .spyOn(FavoritePostDto, 'from')
        .mockImplementation()
        .mockReturnValue(FavoritePostMock as any);

      const result = await resolver.createMany(sessionMock, [
        FavoritePostDtoMock,
      ]);
      expect(result).toEqual(FavoritePostsArrayMock);
    });
  });
});
