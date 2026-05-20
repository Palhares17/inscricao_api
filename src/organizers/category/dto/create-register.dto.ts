import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MetodoPagamentoEnum } from 'src/core/enum/metodo-pagamento.enum';

export class CreateRegisterDto {
  @ApiProperty({
    description: 'Nome da modalidade de inscrição.',
    example: 'Inscrição Premium',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'Descrição opcional da modalidade.',
    example: 'Inclui acesso a todas as palestras e workshops.',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty({
    description:
      'Indica se a modalidade é gratuita. Quando `true`, `preco` e `metodosPagamento` devem ser `null`. Quando `false`, ambos são obrigatórios.',
    example: false,
    type: Boolean,
  })
  @IsNotEmpty()
  @IsBoolean()
  gratuito: boolean;

  @ApiProperty({
    description:
      'Preço da modalidade em reais. Obrigatório (> 0) quando `gratuito` é `false`. Deve ser `null` quando `gratuito` é `true`.',
    example: 150,
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
      'Quantidade de vagas disponíveis. Use `0` para vagas ilimitadas.',
    example: 100,
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
      'Data/hora de abertura das vendas (ISO 8601). Deve ser anterior a `dataFimVenda`.',
    example: '2026-06-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDateString()
  dataInicioVenda: Date;

  @ApiProperty({
    description: 'Data/hora de encerramento das vendas (ISO 8601).',
    example: '2026-07-30T23:59:59.000Z',
    type: String,
    format: 'date-time',
  })
  @IsNotEmpty()
  @IsDateString()
  dataFimVenda: Date;

  @ApiProperty({
    description:
      'Texto livre listando documentos exigidos do inscrito (ex.: RG, CNH, comprovante).',
    example: 'RG ou CNH e carta-convite da organização.',
    required: false,
    nullable: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  documentosExigidos?: string | null;

  @ApiProperty({
    description:
      'Métodos de pagamento aceitos. Obrigatório (≥ 1) quando `gratuito` é `false`. Deve ser `null` quando `gratuito` é `true`.',
    example: ['pix', 'credito'],
    required: false,
    nullable: true,
    isArray: true,
    enum: MetodoPagamentoEnum,
    enumName: 'MetodoPagamentoEnum',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(MetodoPagamentoEnum, { each: true })
  metodosPagamento?: MetodoPagamentoEnum[] | null;
}
