import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExtraDto {
  @ApiProperty({
    description: 'Nome do extra (atividade/item adicional) do evento.',
    example: 'Workshop de Acessibilidade',
    maxLength: 255,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  nome: string;

  @ApiProperty({
    description: 'Descrição opcional do extra.',
    example: 'Workshop prático de 2h sobre WCAG e leitores de tela.',
    required: false,
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  descricao?: string | null;

  @ApiProperty({
    description:
      'Indica se o extra é gratuito. Quando `true`, `preco` deve ser `null`. Quando `false`, `preco` é obrigatório (> 0).',
    example: false,
    type: Boolean,
  })
  @IsNotEmpty()
  @IsBoolean()
  gratuito: boolean;

  @ApiProperty({
    description:
      'Preço do extra em reais. Obrigatório (> 0) quando `gratuito` é `false`. Deve ser `null` quando `gratuito` é `true`.',
    example: 80,
    required: false,
    nullable: true,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  preco?: number | null;

  @ApiProperty({
    description:
      'Quantidade de vagas disponíveis para o extra. Use `0` para vagas ilimitadas.',
    example: 30,
    minimum: 0,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0, {
    message: 'Quantidade de vagas deve ser maior ou igual a 0 (0 = ilimitado).',
  })
  vagas: number;

  @ApiProperty({
    description:
      'Indica se a participação no extra concede certificado. Quando `true`, `cargaHoraria` é obrigatória.',
    example: true,
    type: Boolean,
  })
  @IsNotEmpty()
  @IsBoolean()
  vaiTerCertificado: boolean;

  @ApiProperty({
    description:
      'Carga horária do extra (ISO 8601). Obrigatória quando `vaiTerCertificado` é `true`. Deve ser `null` caso contrário.',
    example: '2026-06-15T02:00:00.000Z',
    required: false,
    nullable: true,
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  cargaHoraria?: Date | null;

  @ApiProperty({
    description:
      'Data/hora de início do extra (ISO 8601). Deve ser anterior a `dataFimDoExtra`.',
    example: '2026-06-15T14:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDateString()
  dataInicioDoExtra: Date;

  @ApiProperty({
    description: 'Data/hora de término do extra (ISO 8601).',
    example: '2026-06-15T16:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDateString()
  dataFimDoExtra: Date;

  @ApiProperty({
    description:
      'Data/hora de abertura das vendas do extra (ISO 8601). Deve ser anterior a `dataFimVenda`.',
    example: '2026-05-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDateString()
  dataInicioVenda: Date;

  @ApiProperty({
    description: 'Data/hora de encerramento das vendas do extra (ISO 8601).',
    example: '2026-06-10T23:59:59.000Z',
    type: String,
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDateString()
  dataFimVenda: Date;
}
