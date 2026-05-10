import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDTO {
  @ApiProperty({
    example: 'altamiro.belezia@gmail.com',
    description: 'Email do participante',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'devdevdev', description: 'Senha do participante' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  senha: string;
}
