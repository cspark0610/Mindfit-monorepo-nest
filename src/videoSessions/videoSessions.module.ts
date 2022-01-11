import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachingModule } from '../coaching/coaching.module';
import { UsersModule } from '../users/users.module';
import { CoachingSession } from './models/coachingSession.model';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => CoachingModule),
    TypeOrmModule.forFeature([CoachingSession]),
  ],
  providers: [],
})
export class VideoSessionsModule {}
