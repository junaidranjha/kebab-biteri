import { Controller, Post, Body } from '@nestjs/common'
import { CouponsService } from './coupons.service'
import { CouponValidateDto } from '../dto/coupon-validate.dto'

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post('validate')
  async validate(@Body() dto: CouponValidateDto) {
    return this.couponsService.validate(dto)
  }
}
