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
import { CostCategory, IncomeCategory, SaleType } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateIncomeRecordDto } from './dto/create-income-record.dto';
import { CreateOperationalCostDto } from './dto/create-operational-cost.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { FinanceService } from './finance.service';

@ApiTags('Finance')
@ApiBearerAuth()
@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  // ─── Summary ─────────────────────────────────────────────────────────────────

  @Get('summary')
  @ApiOperation({ summary: 'Resumen financiero: ingresos, costos y utilidad neta para un período' })
  @ApiQuery({ name: 'from', required: true, type: String, description: 'ISO date YYYY-MM-DD' })
  @ApiQuery({ name: 'to', required: true, type: String, description: 'ISO date YYYY-MM-DD' })
  getSummary(
    @CurrentUser('farmId') farmId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.financeService.getSummary(farmId, from, to);
  }

  // ─── Sales ──────────────────────────────────────────────────────────────────

  @Post('sales')
  @ApiOperation({ summary: 'Registrar una venta' })
  createSale(@CurrentUser('farmId') farmId: string, @Body() dto: CreateSaleDto) {
    return this.financeService.createSale(farmId, dto);
  }

  @Get('sales')
  @ApiOperation({ summary: 'Listar ventas de la finca' })
  @ApiQuery({ name: 'type', required: false, enum: SaleType })
  @ApiQuery({ name: 'from', required: false, type: String })
  @ApiQuery({ name: 'to', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllSales(
    @CurrentUser('farmId') farmId: string,
    @Query('type') type?: SaleType,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.financeService.findAllSales(farmId, type, from, to, page ? +page : 1, limit ? +limit : 20);
  }

  @Get('sales/:id')
  @ApiOperation({ summary: 'Obtener una venta por ID' })
  findOneSale(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('farmId') farmId: string) {
    return this.financeService.findOneSale(id, farmId);
  }

  @Patch('sales/:id')
  @ApiOperation({ summary: 'Actualizar una venta' })
  updateSale(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('farmId') farmId: string,
    @Body() dto: Partial<CreateSaleDto>,
  ) {
    return this.financeService.updateSale(id, farmId, dto);
  }

  @Delete('sales/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una venta' })
  removeSale(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('farmId') farmId: string) {
    return this.financeService.removeSale(id, farmId);
  }

  // ─── Operational Costs ──────────────────────────────────────────────────────

  @Post('costs')
  @ApiOperation({ summary: 'Registrar un costo operacional' })
  createCost(@CurrentUser('farmId') farmId: string, @Body() dto: CreateOperationalCostDto) {
    return this.financeService.createCost(farmId, dto);
  }

  @Get('costs')
  @ApiOperation({ summary: 'Listar costos operacionales de la finca' })
  @ApiQuery({ name: 'category', required: false, enum: CostCategory })
  @ApiQuery({ name: 'from', required: false, type: String })
  @ApiQuery({ name: 'to', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllCosts(
    @CurrentUser('farmId') farmId: string,
    @Query('category') category?: CostCategory,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.financeService.findAllCosts(farmId, category, from, to, page ? +page : 1, limit ? +limit : 20);
  }

  @Get('costs/:id')
  @ApiOperation({ summary: 'Obtener un costo por ID' })
  findOneCost(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('farmId') farmId: string) {
    return this.financeService.findOneCost(id, farmId);
  }

  @Patch('costs/:id')
  @ApiOperation({ summary: 'Actualizar un costo operacional' })
  updateCost(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('farmId') farmId: string,
    @Body() dto: Partial<CreateOperationalCostDto>,
  ) {
    return this.financeService.updateCost(id, farmId, dto);
  }

  @Delete('costs/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un costo' })
  removeCost(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('farmId') farmId: string) {
    return this.financeService.removeCost(id, farmId);
  }

  // ─── Income Records ─────────────────────────────────────────────────────────

  @Post('incomes')
  @ApiOperation({ summary: 'Registrar un ingreso' })
  createIncome(@CurrentUser('farmId') farmId: string, @Body() dto: CreateIncomeRecordDto) {
    return this.financeService.createIncome(farmId, dto);
  }

  @Get('incomes')
  @ApiOperation({ summary: 'Listar ingresos de la finca' })
  @ApiQuery({ name: 'category', required: false, enum: IncomeCategory })
  @ApiQuery({ name: 'from', required: false, type: String })
  @ApiQuery({ name: 'to', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllIncomes(
    @CurrentUser('farmId') farmId: string,
    @Query('category') category?: IncomeCategory,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.financeService.findAllIncomes(farmId, category, from, to, page ? +page : 1, limit ? +limit : 20);
  }

  @Get('incomes/:id')
  @ApiOperation({ summary: 'Obtener un ingreso por ID' })
  findOneIncome(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('farmId') farmId: string) {
    return this.financeService.findOneIncome(id, farmId);
  }

  @Patch('incomes/:id')
  @ApiOperation({ summary: 'Actualizar un ingreso' })
  updateIncome(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('farmId') farmId: string,
    @Body() dto: Partial<CreateIncomeRecordDto>,
  ) {
    return this.financeService.updateIncome(id, farmId, dto);
  }

  @Delete('incomes/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un ingreso' })
  removeIncome(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('farmId') farmId: string) {
    return this.financeService.removeIncome(id, farmId);
  }
}
