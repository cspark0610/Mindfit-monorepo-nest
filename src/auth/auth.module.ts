import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from 'src/auth/resolvers/auth.resolver';
import { AuthService } from 'src/auth/services/auth.service';
import { JwtStrategy } from 'src/auth/services/jwt.strategy';
import { RefreshJwtStrategy } from 'src/auth/services/refreshJwt.strategy';
import { AwsModule } from 'src/aws/aws.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [AwsModule, forwardRef(() => UsersModule), JwtModule.register({})],
  providers: [AuthResolver, AuthService, JwtStrategy, RefreshJwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
