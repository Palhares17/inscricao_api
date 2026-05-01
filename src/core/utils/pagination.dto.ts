import { IsOptional, IsInt, Min, Max, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationDto {
  @ApiProperty({
    description: 'Número da página desejada',
    required: false,
    default: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O número da página deve ser um número inteiro.' })
  @Min(1, { message: 'O número da página deve ser no mínimo 1.' })
  page?: number = 1;

  @ApiProperty({
    description: 'Quantidade de itens por página',
    required: false,
    default: 10,
    maximum: 100,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O limite por página deve ser um número inteiro.' })
  @Min(1, { message: 'O limite por página deve ser no mínimo 1.' })
  @Max(100, { message: 'O limite por página deve ser no máximo 100.' })
  limit?: number = 10;

  @ApiProperty({
    description:
      'Ordem dos resultados (ASC para crescente, DESC para decrescente)',
    required: false,
    default: OrderEnum.DESC,
    enum: OrderEnum,
  })
  @IsOptional()
  @IsEnum(OrderEnum, { message: 'A ordem deve ser ASC ou DESC.' })
  order?: OrderEnum = OrderEnum.DESC;
  @ApiProperty({
    description: 'Termo de busca para filtrar os resultados',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'O termo de busca deve ser um texto.' })
  search?: string;
}
