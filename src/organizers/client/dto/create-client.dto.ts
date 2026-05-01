import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateClientDto {
  @ApiProperty({
    example: 'Pedro Henrique',
    description: 'Nome do participante',
  })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({
    example: 'pedro.oliveira3@gmail.com',
    description: 'Email do organizador',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'devdevdev',
    description: 'Senha do organizador',
  })
  @IsNotEmpty()
  @IsString()
  senha: string;

  @ApiProperty({
    example: true,
    description: 'Se o organizador está ou não habilitado a usar o sistema',
  })
  @IsNotEmpty()
  @IsBoolean()
  ativo: boolean;

  @ApiProperty({
    example: '1c950519-e967-4bf0-b9d0-8fedd90ee251',
    description:
      'Id da categoria de usuário (admin, organizador, chair, etc...)',
  })
  @IsNotEmpty()
  @IsString()
  roleId: string;
}
