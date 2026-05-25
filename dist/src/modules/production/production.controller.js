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
exports.ProductionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const create_milk_record_dto_1 = require("./dto/create-milk-record.dto");
const create_milk_sale_dto_1 = require("./dto/create-milk-sale.dto");
const create_weight_record_dto_1 = require("./dto/create-weight-record.dto");
const upsert_dairy_config_dto_1 = require("./dto/upsert-dairy-config.dto");
const production_service_1 = require("./production.service");
let ProductionController = class ProductionController {
    productionService;
    constructor(productionService) {
        this.productionService = productionService;
    }
    getDairyConfig(farmId) {
        return this.productionService.getDairyConfig(farmId);
    }
    upsertDairyConfig(farmId, dto) {
        return this.productionService.upsertDairyConfig(farmId, dto);
    }
    getMilkSalesSummary(farmId) {
        return this.productionService.getMilkSalesSummary(farmId);
    }
    getPastPeriods(farmId, count) {
        return this.productionService.getPastPeriods(farmId, count ? +count : 6);
    }
    findAllMilkSales(farmId, from, to, page, limit) {
        return this.productionService.findAllMilkSales(farmId, from, to, page ? +page : 1, limit ? +limit : 30);
    }
    createMilkSale(farmId, dto) {
        return this.productionService.createMilkSale(farmId, dto);
    }
    updateMilkSale(id, farmId, dto) {
        return this.productionService.updateMilkSale(id, farmId, dto);
    }
    deleteMilkSale(id, farmId) {
        return this.productionService.deleteMilkSale(id, farmId);
    }
    createMilkRecord(farmId, dto) {
        return this.productionService.createMilkRecord(farmId, dto);
    }
    findAllMilkRecords(farmId, animalId, from, to, page, limit) {
        return this.productionService.findAllMilkRecords(farmId, animalId, from, to, page ? +page : 1, limit ? +limit : 20);
    }
    getMilkSummary(farmId, from, to) {
        return this.productionService.getMilkSummary(farmId, from, to);
    }
    findOneMilkRecord(id, farmId) {
        return this.productionService.findOneMilkRecord(id, farmId);
    }
    createWeightRecord(farmId, dto) {
        return this.productionService.createWeightRecord(farmId, dto);
    }
    findAllWeightRecords(farmId, animalId, page, limit) {
        return this.productionService.findAllWeightRecords(farmId, animalId, page ? +page : 1, limit ? +limit : 20);
    }
    getWeightGainSummary(animalId, farmId) {
        return this.productionService.getWeightGainSummary(farmId, animalId);
    }
    findOneWeightRecord(id, farmId) {
        return this.productionService.findOneWeightRecord(id, farmId);
    }
};
exports.ProductionController = ProductionController;
__decorate([
    (0, common_1.Get)('dairy-config'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener configuración de la lechera' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionController.prototype, "getDairyConfig", null);
__decorate([
    (0, common_1.Put)('dairy-config'),
    (0, swagger_1.ApiOperation)({ summary: 'Guardar/actualizar configuración de la lechera' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, upsert_dairy_config_dto_1.UpsertDairyConfigDto]),
    __metadata("design:returntype", void 0)
], ProductionController.prototype, "upsertDairyConfig", null);
__decorate([
    (0, common_1.Get)('milk-sales/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Resumen del período actual + gráfica' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductionController.prototype, "getMilkSalesSummary", null);
__decorate([
    (0, common_1.Get)('milk-sales/periods'),
    (0, swagger_1.ApiOperation)({ summary: 'Historial de períodos completados con detalle para PDF' }),
    (0, swagger_1.ApiQuery)({ name: 'count', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Query)('count')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductionController.prototype, "getPastPeriods", null);
__decorate([
    (0, common_1.Get)('milk-sales'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar ventas de leche' }),
    (0, swagger_1.ApiQuery)({ name: 'from', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ProductionController.prototype, "findAllMilkSales", null);
__decorate([
    (0, common_1.Post)('milk-sales'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar venta de leche' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_milk_sale_dto_1.CreateMilkSaleDto]),
    __metadata("design:returntype", void 0)
], ProductionController.prototype, "createMilkSale", null);
__decorate([
    (0, common_1.Patch)('milk-sales/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar registro de leche' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ProductionController.prototype, "updateMilkSale", null);
__decorate([
    (0, common_1.Delete)('milk-sales/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar registro de leche' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductionController.prototype, "deleteMilkSale", null);
__decorate([
    (0, common_1.Post)('milk'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar producción de leche por animal' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_milk_record_dto_1.CreateMilkRecordDto]),
    __metadata("design:returntype", void 0)
], ProductionController.prototype, "createMilkRecord", null);
__decorate([
    (0, common_1.Get)('milk'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar registros de leche por animal' }),
    (0, swagger_1.ApiQuery)({ name: 'animalId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'from', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: false }),
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
], ProductionController.prototype, "findAllMilkRecords", null);
__decorate([
    (0, common_1.Get)('milk/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Resumen de producción de leche en rango de fechas' }),
    (0, swagger_1.ApiQuery)({ name: 'from', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: true }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ProductionController.prototype, "getMilkSummary", null);
__decorate([
    (0, common_1.Get)('milk/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener registro de leche por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductionController.prototype, "findOneMilkRecord", null);
__decorate([
    (0, common_1.Post)('weights'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar peso de un animal' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_weight_record_dto_1.CreateWeightRecordDto]),
    __metadata("design:returntype", void 0)
], ProductionController.prototype, "createWeightRecord", null);
__decorate([
    (0, common_1.Get)('weights'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar registros de peso' }),
    (0, swagger_1.ApiQuery)({ name: 'animalId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Query)('animalId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], ProductionController.prototype, "findAllWeightRecords", null);
__decorate([
    (0, common_1.Get)('weights/gain/:animalId'),
    (0, swagger_1.ApiOperation)({ summary: 'Resumen de ganancia de peso de un animal' }),
    __param(0, (0, common_1.Param)('animalId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductionController.prototype, "getWeightGainSummary", null);
__decorate([
    (0, common_1.Get)('weights/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener registro de peso por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ProductionController.prototype, "findOneWeightRecord", null);
exports.ProductionController = ProductionController = __decorate([
    (0, swagger_1.ApiTags)('Production'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('production'),
    __metadata("design:paramtypes", [production_service_1.ProductionService])
], ProductionController);
//# sourceMappingURL=production.controller.js.map