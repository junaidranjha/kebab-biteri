import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { DatabaseModule } from './database/database.module'
import { MenuModule } from './menu/menu.module'
import { AuthModule } from './auth/auth.module'
import { OrdersModule } from './orders/orders.module'
import { PaymentsModule } from './payments/payments.module'
import { CouponsModule } from './coupons/coupons.module'
import { AddressesModule } from './addresses/addresses.module'
import { AdminModule } from './admin/admin.module'
import { WebsocketModule } from './websockets/websocket.module'
import { DeliveryModule } from './delivery/delivery.module'
import { NotificationsModule } from './notifications/notifications.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [".env", "../../.env"] }),
    ThrottlerModule.forRoot([
      { ttl: 60000, limit: 100 },
    ]),
    DatabaseModule,
    AuthModule,
    MenuModule,
    OrdersModule,
    PaymentsModule,
    CouponsModule,
    AddressesModule,
    AdminModule,
    WebsocketModule,
    DeliveryModule,
    NotificationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
