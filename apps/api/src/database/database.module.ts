import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import {
  User, UserSchema,
  Category, CategorySchema,
  Product, ProductSchema,
  Branch, BranchSchema,
  Promotion, PromotionSchema,
  Order, OrderSchema,
  Coupon, CouponSchema,
  Address, AddressSchema,
  Notification, NotificationSchema,
} from '../schemas'

const DB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/kebab-biteri'

@Module({
  imports: [
    MongooseModule.forRoot(DB_URL),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: Branch.name, schema: BranchSchema },
      { name: Promotion.name, schema: PromotionSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Coupon.name, schema: CouponSchema },
      { name: Address.name, schema: AddressSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
