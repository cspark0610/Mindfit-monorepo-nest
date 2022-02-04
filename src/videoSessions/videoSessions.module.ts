import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoachingModule } from 'src/coaching/coaching.module';
import { UsersModule } from 'src/users/users.module';
import { CoachingSession } from 'src/videoSessions/models/coachingSession.model';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => CoachingModule),
    TypeOrmModule.forFeature([CoachingSession]),
  ],
  providers: [],
})
export class VideoSessionsModule {}
