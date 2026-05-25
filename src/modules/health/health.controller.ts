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
import { TreatmentStatus, UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { CreateHealthAlertDto } from './dto/create-health-alert.dto';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { CreateVaccineDto } from './dto/create-vaccine.dto';
import { HealthService } from './health.service';

@ApiTags('Health')
@ApiBearerAuth()
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  // ─── Vaccines ───────────────────────────────────────────────────────────────

  @Post('vaccines')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VETERINARIAN)
  @ApiOperation({ summary: 'Crear una vacuna en el catálogo' })
  createVaccine(@Body() dto: CreateVaccineDto) {
    return this.healthService.createVaccine(dto);
  }

  @Get('vaccines')
  @ApiOperation({ summary: 'Listar catálogo de vacunas' })
  findAllVaccines() {
    return this.healthService.findAllVaccines();
  }

  @Get('vaccines/:id')
  @ApiOperation({ summary: 'Obtener una vacuna por ID' })
  findOneVaccine(@Param('id', ParseUUIDPipe) id: string) {
    return this.healthService.findOneVaccine(id);
  }

  // ─── Medications ────────────────────────────────────────────────────────────

  @Post('medications')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VETERINARIAN)
  @ApiOperation({ summary: 'Crear un medicamento en el catálogo' })
  createMedication(@Body() dto: CreateMedicationDto) {
    return this.healthService.createMedication(dto);
  }

  @Get('medications')
  @ApiOperation({ summary: 'Listar catálogo de medicamentos' })
  findAllMedications() {
    return this.healthService.findAllMedications();
  }

  @Get('medications/:id')
  @ApiOperation({ summary: 'Obtener un medicamento por ID' })
  findOneMedication(@Param('id', ParseUUIDPipe) id: string) {
    return this.healthService.findOneMedication(id);
  }

  // ─── Vaccinations ────────────────────────────────────────────────────────────

  @Post('vaccinations')
  @ApiOperation({ summary: 'Registrar una vacunación' })
  createVaccination(@CurrentUser('farmId') farmId: string, @Body() dto: CreateVaccinationDto) {
    return this.healthService.createVaccination(farmId, dto);
  }

  @Get('vaccinations')
  @ApiOperation({ summary: 'Listar vacunaciones de la finca' })
  @ApiQuery({ name: 'animalId', required: false, type: String })
  @ApiQuery({ name: 'from', required: false, type: String })
  @ApiQuery({ name: 'to', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllVaccinations(
    @CurrentUser('farmId') farmId: string,
    @Query('animalId') animalId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.healthService.findAllVaccinations(farmId, animalId, from, to, page ? +page : 1, limit ? +limit : 20);
  }

  @Get('vaccinations/upcoming')
  @ApiOperation({ summary: 'Vacunaciones próximas o vencidas (nextDueDate)' })
  @ApiQuery({ name: 'daysAhead', required: false, type: Number })
  getUpcomingVaccinations(
    @CurrentUser('farmId') farmId: string,
    @Query('daysAhead') daysAhead?: string,
  ) {
    return this.healthService.getUpcomingVaccinations(farmId, daysAhead ? +daysAhead : 30);
  }

  @Get('vaccinations/:id')
  @ApiOperation({ summary: 'Obtener una vacunación por ID' })
  findOneVaccination(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('farmId') farmId: string) {
    return this.healthService.findOneVaccination(id, farmId);
  }

  @Patch('vaccinations/:id')
  @ApiOperation({ summary: 'Actualizar una vacunación' })
  updateVaccination(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('farmId') farmId: string,
    @Body() dto: Partial<CreateVaccinationDto>,
  ) {
    return this.healthService.updateVaccination(id, farmId, dto);
  }

  @Delete('vaccinations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una vacunación' })
  deleteVaccination(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('farmId') farmId: string) {
    return this.healthService.deleteVaccination(id, farmId);
  }

  // ─── Treatments ─────────────────────────────────────────────────────────────

  @Post('treatments')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VETERINARIAN)
  @ApiOperation({ summary: 'Registrar un tratamiento' })
  createTreatment(@CurrentUser('farmId') farmId: string, @Body() dto: CreateTreatmentDto) {
    return this.healthService.createTreatment(farmId, dto);
  }

  @Get('treatments')
  @ApiOperation({ summary: 'Listar tratamientos de la finca' })
  @ApiQuery({ name: 'animalId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: TreatmentStatus })
  @ApiQuery({ name: 'from', required: false, type: String })
  @ApiQuery({ name: 'to', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllTreatments(
    @CurrentUser('farmId') farmId: string,
    @Query('animalId') animalId?: string,
    @Query('status') status?: TreatmentStatus,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.healthService.findAllTreatments(farmId, animalId, status, from, to, page ? +page : 1, limit ? +limit : 20);
  }

  @Get('treatments/:id')
  @ApiOperation({ summary: 'Obtener un tratamiento por ID' })
  findOneTreatment(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('farmId') farmId: string) {
    return this.healthService.findOneTreatment(id, farmId);
  }

  @Patch('treatments/:id')
  @ApiOperation({ summary: 'Actualizar un tratamiento' })
  updateTreatment(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('farmId') farmId: string,
    @Body() dto: Partial<CreateTreatmentDto>,
  ) {
    return this.healthService.updateTreatment(id, farmId, dto);
  }

  // ─── Diseases ────────────────────────────────────────────────────────────────

  @Post('diseases')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VETERINARIAN)
  @ApiOperation({ summary: 'Registrar un diagnóstico/enfermedad' })
  createDisease(@CurrentUser('farmId') farmId: string, @Body() dto: CreateDiseaseDto) {
    return this.healthService.createDisease(farmId, dto);
  }

  @Get('diseases')
  @ApiOperation({ summary: 'Listar enfermedades/diagnósticos de la finca' })
  @ApiQuery({ name: 'animalId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllDiseases(
    @CurrentUser('farmId') farmId: string,
    @Query('animalId') animalId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.healthService.findAllDiseases(farmId, animalId, page ? +page : 1, limit ? +limit : 20);
  }

  @Get('diseases/:id')
  @ApiOperation({ summary: 'Obtener un diagnóstico por ID' })
  findOneDisease(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('farmId') farmId: string) {
    return this.healthService.findOneDisease(id, farmId);
  }

  @Patch('diseases/:id')
  @ApiOperation({ summary: 'Actualizar un diagnóstico' })
  updateDisease(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('farmId') farmId: string,
    @Body() dto: Partial<CreateDiseaseDto>,
  ) {
    return this.healthService.updateDisease(id, farmId, dto);
  }

  // ─── Health Alerts ────────────────────────────────────────────────────────────

  @Post('alerts')
  @ApiOperation({ summary: 'Crear una alerta de salud manual' })
  createAlert(@CurrentUser('farmId') farmId: string, @Body() dto: CreateHealthAlertDto) {
    return this.healthService.createAlert(farmId, dto);
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Listar alertas de salud de la finca' })
  @ApiQuery({ name: 'isResolved', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllAlerts(
    @CurrentUser('farmId') farmId: string,
    @Query('isResolved') isResolved?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const resolved = isResolved !== undefined ? isResolved === 'true' : undefined;
    return this.healthService.findAllAlerts(farmId, resolved, page ? +page : 1, limit ? +limit : 20);
  }

  @Get('alerts/upcoming')
  @ApiOperation({ summary: 'Alertas próximas en los siguientes N días' })
  @ApiQuery({ name: 'daysAhead', required: false, type: Number })
  getUpcomingAlerts(
    @CurrentUser('farmId') farmId: string,
    @Query('daysAhead') daysAhead?: string,
  ) {
    return this.healthService.getUpcomingAlerts(farmId, daysAhead ? +daysAhead : 7);
  }

  @Patch('alerts/:id/resolve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marcar una alerta como resuelta' })
  resolveAlert(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('farmId') farmId: string) {
    return this.healthService.resolveAlert(id, farmId);
  }
}
