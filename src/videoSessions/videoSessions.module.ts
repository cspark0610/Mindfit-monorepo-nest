import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CoachingModule } from 'src/coaching/coaching.module';
import { UsersModule } from '../users/users.module';
import { CoachingSession } from './models/coachingSessions.model';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => CoachingModule),
    SequelizeModule.forFeature([CoachingSession]),
  ],
  providers: [],
})
export class VideoSessionsModule {}
