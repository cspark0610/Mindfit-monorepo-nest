import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from 'src/auth/resolvers/auth.resolver';
import { AuthService } from 'src/auth/services/auth.service';
import { Roles } from 'src/users/enums/roles.enum';
import { Coachee } from 'src/coaching/models/coachee.model';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  const CreateUserDtoMock = {
    email: 'email@mail.com',
    name: 'name',
    password: 'password',
    role: Roles.COACHEE_OWNER,
  };
  const UserMock = {
    id: 1,
    name: CreateUserDtoMock.name,
    email: CreateUserDtoMock.email,
    password: CreateUserDtoMock.password,
    languages: 'TEST_LANGUAGE',
    coach: {
      id: 1,
    } as Coachee,
    isActive: true,
    isVerified: true,
    isStaff: false,
    isSuperUser: true,
    isSuspended: false,
    verificationCode: 'TEST_VERIFICATION_CODE',
    hashedRefreshToken: 'TEST_HASHED_REFRESH_TOKEN',
    role: CreateUserDtoMock.role,
  };
  const CoacheeSignUpDtoMock = {
    coachingAreasId: [1, 2],
    phoneNumber: 'TEST_PHONE_NUMBER',
    position: 'TEST_POSITION',
    isAdmin: false,
    invited: true,
    invitationAccepted: false,
    canViewDashboard: true,
    bio: 'TEST_BIO',
    aboutPosition: 'TEST_ABOUT_POSITION',
  };
  const OrganizationDtoMock = {
    name: 'TEST_ORGANIZATION_NAME',
    about: 'TEST_ORGANIZATION_ABOUT',
  };
  const SignupCoacheeDtoMock = {
    signupData: CreateUserDtoMock,
    coacheeData: CoacheeSignUpDtoMock,
    organizationData: OrganizationDtoMock,
  };

  const SessionMock = {
    userId: UserMock.id,
    email: UserMock.email,
    role: UserMock.role,
    refreshToken: 'TEST_REFRESH_TOKEN',
  };

  const AuthMock = {
    token: 'token',
    refreshToken: 'refreshToken',
    strapiToken: 'strapiToken',
  };
  const SignInDtoMock = {
    email: 'email@mail.com',
    password: 'password',
  };
  const ResetPasswordDtoMock = {
    password: 'TEST_PASSWORD',
    confirmPassword: 'TEST_PASSWORD',
    hash: 'TEST_HASH',
  };
  const VerifyAccountDtoMock = {
    email: 'email@mail.com',
    code: 'TEST_VERIFICATION_CODE',
  };

  const AuthServiceMock = {
    signUp: jest.fn(),
    signUpCoachee: jest.fn(),
    signIn: jest.fn(),
    signInStaffOrSuperUser: jest.fn(),
    logout: jest.fn(),
    requestResetPassword: jest.fn(),
    resetPassword: jest.fn(),
    refreshToken: jest.fn(),
    verifyAccount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: AuthServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('signUp', () => {
    beforeAll(() => {
      AuthServiceMock.signUp.mockResolvedValue(AuthMock);
    });
    it('should call AuthService.signUp', async () => {
      const result = await resolver.signUp(CreateUserDtoMock);
      expect(AuthServiceMock.signUp).toHaveBeenCalledWith(CreateUserDtoMock);
      expect(result).toEqual(AuthMock);
    });
  });

  describe('signUpCoachee', () => {
    beforeAll(() => {
      AuthServiceMock.signUpCoachee.mockResolvedValue(AuthMock);
    });
    it('should call AuthService.signUpCoachee', async () => {
      const result = await resolver.signUpCoachee(SignupCoacheeDtoMock as any);
      expect(AuthServiceMock.signUpCoachee).toHaveBeenCalled();
      expect(result).toEqual(AuthMock);
    });
  });

  describe('signIn', () => {
    beforeAll(() => {
      AuthServiceMock.signIn.mockResolvedValue(AuthMock);
    });
    it('should call AuthService.signIn', async () => {
      const result = await resolver.signIn(SignInDtoMock);
      expect(AuthServiceMock.signIn).toHaveBeenCalledWith(SignInDtoMock);
      expect(result).toEqual(AuthMock);
    });
  });

  describe('signInStaffOrSuperUser', () => {
    beforeAll(() => {
      AuthServiceMock.signInStaffOrSuperUser.mockResolvedValue(AuthMock);
    });
    it('should call AuthService.signInStaffOrSuperUser', async () => {
      const result = await resolver.signInStaffOrSuperUser(SignInDtoMock);
      expect(AuthServiceMock.signInStaffOrSuperUser).toHaveBeenCalledWith(
        SignInDtoMock,
      );
      expect(result).toEqual(AuthMock);
    });
  });
  describe('refreshToken', () => {
    beforeAll(() => {
      AuthServiceMock.refreshToken.mockResolvedValue(AuthMock);
    });
    it('should call AuthService.refreshToken', async () => {
      const result = await resolver.refreshToken(SessionMock);
      expect(AuthServiceMock.refreshToken).toHaveBeenCalledWith(
        SessionMock.userId,
        SessionMock.refreshToken,
      );
      expect(result).toEqual(AuthMock);
    });
  });

  describe('verifyAccount', () => {
    beforeAll(() => {
      AuthServiceMock.verifyAccount.mockResolvedValue(true);
    });
    it('should call AuthService.verifyAccount', async () => {
      const result = await resolver.verifyAccount(VerifyAccountDtoMock);
      expect(AuthServiceMock.verifyAccount).toHaveBeenCalledWith(
        VerifyAccountDtoMock,
      );
      expect(result).toEqual(true);
    });
  });

  describe('requestResetPassword', () => {
    beforeAll(() => {
      AuthServiceMock.requestResetPassword.mockResolvedValue(true);
    });
    it('should call AuthService.requestResetPassword', async () => {
      const result = await resolver.requestResetPassword(SessionMock.email);
      expect(AuthServiceMock.requestResetPassword).toHaveBeenCalledWith(
        SessionMock.email,
      );
      expect(result).toEqual(true);
    });
  });

  describe('resetPassword', () => {
    const updatedUser = {
      ...UserMock,
      password: ResetPasswordDtoMock.password,
    };
    beforeAll(() => {
      AuthServiceMock.resetPassword.mockResolvedValue(updatedUser);
    });

    it('should call AuthService.resetPassword', async () => {
      const result = await resolver.resetPassword(ResetPasswordDtoMock);
      expect(AuthServiceMock.resetPassword).toHaveBeenCalledWith(
        ResetPasswordDtoMock,
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('logout', () => {
    beforeAll(() => {
      AuthServiceMock.logout.mockResolvedValue(true);
    });
    it('should call AuthService.logout', async () => {
      const result = await resolver.logout(SessionMock);
      expect(AuthServiceMock.logout).toHaveBeenCalledWith(SessionMock.userId);
      expect(result).toEqual(true);
    });
  });
});
