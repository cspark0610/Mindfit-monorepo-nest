import { Module } from '@nestjs/common';
import { AgoraResolver } from 'src/agora/resolvers/agora.resolver';
import { AgoraService } from 'src/agora/services/agora.service';

@Module({
  imports: [],
  providers: [AgoraResolver, AgoraService],
  exports: [AgoraService],
})
export class AgoraModule {}
