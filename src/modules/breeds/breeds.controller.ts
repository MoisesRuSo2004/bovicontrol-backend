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
import { BreedsService } from './breeds.service';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';

@ApiTags('Breeds')
@ApiBearerAuth()
@Controller('breeds')
export class BreedsController {
  constructor(private readonly breedsService: BreedsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear nueva raza' })
  create(@Body() dto: CreateBreedDto) {
    return this.breedsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las razas' })
  findAll() {
    return this.breedsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una raza por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.breedsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar una raza' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBreedDto) {
    return this.breedsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una raza' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.breedsService.remove(id);
  }
}
