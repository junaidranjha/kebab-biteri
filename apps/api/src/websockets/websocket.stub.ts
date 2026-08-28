import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class WebsocketGatewayStub {
  private logger = new Logger('WebsocketGatewayStub')

  emitToUser(userId: string, event: string, _data: unknown) {
    this.logger.debug(`[stub] emitToUser ${userId} ${event}`)
  }

  emitToAdmin(event: string, _data: unknown) {
    this.logger.debug(`[stub] emitToAdmin ${event}`)
  }
}
