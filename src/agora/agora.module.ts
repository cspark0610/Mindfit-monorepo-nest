import { Module } from '@nestjs/common';
import { AgoraService } from 'src/agora/services/agora.service';

@Module({
  imports: [],
  providers: [AgoraService],
  exports: [AgoraService],
})
export class AgoraModule {}
