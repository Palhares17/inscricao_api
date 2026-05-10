import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateParticipantDto {
  constructor(props: any) {
    if (props.email) this.email = props.email;
    if (props.nome) this.nome = props.nome;
    if (props.senha) this.senha = props.senha;
  }

  @ApiProperty({
    example: 'participanteEmail@gmail.com',
    description: 'E-mail do participante',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Pedro de Alcantara',
    description: 'Nome do participante',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    example: 'abc2502!?',
    description: 'Senha do participante',
  })
  @IsString()
  @IsNotEmpty()
  senha: string;
}
