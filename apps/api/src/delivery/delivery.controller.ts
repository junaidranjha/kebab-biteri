import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common'
import { DeliveryService } from './delivery.service'
import { JwtAuthGuard } from '../common/jwt-auth.guard'
import { RolesGuard } from '../common/roles.guard'
import { Roles } from '../common/roles.decorator'
import { CurrentUser } from '../common/current-user.decorator'
import { Role } from '@kebab-biteri/types'

@Controller('delivery')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get('available-drivers')
  @Roles(Role.ADMIN, Role.MANAGER)
  async getAvailableDrivers() {
    return this.deliveryService.getAvailableDrivers()
  }

  // Keep old endpoint with param for backward compat
  @Get('available-drivers/:branchId')
  @Roles(Role.ADMIN, Role.MANAGER)
  async getAvailableDriversByBranch(@Param('branchId') branchId: string) {
    return this.deliveryService.getAvailableDrivers()
  }

  @Patch('assign/:orderId')
  @Roles(Role.ADMIN, Role.MANAGER)
  async assignDriver(
    @Param('orderId') orderId: string,
    @Body() body: { driverId: string },
  ) {
    return this.deliveryService.assignDriver(orderId, body.driverId)
  }

  @Patch('pickup/:orderId')
  @Roles(Role.DELIVERY)
  async pickup(
    @Param('orderId') orderId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.deliveryService.pickup(orderId, user.userId)
  }

  @Patch('deliver/:orderId')
  @Roles(Role.DELIVERY)
  async deliver(
    @Param('orderId') orderId: string,
    @CurrentUser() user: { userId: string },
  ) {
    return this.deliveryService.deliver(orderId, user.userId)
  }

  @Patch('eta/:orderId')
  @Roles(Role.DELIVERY)
  async updateEta(
    @Param('orderId') orderId: string,
    @Body() body: { etaMinutes: number },
  ) {
    return this.deliveryService.updateEta(orderId, body.etaMinutes)
  }

  @Get('my-deliveries')
  @Roles(Role.DELIVERY)
  async myDeliveries(@CurrentUser() user: { userId: string }) {
    return this.deliveryService.getDriverDeliveries(user.userId)
  }

  @Patch('availability')
  @Roles(Role.DELIVERY)
  async toggleAvailability(
    @CurrentUser() user: { userId: string },
    @Body() body: { available: boolean },
  ) {
    return this.deliveryService.toggleAvailability(user.userId, body.available)
  }
}
