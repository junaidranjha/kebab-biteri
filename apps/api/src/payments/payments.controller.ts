import {
  Controller,
  Post,
  Body,
  Headers,
  Param,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { CreatePaymentDto } from '../dto/create-payment.dto'
import { JwtAuthGuard } from '../common/jwt-auth.guard'
import type { Request } from 'express'

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(dto)
  }

  @Get(':id/verify')
  @UseGuards(JwtAuthGuard)
  async verify(@Param('id') id: string) {
    return this.paymentsService.verifyPayment(id)
  }

  // Webhook — NO auth guard (provider calls this)
  // Signature verification is done inside the handler
  @Post('webhook')
  async webhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentsService.handleWebhook(req.body, signature ?? '')
  }
}
