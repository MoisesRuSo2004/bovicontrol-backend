"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const create_disease_dto_1 = require("./dto/create-disease.dto");
const create_health_alert_dto_1 = require("./dto/create-health-alert.dto");
const create_medication_dto_1 = require("./dto/create-medication.dto");
const create_treatment_dto_1 = require("./dto/create-treatment.dto");
const create_vaccination_dto_1 = require("./dto/create-vaccination.dto");
const create_vaccine_dto_1 = require("./dto/create-vaccine.dto");
const health_service_1 = require("./health.service");
let HealthController = class HealthController {
    healthService;
    constructor(healthService) {
        this.healthService = healthService;
    }
    createVaccine(dto) {
        return this.healthService.createVaccine(dto);
    }
    findAllVaccines() {
        return this.healthService.findAllVaccines();
    }
    findOneVaccine(id) {
        return this.healthService.findOneVaccine(id);
    }
    createMedication(dto) {
        return this.healthService.createMedication(dto);
    }
    findAllMedications() {
        return this.healthService.findAllMedications();
    }
    findOneMedication(id) {
        return this.healthService.findOneMedication(id);
    }
    createVaccination(farmId, dto) {
        return this.healthService.createVaccination(farmId, dto);
    }
    findAllVaccinations(farmId, animalId, from, to, page, limit) {
        return this.healthService.findAllVaccinations(farmId, animalId, from, to, page ? +page : 1, limit ? +limit : 20);
    }
    getUpcomingVaccinations(farmId, daysAhead) {
        return this.healthService.getUpcomingVaccinations(farmId, daysAhead ? +daysAhead : 30);
    }
    findOneVaccination(id, farmId) {
        return this.healthService.findOneVaccination(id, farmId);
    }
    updateVaccination(id, farmId, dto) {
        return this.healthService.updateVaccination(id, farmId, dto);
    }
    deleteVaccination(id, farmId) {
        return this.healthService.deleteVaccination(id, farmId);
    }
    createTreatment(farmId, dto) {
        return this.healthService.createTreatment(farmId, dto);
    }
    findAllTreatments(farmId, animalId, status, from, to, page, limit) {
        return this.healthService.findAllTreatments(farmId, animalId, status, from, to, page ? +page : 1, limit ? +limit : 20);
    }
    findOneTreatment(id, farmId) {
        return this.healthService.findOneTreatment(id, farmId);
    }
    updateTreatment(id, farmId, dto) {
        return this.healthService.updateTreatment(id, farmId, dto);
    }
    createDisease(farmId, dto) {
        return this.healthService.createDisease(farmId, dto);
    }
    findAllDiseases(farmId, animalId, page, limit) {
        return this.healthService.findAllDiseases(farmId, animalId, page ? +page : 1, limit ? +limit : 20);
    }
    findOneDisease(id, farmId) {
        return this.healthService.findOneDisease(id, farmId);
    }
    updateDisease(id, farmId, dto) {
        return this.healthService.updateDisease(id, farmId, dto);
    }
    createAlert(farmId, dto) {
        return this.healthService.createAlert(farmId, dto);
    }
    findAllAlerts(farmId, isResolved, page, limit) {
        const resolved = isResolved !== undefined ? isResolved === 'true' : undefined;
        return this.healthService.findAllAlerts(farmId, resolved, page ? +page : 1, limit ? +limit : 20);
    }
    getUpcomingAlerts(farmId, daysAhead) {
        return this.healthService.getUpcomingAlerts(farmId, daysAhead ? +daysAhead : 7);
    }
    resolveAlert(id, farmId) {
        return this.healthService.resolveAlert(id, farmId);
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Post)('vaccines'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.VETERINARIAN),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una vacuna en el catálogo' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vaccine_dto_1.CreateVaccineDto]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "createVaccine", null);
__decorate([
    (0, common_1.Get)('vaccines'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar catálogo de vacunas' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "findAllVaccines", null);
__decorate([
    (0, common_1.Get)('vaccines/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una vacuna por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "findOneVaccine", null);
__decorate([
    (0, common_1.Post)('medications'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.VETERINARIAN),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un medicamento en el catálogo' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_medication_dto_1.CreateMedicationDto]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "createMedication", null);
__decorate([
    (0, common_1.Get)('medications'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar catálogo de medicamentos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "findAllMedications", null);
__decorate([
    (0, common_1.Get)('medications/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un medicamento por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "findOneMedication", null);
__decorate([
    (0, common_1.Post)('vaccinations'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar una vacunación' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_vaccination_dto_1.CreateVaccinationDto]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "createVaccination", null);
__decorate([
    (0, common_1.Get)('vaccinations'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar vacunaciones de la finca' }),
    (0, swagger_1.ApiQuery)({ name: 'animalId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'from', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Query)('animalId')),
    __param(2, (0, common_1.Query)('from')),
    __param(3, (0, common_1.Query)('to')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "findAllVaccinations", null);
__decorate([
    (0, common_1.Get)('vaccinations/upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Vacunaciones próximas o vencidas (nextDueDate)' }),
    (0, swagger_1.ApiQuery)({ name: 'daysAhead', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Query)('daysAhead')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "getUpcomingVaccinations", null);
__decorate([
    (0, common_1.Get)('vaccinations/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una vacunación por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "findOneVaccination", null);
__decorate([
    (0, common_1.Patch)('vaccinations/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una vacunación' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "updateVaccination", null);
__decorate([
    (0, common_1.Delete)('vaccinations/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una vacunación' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "deleteVaccination", null);
__decorate([
    (0, common_1.Post)('treatments'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.VETERINARIAN),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar un tratamiento' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_treatment_dto_1.CreateTreatmentDto]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "createTreatment", null);
__decorate([
    (0, common_1.Get)('treatments'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar tratamientos de la finca' }),
    (0, swagger_1.ApiQuery)({ name: 'animalId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.TreatmentStatus }),
    (0, swagger_1.ApiQuery)({ name: 'from', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Query)('animalId')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('from')),
    __param(4, (0, common_1.Query)('to')),
    __param(5, (0, common_1.Query)('page')),
    __param(6, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "findAllTreatments", null);
__decorate([
    (0, common_1.Get)('treatments/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un tratamiento por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "findOneTreatment", null);
__decorate([
    (0, common_1.Patch)('treatments/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un tratamiento' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "updateTreatment", null);
__decorate([
    (0, common_1.Post)('diseases'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.VETERINARIAN),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar un diagnóstico/enfermedad' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_disease_dto_1.CreateDiseaseDto]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "createDisease", null);
__decorate([
    (0, common_1.Get)('diseases'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar enfermedades/diagnósticos de la finca' }),
    (0, swagger_1.ApiQuery)({ name: 'animalId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Query)('animalId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "findAllDiseases", null);
__decorate([
    (0, common_1.Get)('diseases/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un diagnóstico por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "findOneDisease", null);
__decorate([
    (0, common_1.Patch)('diseases/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un diagnóstico' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "updateDisease", null);
__decorate([
    (0, common_1.Post)('alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una alerta de salud manual' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_health_alert_dto_1.CreateHealthAlertDto]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "createAlert", null);
__decorate([
    (0, common_1.Get)('alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar alertas de salud de la finca' }),
    (0, swagger_1.ApiQuery)({ name: 'isResolved', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Query)('isResolved')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "findAllAlerts", null);
__decorate([
    (0, common_1.Get)('alerts/upcoming'),
    (0, swagger_1.ApiOperation)({ summary: 'Alertas próximas en los siguientes N días' }),
    (0, swagger_1.ApiQuery)({ name: 'daysAhead', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Query)('daysAhead')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "getUpcomingAlerts", null);
__decorate([
    (0, common_1.Patch)('alerts/:id/resolve'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar una alerta como resuelta' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "resolveAlert", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [health_service_1.HealthService])
], HealthController);
//# sourceMappingURL=health.controller.js.map