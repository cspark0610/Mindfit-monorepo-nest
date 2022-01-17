import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { GoogleResolver } from './resolvers/google.resolver';
import { GoogleService } from './services/google.service';

@Module({
  imports: [AuthModule],
  providers: [GoogleResolver, GoogleService],
})
export class RRSSModule {}
