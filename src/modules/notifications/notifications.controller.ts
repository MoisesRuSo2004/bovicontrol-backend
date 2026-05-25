import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('alerts')
  @ApiOperation({ summary: 'Alertas inteligentes calculadas en tiempo real para la finca' })
  generateAlerts(@CurrentUser('farmId') farmId: string) {
    return this.notificationsService.generateAlerts(farmId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar notificaciones del usuario actual' })
  @ApiQuery({ name: 'isRead', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @CurrentUser('sub') userId: string,
    @CurrentUser('farmId') farmId: string,
    @Query('isRead') isRead?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const read = isRead !== undefined ? isRead === 'true' : undefined;
    return this.notificationsService.findAll(userId, farmId, read, page ? +page : 1, limit ? +limit : 20);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Número de notificaciones no leídas' })
  getUnreadCount(
    @CurrentUser('sub') userId: string,
    @CurrentUser('farmId') farmId: string,
  ) {
    return this.notificationsService.getUnreadCount(userId, farmId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una notificación por ID' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('farmId') farmId: string,
  ) {
    return this.notificationsService.findOne(id, userId, farmId);
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marcar una notificación como leída' })
  markAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('farmId') farmId: string,
  ) {
    return this.notificationsService.markAsRead(id, userId, farmId);
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marcar todas las notificaciones como leídas' })
  markAllAsRead(
    @CurrentUser('sub') userId: string,
    @CurrentUser('farmId') farmId: string,
  ) {
    return this.notificationsService.markAllAsRead(userId, farmId);
  }

  @Delete('read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar todas las notificaciones leídas' })
  deleteAllRead(
    @CurrentUser('sub') userId: string,
    @CurrentUser('farmId') farmId: string,
  ) {
    return this.notificationsService.deleteAllRead(userId, farmId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una notificación' })
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('farmId') farmId: string,
  ) {
    return this.notificationsService.delete(id, userId, farmId);
  }
}
