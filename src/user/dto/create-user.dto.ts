import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @IsAlphanumeric()
  @IsNotEmpty()
  @IsString()
  password: string;

  @MinLength(3)
  @MaxLength(55)
  @IsString()
  @IsNotEmpty()
  name?: string;
}
