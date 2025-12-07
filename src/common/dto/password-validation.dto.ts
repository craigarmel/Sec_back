import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;

          // Minimum 12 caractères
          if (value.length < 12) return false;

          // Vérifier au moins 3 critères parmi 4
          const hasUpperCase = /[A-Z]/.test(value);
          const hasLowerCase = /[a-z]/.test(value);
          const hasNumbers = /\d/.test(value);
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

          const criteriaCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(
            Boolean,
          ).length;

          return criteriaCount >= 3;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Le mot de passe doit contenir au moins 12 caractères et satisfaire au moins 3 des 4 critères suivants : majuscules, minuscules, chiffres, caractères spéciaux';
        },
      },
    });
  };
}

