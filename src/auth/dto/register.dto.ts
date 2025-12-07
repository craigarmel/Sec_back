import { IsEmail, IsString, MinLength, IsBoolean } from 'class-validator';
import { IsStrongPassword } from '../../common/dto/password-validation.dto';

export class RegisterDto {
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @IsString()
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  name: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsBoolean()
  consentGiven: boolean; // Doit être true pour valider
}

