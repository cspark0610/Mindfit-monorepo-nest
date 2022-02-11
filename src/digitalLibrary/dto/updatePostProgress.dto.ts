import { InputType, PartialType } from '@nestjs/graphql';
import { PostProgressDto } from 'src/digitalLibrary/dto/postProgress.dto';

@InputType()
export class UpdatePostProgressDto extends PartialType(PostProgressDto) {}
