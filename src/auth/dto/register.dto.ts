import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  IsOptional,
} from 'class-validator';
import type { UserRole } from '../../users/entities/user.entity';

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{12,}$/;

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(12)
  @Matches(PASSWORD_REGEX, {
    message:
      'Le mot de passe doit contenir 12 caractères, avec majuscule, minuscule, chiffre et symbole',
  })
  password: string;

  @IsBoolean()
  consent: boolean;

  @IsOptional()
  @IsIn(['admin', 'user'])
  role?: UserRole;
}
