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
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { FarmsService } from './farms.service';

@ApiTags('Farms')
@ApiBearerAuth()
@Controller('farms')
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear una nueva finca' })
  create(@Body() dto: CreateFarmDto) {
    return this.farmsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las fincas' })
  findAll() {
    return this.farmsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una finca' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.farmsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar datos de una finca' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFarmDto) {
    return this.farmsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una finca' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.farmsService.remove(id);
  }
}
