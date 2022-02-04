import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { GoogleResolver } from 'src/rrss/resolvers/google.resolver';
import { GoogleService } from 'src/rrss/services/google.service';

@Module({
  imports: [AuthModule],
  providers: [GoogleResolver, GoogleService],
})
export class RRSSModule {}
