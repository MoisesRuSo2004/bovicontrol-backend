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
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateMilkRecordDto } from './dto/create-milk-record.dto';
import { CreateMilkSaleDto } from './dto/create-milk-sale.dto';
import { CreateWeightRecordDto } from './dto/create-weight-record.dto';
import { UpsertDairyConfigDto } from './dto/upsert-dairy-config.dto';
import { ProductionService } from './production.service';

@ApiTags('Production')
@ApiBearerAuth()
@Controller('production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  // ─── Dairy Config ─────────────────────────────────────────────────────────────

  @Get('dairy-config')
  @ApiOperation({ summary: 'Obtener configuración de la lechera' })
  getDairyConfig(@CurrentUser('farmId') farmId: string) {
    return this.productionService.getDairyConfig(farmId);
  }

  @Put('dairy-config')
  @ApiOperation({ summary: 'Guardar/actualizar configuración de la lechera' })
  upsertDairyConfig(@CurrentUser('farmId') farmId: string, @Body() dto: UpsertDairyConfigDto) {
    return this.productionService.upsertDairyConfig(farmId, dto);
  }

  // ─── Milk Sales ───────────────────────────────────────────────────────────────

  @Get('milk-sales/summary')
  @ApiOperation({ summary: 'Resumen del período actual + gráfica' })
  getMilkSalesSummary(@CurrentUser('farmId') farmId: string) {
    return this.productionService.getMilkSalesSummary(farmId);
  }

  @Get('milk-sales/periods')
  @ApiOperation({ summary: 'Historial de períodos completados con detalle para PDF' })
  @ApiQuery({ name: 'count', required: false, type: Number })
  getPastPeriods(
    @CurrentUser('farmId') farmId: string,
    @Query('count') count?: string,
  ) {
    return this.productionService.getPastPeriods(farmId, count ? +count : 6);
  }

  @Get('milk-sales')
  @ApiOperation({ summary: 'Listar ventas de leche' })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to',   required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllMilkSales(
    @CurrentUser('farmId') farmId: string,
    @Query('from') from?: string,
    @Query('to')   to?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productionService.findAllMilkSales(farmId, from, to, page ? +page : 1, limit ? +limit : 30);
  }

  @Post('milk-sales')
  @ApiOperation({ summary: 'Registrar venta de leche' })
  createMilkSale(@CurrentUser('farmId') farmId: string, @Body() dto: CreateMilkSaleDto) {
    return this.productionService.createMilkSale(farmId, dto);
  }

  @Patch('milk-sales/:id')
  @ApiOperation({ summary: 'Actualizar registro de leche' })
  updateMilkSale(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('farmId') farmId: string,
    @Body() dto: Partial<CreateMilkSaleDto>,
  ) {
    return this.productionService.updateMilkSale(id, farmId, dto);
  }

  @Delete('milk-sales/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar registro de leche' })
  deleteMilkSale(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('farmId') farmId: string) {
    return this.productionService.deleteMilkSale(id, farmId);
  }

  // ─── Milk Records (per-animal, legacy) ───────────────────────────────────────

  @Post('milk')
  @ApiOperation({ summary: 'Registrar producción de leche por animal' })
  createMilkRecord(@CurrentUser('farmId') farmId: string, @Body() dto: CreateMilkRecordDto) {
    return this.productionService.createMilkRecord(farmId, dto);
  }

  @Get('milk')
  @ApiOperation({ summary: 'Listar registros de leche por animal' })
  @ApiQuery({ name: 'animalId', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to',   required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllMilkRecords(
    @CurrentUser('farmId') farmId: string,
    @Query('animalId') animalId?: string,
    @Query('from') from?: string,
    @Query('to')   to?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productionService.findAllMilkRecords(farmId, animalId, from, to, page ? +page : 1, limit ? +limit : 20);
  }

  @Get('milk/summary')
  @ApiOperation({ summary: 'Resumen de producción de leche en rango de fechas' })
  @ApiQuery({ name: 'from', required: true })
  @ApiQuery({ name: 'to',   required: true })
  getMilkSummary(@CurrentUser('farmId') farmId: string, @Query('from') from: string, @Query('to') to: string) {
    return this.productionService.getMilkSummary(farmId, from, to);
  }

  @Get('milk/:id')
  @ApiOperation({ summary: 'Obtener registro de leche por ID' })
  findOneMilkRecord(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('farmId') farmId: string) {
    return this.productionService.findOneMilkRecord(id, farmId);
  }

  // ─── Weight Records ──────────────────────────────────────────────────────────

  @Post('weights')
  @ApiOperation({ summary: 'Registrar peso de un animal' })
  createWeightRecord(@CurrentUser('farmId') farmId: string, @Body() dto: CreateWeightRecordDto) {
    return this.productionService.createWeightRecord(farmId, dto);
  }

  @Get('weights')
  @ApiOperation({ summary: 'Listar registros de peso' })
  @ApiQuery({ name: 'animalId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllWeightRecords(
    @CurrentUser('farmId') farmId: string,
    @Query('animalId') animalId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productionService.findAllWeightRecords(farmId, animalId, page ? +page : 1, limit ? +limit : 20);
  }

  @Get('weights/gain/:animalId')
  @ApiOperation({ summary: 'Resumen de ganancia de peso de un animal' })
  getWeightGainSummary(@Param('animalId', ParseUUIDPipe) animalId: string, @CurrentUser('farmId') farmId: string) {
    return this.productionService.getWeightGainSummary(farmId, animalId);
  }

  @Get('weights/:id')
  @ApiOperation({ summary: 'Obtener registro de peso por ID' })
  findOneWeightRecord(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('farmId') farmId: string) {
    return this.productionService.findOneWeightRecord(id, farmId);
  }
}
