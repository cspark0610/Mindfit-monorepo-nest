import { InputType } from '@nestjs/graphql';
import { FavoritePostDto } from 'src/digitalLibrary/dto/favoritePost.dto';

@InputType()
export class UpdateFavoritePostDto extends FavoritePostDto {}
