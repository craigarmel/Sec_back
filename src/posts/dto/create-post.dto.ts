import { IsString, MinLength, IsOptional, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(3, { message: 'Le titre doit contenir au moins 3 caractères' })
  title: string;

  @IsString()
  @MinLength(10, { message: 'Le contenu doit contenir au moins 10 caractères' })
  content: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL d\'image invalide' })
  imageUrl?: string;
}

