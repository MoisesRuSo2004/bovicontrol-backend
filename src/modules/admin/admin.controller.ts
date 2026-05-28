import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateClientDto } from './dto/create-client.dto';
import { ToggleEntityDto } from './dto/toggle-entity.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@Roles(UserRole.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Estadísticas globales del sistema' })
  getStats() {
    return this.adminService.getStats();
  }

  @Get('farms')
  @ApiOperation({ summary: 'Listar todas las fincas con estado de suscripción' })
  listFarms() {
    return this.adminService.listFarms();
  }

  @Post('clients')
  @ApiOperation({ summary: 'Crear finca + usuario admin (nuevo cliente)' })
  createClient(@Body() dto: CreateClientDto) {
    return this.adminService.createClient(dto);
  }

  @Patch('farms/:id/subscription')
  @ApiOperation({ summary: 'Actualizar suscripción de una finca' })
  updateSubscription(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateSubscriptionDto,
  ) {
    return this.adminService.updateSubscription(id, body.months ?? null, body.notes);
  }

  @Patch('farms/:id/toggle')
  @ApiOperation({ summary: 'Activar o desactivar una finca' })
  toggleFarm(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: ToggleEntityDto,
  ) {
    return this.adminService.toggleFarm(id, body.isActive);
  }

  @Patch('users/:id/toggle')
  @ApiOperation({ summary: 'Activar o desactivar un usuario' })
  toggleUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: ToggleEntityDto,
  ) {
    return this.adminService.toggleUser(id, body.isActive);
  }
}
