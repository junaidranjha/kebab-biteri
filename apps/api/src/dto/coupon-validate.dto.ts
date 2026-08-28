import { IsString, IsNumber, Min } from 'class-validator'

export class CouponValidateDto {
  @IsString()
  code: string

  @IsNumber()
  @Min(0)
  subtotal: number
}
