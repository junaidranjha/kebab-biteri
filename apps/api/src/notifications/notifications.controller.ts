import { Controller, Get, Patch, Param, UseGuards, Query } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { JwtAuthGuard } from '../common/jwt-auth.guard'
import { CurrentUser } from '../common/current-user.decorator'
import { PaginationDto } from '../dto/pagination.dto'

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@CurrentUser() user: { userId: string }, @Query() query: PaginationDto) {
    return this.notificationsService.getUserNotifications(user.userId, query.page, query.limit)
  }

  @Get('unread-count')
  async unreadCount(@CurrentUser() user: { userId: string }) {
    const count = await this.notificationsService.getUnreadCount(user.userId)
    return { count }
  }

  @Patch(':id/read')
  async markAsRead(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.notificationsService.markAsRead(user.userId, id)
  }

  @Patch('read-all')
  async markAllAsRead(@CurrentUser() user: { userId: string }) {
    return this.notificationsService.markAllAsRead(user.userId)
  }
}
