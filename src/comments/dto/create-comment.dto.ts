import { IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(3, { message: 'Le commentaire doit contenir au moins 3 caractères' })
  content: string;
}

