import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Logger } from '@nestjs/common'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  cors: { origin: '*' },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private logger = new Logger('WebsocketGateway')

  handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId as string | undefined
    const role = client.handshake.auth?.role as string | undefined
    const isAdmin = client.handshake.auth?.isAdmin as boolean | undefined

    if (userId) {
      client.join(`user:${userId}`)
      this.logger.log(`User ${userId} connected (${client.id})`)
    }

    if (role === 'ADMIN' || role === 'MANAGER' || role === 'KITCHEN' || isAdmin === true) {
      client.join('admin')
      this.logger.log(`Admin connected (${client.id}) role=${role} isAdmin=${isAdmin}`)
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket disconnected (${client.id})`)
  }

  emitToUser(userId: string, event: string, data: unknown) {
    this.server?.to(`user:${userId}`).emit(event, data)
  }

  emitToAdmin(event: string, data: unknown) {
    this.logger.log(`Emitting '${event}' to admin room`)
    this.server?.to('admin').emit(event, data)
  }
}
