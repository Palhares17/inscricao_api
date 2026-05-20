import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { MetodoPagamentoEnum } from 'src/core/enum/metodo-pagamento.enum';

export class CreateExtraDto {
  @ApiProperty({
    description: 'Método de pagamento utilizado pelo participante',
    enum: MetodoPagamentoEnum,
    enumName: 'MetodoPagamentoEnum',
    example: MetodoPagamentoEnum.Pix,
  })
  @IsEnum(MetodoPagamentoEnum)
  metodoDePagamento: MetodoPagamentoEnum;
}
