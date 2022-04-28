jest.mock('bcryptjs', () => ({
  compareSync: jest.fn(),
  genSaltSync: jest.fn(),
  hashSync: jest.fn(),
}));
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/services/auth.service';
import { UsersService } from 'src/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { AwsSesService } from 'src/aws/services/ses.service';
import config from 'src/config/config';
import { OrganizationsService } from 'src/organizations/services/organizations.service';
import { CoacheeService } from 'src/coaching/services/coachee.service';
import { Roles } from 'src/users/enums/roles.enum';
import { Coachee } from 'src/coaching/models/coachee.model';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { HttpStatus } from '@nestjs/common';
import { User } from 'src/users/models/users.model';
import { compareSync, hashSync } from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;

  const CreateUserDtoMock = {
    email: 'email@mail.com',
    name: 'name',
    password: 'password',
    role: Roles.COACHEE_OWNER,
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
  const SessionMock = {
    userId: UserMock.id,
    email: UserMock.email,
    role: UserMock.role,
  };
  const OrganinzationMock = {
    id: 1,
    ...OrganizationDtoMock,
  };
  const CoacheeMock = {
    id: 1,
    user: { id: 1 },
    organization: { id: 1 },
    ...CoacheeSignUpDtoMock,
  };
  const AuthMock = {
    token: 'token',
    refreshToken: 'refreshToken',
    strapiToken: 'strapiToken',
  };
  const AuthDtoMock = { ...AuthMock };
  const SignInDtoMock = {
    email: 'email@mail.com',
    password: 'password',
  };
  const ResetPasswordDtoMock = {
    password: 'TEST_PASSWORD',
    confirmPassword: 'TEST_PASSWORD',
    hash: 'TEST_HASH',
  };
  const updatedUser = {
    ...UserMock,
    password: ResetPasswordDtoMock.password,
  };

  const UsersServiceMock = {
    create: jest.fn().mockResolvedValue(UserMock),
    findOneBy: jest.fn().mockResolvedValue(UserMock),
    findOne: jest.fn().mockResolvedValue(UserMock),
    update: jest
      .fn()
      .mockResolvedValue({ ...UserMock, lastLoggedIn: new Date() }),
  };
  const JwtServiceMock = {
    sign: jest.fn().mockResolvedValue(AuthMock.token),
  };
  const AwsSesServiceMock = {
    sendEmail: jest.fn().mockResolvedValue(true),
  };
  const ConfigServiceMock = {
    jwt: {
      secret: 'secret',
      refreshSecret: 'refreshSecret',
    },
    strapi: {
      token: 'strapiToken',
    },
  };
  const OrganizationsServiceMock = {
    createOrganization: jest.fn().mockResolvedValue(OrganinzationMock),
  };
  const CoacheeServiceMock = {
    createCoachee: jest.fn().mockResolvedValue(CoacheeMock),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: UsersServiceMock,
        },
        {
          provide: JwtService,
          useValue: JwtServiceMock,
        },
        {
          provide: AwsSesService,
          useValue: AwsSesServiceMock,
        },
        {
          provide: config.KEY,
          useValue: ConfigServiceMock,
        },
        {
          provide: OrganizationsService,
          useValue: OrganizationsServiceMock,
        },
        {
          provide: CoacheeService,
          useValue: CoacheeServiceMock,
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should return create an user and call generateAuthTokenAndSendEmail method', async () => {
      UsersServiceMock.create();
      jest
        .spyOn(service, 'generateAuthTokenAndSendEmail')
        .mockResolvedValue(AuthMock);

      const result = await service.signUp(CreateUserDtoMock);
      expect(result).toEqual(AuthMock);
      // await expect(
      //   Promise.resolve(service.signUp(CreateUserDtoMock)),
      // ).resolves.toEqual(AuthMock);
      expect(service.generateAuthTokenAndSendEmail).toHaveBeenCalledWith(
        UserMock,
      );
    });
  });

  describe('signUpCoachee', () => {
    it('should return create an user, organization and coachee and call generateAuthTokenAndSendEmail method when all validations are passed', async () => {
      UsersServiceMock.create();
      OrganizationsServiceMock.createOrganization();
      CoacheeServiceMock.createCoachee();
      jest
        .spyOn(service, 'generateAuthTokenAndSendEmail')
        .mockResolvedValue(AuthMock);
      const result = await service.signUpCoachee(SignupCoacheeDtoMock as any);
      expect(result).toEqual(AuthMock);
      expect(OrganizationsServiceMock.createOrganization).toHaveBeenCalled();
      expect(UsersServiceMock.create).toHaveBeenCalled();
      expect(CoacheeServiceMock.createCoachee).toHaveBeenCalled();
      expect(service.generateAuthTokenAndSendEmail).toHaveBeenCalledWith(
        UserMock,
      );
    });

    it('should throw exception when 1st validation is not passed', async () => {
      const signupCoacheeDtoMock = {
        ...SignupCoacheeDtoMock,
        signupData: {
          ...CreateUserDtoMock,
          role: Roles.COACHEE,
        },
      };
      try {
        await service.signUpCoachee(signupCoacheeDtoMock as any);
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe(
          'Invalid Role, only Users with role COACHEE_OWNER can sign up',
        );
        expect(error.response.errorCode).toBe('INVALID_ROLE');
        expect(error.status).toBe(HttpStatus.FORBIDDEN);
      }
    });

    it('should throw exception when 2nd validation is not passed', async () => {
      UsersServiceMock.create();
      OrganizationsServiceMock.createOrganization();
      CoacheeServiceMock.createCoachee.mockResolvedValue(null);
      try {
        await service.signUpCoachee(SignupCoacheeDtoMock as any);
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe(
          'Internal Server Error when creating user with coachee profile',
        );
        expect(error.response.errorCode).toBe('INTERNAL_SERVER_ERROR');
        expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('signIn', () => {
    it('should return verifyPasswordAndGenerateTokens method', async () => {
      UsersServiceMock.findOneBy(); // UserMock;
      jest
        .spyOn(service, 'verifyPasswordAndGenerateTokens')
        .mockResolvedValue(AuthDtoMock);
      const result = await service.signIn(SignInDtoMock);
      expect(result).toEqual(AuthDtoMock);
    });
  });

  describe('signInStaffOrSuperUser', () => {
    const superuser = { ...UserMock, role: Roles.SUPER_USER };
    it('should return verifyPasswordAndGenerateTokens method', async () => {
      UsersServiceMock.findOneBy.mockResolvedValue(superuser);
      jest
        .spyOn(service, 'verifyPasswordAndGenerateTokens')
        .mockResolvedValue(AuthDtoMock);
      const result = await service.signIn(SignInDtoMock);
      expect(result).toEqual(AuthDtoMock);
    });
  });

  describe('verifyPasswordAndGenerateTokens', () => {
    it('should return a AuthDto when all validations are passed', async () => {
      jest.spyOn(User, 'verifyPassword').mockReturnValue(true);
      UsersServiceMock.update();
      jest.spyOn(service, 'generateTokens').mockResolvedValue(AuthDtoMock);
      const result = await service.verifyPasswordAndGenerateTokens(
        SignInDtoMock,
        UserMock as any,
      );
      expect(result).toEqual(AuthDtoMock);
    });
    it('should throw exception when 1st validation is not passed', async () => {
      jest.spyOn(User, 'verifyPassword').mockReturnValue(false);
      try {
        await service.verifyPasswordAndGenerateTokens(
          SignInDtoMock,
          UserMock as any,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe('Invalid Credentials');
        expect(error.response.errorCode).toBe('INVALID_CREDENTIALS');
        expect(error.status).toBe(HttpStatus.FORBIDDEN);
      }
    });

    it('should throw exception when 2nd validation is not passed', async () => {
      jest.spyOn(User, 'verifyPassword').mockReturnValue(true);
      UsersServiceMock.update.mockResolvedValue(null);
      try {
        await service.verifyPasswordAndGenerateTokens(
          SignInDtoMock,
          UserMock as any,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe('INTERNAL_SERVER_ERROR');
        expect(error.response.errorCode).toBe('INTERNAL_SERVER_ERROR');
        expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });
  describe('rrssBaseSignIn', () => {
    it('should return a AuthDto when all validations are passed', async () => {
      UsersServiceMock.findOneBy.mockResolvedValue(UserMock);
      UsersServiceMock.update.mockResolvedValue({
        ...UserMock,
        lastLoggedIn: new Date(),
      });
      jest.spyOn(service, 'generateTokens').mockResolvedValue(AuthDtoMock);
      const result = await service.rrssBaseSignIn(SignInDtoMock.email);
      expect(result).toEqual(AuthDtoMock);
    });
  });

  describe('verifyAccount', () => {
    const VerifyAccountDtoMock = {
      email: 'email@mail.com',
      code: 'TEST_VERIFICATION_CODE',
    };
    const bcrypt = { compareSync };
    it('should return true when all validations are passed', async () => {
      UsersServiceMock.findOneBy();
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      UsersServiceMock.update();
      const result = await service.verifyAccount(VerifyAccountDtoMock);
      expect(result).toBe(true);
    });
    it('should throw exception when 1st validation is not passed', async () => {
      UsersServiceMock.findOneBy.mockResolvedValue(null);
      try {
        await service.verifyAccount(VerifyAccountDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe('User Not Found');
        expect(error.response.errorCode).toBe('USER_NOT_FOUND');
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw exception when 2st validation is not passed', async () => {
      UsersServiceMock.findOneBy.mockResolvedValue(UserMock);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
      try {
        await service.verifyAccount(VerifyAccountDtoMock);
      } catch (error) {
        expect(error).toBeInstanceOf(MindfitException);
        expect(error.response.error).toBe('Invalid Verification Hash');
        expect(error.response.errorCode).toBe('INVALID_VERIFICATION_HASH');
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('refreshToken', () => {
    const bcrypt = { compareSync };
    it('should return a AuthDto when all validations are passed', async () => {
      UsersServiceMock.findOneBy();
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      jest.spyOn(service, 'generateTokens').mockReturnValue(AuthDtoMock as any);

      const result = await service.refreshToken(
        SessionMock.userId,
        AuthMock.refreshToken,
      );
      expect(result).toEqual(AuthDtoMock);
    });
  });

  describe('requestResetPassword', () => {
    const hashResetPassword = 'TEST_HASH_RESET_PASSWORD';
    const bcrypt = { hashSync };
    it('should return true when all validations are passed', async () => {
      UsersServiceMock.findOneBy();
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(hashResetPassword);

      UsersServiceMock.update.mockResolvedValue({
        ...UserMock,
        hashResetPassword,
      });
      AwsSesServiceMock.sendEmail();
      const result = await service.requestResetPassword(SessionMock.email);
      expect(result).toBe(true);
    });
  });

  describe('resetPassword', () => {
    it('it should user with field password updated when all validations are passed', async () => {
      UsersServiceMock.findOneBy();
      UsersServiceMock.update.mockResolvedValue(updatedUser);

      const result = await service.resetPassword(ResetPasswordDtoMock);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('createPassword', () => {
    it('should return a AuthDto', async () => {
      jest
        .spyOn(service, 'resetPassword')
        .mockResolvedValue(updatedUser as any);

      jest.spyOn(service, 'generateTokens').mockResolvedValue(AuthDtoMock);
      const result = await service.createPassword(ResetPasswordDtoMock);
      expect(result).toEqual(AuthDtoMock);
    });
  });

  describe('logout', () => {
    const userLogOut = {
      ...UserMock,
      hashedRefreshedToken: null,
    };
    it('should return true when user logout', async () => {
      UsersServiceMock.update.mockResolvedValue(userLogOut);
      const result = await service.logout(SessionMock.userId);
      expect(result).toBe(true);
    });
  });

  describe('generateTokens', () => {
    const payloadMock = {
      sub: SessionMock.userId,
      email: SessionMock.email,
      role: SessionMock.role,
    };
    const hashedRefreshTokenUpadatedUser = {
      ...UserMock,
      hashedRefreshToken: AuthMock.refreshToken,
    };
    const bcrypt = { hashSync };
    it('should return a AuthDto', async () => {
      JwtServiceMock.sign.mockReturnValueOnce(AuthMock.token);
      JwtServiceMock.sign.mockReturnValueOnce(AuthMock.refreshToken);
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(AuthMock.refreshToken);
      UsersServiceMock.update.mockResolvedValue(hashedRefreshTokenUpadatedUser);
      const result = await service.generateTokens(payloadMock);

      expect(result).toEqual(AuthDtoMock);
      expect(JwtServiceMock.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe('generateAuthTokenAndSendEmail', () => {
    const RANDOM_VERIFICATION_CODE = 'RAMDOM_VERIFICATION_CODE';
    const bcrypt = { hashSync };
    const updatedUser = {
      ...UserMock,
      verificationCode: RANDOM_VERIFICATION_CODE,
    };

    it('should return a Auth object as a result', async () => {
      jest
        .spyOn(service, 'generateVerificationCode')
        .mockReturnValue(RANDOM_VERIFICATION_CODE);
      jest.spyOn(service, 'generateTokens').mockResolvedValue(AuthDtoMock);
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(RANDOM_VERIFICATION_CODE);
      UsersServiceMock.update.mockResolvedValue(updatedUser);
      AwsSesServiceMock.sendEmail();
      const result = await service.generateAuthTokenAndSendEmail({
        ...UserMock,
      } as any);
      expect(result).toEqual(AuthDtoMock);
    });
  });
});
