import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './resolvers/auth.resolver';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './services/jwt.strategy';
import { RefreshJwtStrategy } from './services/refreshJwt.strategy';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  providers: [AuthResolver, AuthService, JwtStrategy, RefreshJwtStrategy],
})
export class AuthModule {}
