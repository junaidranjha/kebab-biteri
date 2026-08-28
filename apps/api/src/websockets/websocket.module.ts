import { Module } from '@nestjs/common'
import { WebsocketGateway } from './websocket.gateway'
import { WebsocketGatewayStub } from './websocket.stub'

const isServerless = !!process.env.VERCEL

@Module({
  providers: isServerless
    ? [{ provide: WebsocketGateway, useClass: WebsocketGatewayStub }]
    : [WebsocketGateway],
  exports: [WebsocketGateway],
})
export class WebsocketModule {}
