import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCheckInDto {
  @ApiProperty({
    description: 'Token UUID do QR code da inscrição.',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  qrCodeToken: string;
}
