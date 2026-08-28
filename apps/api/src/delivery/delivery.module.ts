import { Module } from '@nestjs/common'
import { DeliveryController } from './delivery.controller'
import { DeliveryService } from './delivery.service'
import { DatabaseModule } from '../database/database.module'
import { WebsocketModule } from '../websockets/websocket.module'

@Module({
  imports: [DatabaseModule, WebsocketModule],
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
