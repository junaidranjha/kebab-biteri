import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Coupon } from '../schemas'

@Injectable()
export class CouponsService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<Coupon>) {}

  async validate(dto: { code: string; subtotal: number }) {
    const coupon = await this.couponModel.findOne({ code: dto.code, isActive: true }).lean()

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Cupón no válido' }
    }

    if (coupon.endsAt && new Date(coupon.endsAt) < new Date()) {
      return { valid: false, discount: 0, message: 'Cupón expirado' }
    }

    if (coupon.startsAt && new Date(coupon.startsAt) > new Date()) {
      return { valid: false, discount: 0, message: 'Cupón aún no válido' }
    }

    if (coupon.maxUses && coupon.usesCount >= coupon.maxUses) {
      return { valid: false, discount: 0, message: 'Cupón agotado' }
    }

    if (dto.subtotal < coupon.minOrderAmount) {
      return { valid: false, discount: 0, message: `Pedido mínimo de ${coupon.minOrderAmount}€ requerido` }
    }

    let discount = 0
    if (coupon.type === 'PERCENTAGE') {
      discount = (dto.subtotal * coupon.value) / 100
    } else if (coupon.type === 'FIXED_AMOUNT') {
      discount = coupon.value
    } else if (coupon.type === 'FREE_DELIVERY') {
      discount = 1.99 // standard delivery fee
    }
    discount = Math.min(discount, dto.subtotal)

    return { valid: true, discount, message: `Cupón aplicado: -${discount.toFixed(2)}€` }
  }
}
