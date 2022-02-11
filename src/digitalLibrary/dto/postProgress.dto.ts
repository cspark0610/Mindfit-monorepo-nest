import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsPositive } from 'class-validator';
import { getEntity } from 'src/common/functions/getEntity';
import { PostProgress } from 'src/digitalLibrary/models/postProgress.model';
import { User } from 'src/users/models/users.model';

@InputType()
export class PostProgressDto {
  @Field()
  @IsNumber()
  @IsPositive()
  strapiPostId: number;

  @Field()
  @IsNumber()
  @IsPositive()
  progress: number;

  public static async from(
    dto: PostProgressDto,
    userId: number,
  ): Promise<Partial<PostProgress>> {
    return {
      ...dto,
      user: await getEntity(userId, User),
    };
  }
}
