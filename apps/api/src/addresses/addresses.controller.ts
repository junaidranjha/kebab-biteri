import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common'
import { AddressesService } from './addresses.service'
import { JwtAuthGuard } from '../common/jwt-auth.guard'
import { CurrentUser } from '../common/current-user.decorator'

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  async findAll(@CurrentUser() user: { userId: string }) {
    return this.addressesService.findAll(user.userId)
  }

  @Post()
  async create(
    @CurrentUser() user: { userId: string },
    @Body() dto: {
      label: string
      street: string
      city: string
      postalCode: string
      country?: string
      lat: number
      lng: number
      instructions?: string
      isDefault?: boolean
    },
  ) {
    return this.addressesService.create(user.userId, dto)
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() dto: Partial<{
      label: string
      street: string
      city: string
      postalCode: string
      instructions: string
      isDefault: boolean
    }>,
  ) {
    return this.addressesService.update(user.userId, id, dto)
  }

  @Delete(':id')
  async remove(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.addressesService.remove(user.userId, id)
  }
}
