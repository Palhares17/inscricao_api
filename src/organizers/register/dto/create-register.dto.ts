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
import { MetodoPagamentoEnum } from 'src/core/enum/metodo-pagamento.enum';

export class CreateRegisterDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNotEmpty()
  @IsBoolean()
  gratuito: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  preco?: number | null;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, {
    message: 'Quantidade de vagas deve ser maior ou igual a 0 (0 = ilimitado).',
  })
  vagas: number;

  @IsNotEmpty()
  @IsDateString()
  dataInicioVenda: Date;

  @IsNotEmpty()
  @IsDateString()
  dataFimVenda: Date;

  @IsOptional()
  @IsString()
  documentosExigidos?: string | null;

  @IsOptional()
  @IsArray()
  @IsEnum(MetodoPagamentoEnum, { each: true })
  metodosPagamento?: MetodoPagamentoEnum[] | null;
}
