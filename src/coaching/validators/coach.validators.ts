import { HttpStatus } from '@nestjs/common';
import { MindfitException } from 'src/common/exceptions/mindfitException';
import { User } from 'src/users/models/users.model';
import { CoachDto, EditCoachDto } from 'src/coaching/dto/coach.dto';
import { CoachingError } from 'src/coaching/enums/coachingErrors.enum';

export const haveCoachProfile = (user: User): boolean =>
  user?.coach ? true : false;

export function validateIfDtoIncludesPictureOrVideo(
  dto: CoachDto | EditCoachDto,
) {
  if (dto.picture || dto.videoPresentation) {
    throw new MindfitException({
      error: 'You cannot create/edit pictures nor video of coaches',
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: CoachingError.ACTION_NOT_ALLOWED,
    });
  }
}

export function validateIfCoachIdsIncludesHostUserId(
  coachIds: number[],
  hostUserId: number,
) {
  if (coachIds.includes(hostUserId)) {
    throw new MindfitException({
      error: 'You cannot edit yourself as staff or super_user',
      statusCode: HttpStatus.BAD_REQUEST,
      errorCode: CoachingError.ACTION_NOT_ALLOWED,
    });
  }
}
