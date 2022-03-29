import { InputType, OmitType } from '@nestjs/graphql';
import { MessageDto } from 'src/subscriptions/dto/message.dto';

@InputType()
export class UpdateMessageDto extends OmitType(MessageDto, ['chatId']) {}
