import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  getMe(@CurrentUser() user: { id: string; farmId: string }) {
    return this.usersService.findOne(user.id, user.farmId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuarios de la finca' })
  findAll(@CurrentUser('farmId') farmId: string) {
    return this.usersService.findAll(farmId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('farmId') farmId: string,
  ) {
    return this.usersService.findOne(id, farmId);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar datos de un usuario' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('farmId') farmId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, farmId, dto);
  }

  @Patch(':id/change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cambiar contraseña de un usuario' })
  changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('farmId') farmId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, farmId, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un usuario' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('farmId') farmId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    return this.usersService.remove(id, farmId, role);
  }
}
