import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { MetodoPagamentoEnum } from 'src/core/enum/metodo-pagamento.enum';

export class CreateEnrollmentDto {
  @ApiProperty({
    description: 'ID da modalidade de inscrição escolhida',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  modalidadeId: string;

  @ApiProperty({
    description: 'Método de pagamento utilizado pelo participante',
    enum: MetodoPagamentoEnum,
    enumName: 'MetodoPagamentoEnum',
    example: MetodoPagamentoEnum.Pix,
  })
  @IsEnum(MetodoPagamentoEnum)
  metodoDePagamento: MetodoPagamentoEnum;
}
