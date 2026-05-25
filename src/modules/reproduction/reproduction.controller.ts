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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PregnancyStatus } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreatePregnancyDto } from './dto/create-pregnancy.dto';
import { CreateReproductiveEventDto } from './dto/create-reproductive-event.dto';
import { UpdatePregnancyDto } from './dto/update-pregnancy.dto';
import { ReproductionService } from './reproduction.service';

@ApiTags('Reproduction')
@ApiBearerAuth()
@Controller('reproduction')
export class ReproductionController {
  constructor(private readonly reproductionService: ReproductionService) {}

  // ─── Reproductive Events ────────────────────────────────────────────────────

  @Post('events')
  @ApiOperation({ summary: 'Registrar un evento reproductivo' })
  createEvent(@CurrentUser('farmId') farmId: string, @Body() dto: CreateReproductiveEventDto) {
    return this.reproductionService.createEvent(farmId, dto);
  }

  @Get('events')
  @ApiOperation({ summary: 'Listar eventos reproductivos de la finca' })
  @ApiQuery({ name: 'animalId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllEvents(
    @CurrentUser('farmId') farmId: string,
    @Query('animalId') animalId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reproductionService.findAllEvents(farmId, animalId, page ? +page : 1, limit ? +limit : 20);
  }

  @Get('events/:id')
  @ApiOperation({ summary: 'Obtener un evento reproductivo por ID' })
  findOneEvent(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('farmId') farmId: string) {
    return this.reproductionService.findOneEvent(id, farmId);
  }

  @Delete('events/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un evento reproductivo' })
  removeEvent(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('farmId') farmId: string) {
    return this.reproductionService.removeEvent(id, farmId);
  }

  @Patch('events/:id')
  @ApiOperation({ summary: 'Actualizar un evento reproductivo' })
  updateEvent(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('farmId') farmId: string,
    @Body() dto: Partial<CreateReproductiveEventDto>,
  ) {
    return this.reproductionService.updateEvent(id, farmId, dto);
  }

  // ─── Pregnancies ────────────────────────────────────────────────────────────

  @Post('pregnancies')
  @ApiOperation({ summary: 'Registrar una preñez' })
  createPregnancy(@CurrentUser('farmId') farmId: string, @Body() dto: CreatePregnancyDto) {
    return this.reproductionService.createPregnancy(farmId, dto);
  }

  @Get('pregnancies')
  @ApiOperation({ summary: 'Listar preñeces de la finca' })
  @ApiQuery({ name: 'animalId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: PregnancyStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllPregnancies(
    @CurrentUser('farmId') farmId: string,
    @Query('animalId') animalId?: string,
    @Query('status') status?: PregnancyStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.reproductionService.findAllPregnancies(farmId, animalId, status, page ? +page : 1, limit ? +limit : 20);
  }

  @Get('pregnancies/upcoming-births')
  @ApiOperation({ summary: 'Partos esperados en los próximos N días' })
  @ApiQuery({ name: 'daysAhead', required: false, type: Number })
  getUpcomingBirths(
    @CurrentUser('farmId') farmId: string,
    @Query('daysAhead') daysAhead?: string,
  ) {
    return this.reproductionService.getUpcomingBirths(farmId, daysAhead ? +daysAhead : 30);
  }

  @Get('pregnancies/:id')
  @ApiOperation({ summary: 'Obtener detalle de una preñez' })
  findOnePregnancy(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('farmId') farmId: string) {
    return this.reproductionService.findOnePregnancy(id, farmId);
  }

  @Patch('pregnancies/:id')
  @ApiOperation({ summary: 'Actualizar estado de una preñez' })
  updatePregnancy(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('farmId') farmId: string,
    @Body() dto: UpdatePregnancyDto,
  ) {
    return this.reproductionService.updatePregnancy(id, farmId, dto);
  }

  @Delete('pregnancies/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una preñez' })
  deletePregnancy(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('farmId') farmId: string,
  ) {
    return this.reproductionService.deletePregnancy(id, farmId);
  }
}
