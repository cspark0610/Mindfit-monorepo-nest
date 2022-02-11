import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsPositive } from 'class-validator';
import { getEntity } from 'src/common/functions/getEntity';
import { FavoritePost } from 'src/digitalLibrary/models/favoritePost.model';
import { User } from 'src/users/models/users.model';

@InputType()
export class FavoritePostDto {
  @Field()
  @IsNumber()
  @IsPositive()
  strapiPostId: number;

  public static async from(
    dto: FavoritePostDto,
    userId: number,
  ): Promise<Partial<FavoritePost>> {
    return {
      ...dto,
      user: await getEntity(userId, User),
    };
  }
}
