import { Module } from '@nestjs/common'
import { CouponsController } from './coupons.controller'
import { CouponsService } from './coupons.service'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponsModule {}
