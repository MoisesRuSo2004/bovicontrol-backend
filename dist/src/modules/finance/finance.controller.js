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
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const create_income_record_dto_1 = require("./dto/create-income-record.dto");
const create_operational_cost_dto_1 = require("./dto/create-operational-cost.dto");
const create_sale_dto_1 = require("./dto/create-sale.dto");
const finance_service_1 = require("./finance.service");
let FinanceController = class FinanceController {
    financeService;
    constructor(financeService) {
        this.financeService = financeService;
    }
    getSummary(farmId, from, to) {
        return this.financeService.getSummary(farmId, from, to);
    }
    createSale(farmId, dto) {
        return this.financeService.createSale(farmId, dto);
    }
    findAllSales(farmId, type, from, to, page, limit) {
        return this.financeService.findAllSales(farmId, type, from, to, page ? +page : 1, limit ? +limit : 20);
    }
    findOneSale(id, farmId) {
        return this.financeService.findOneSale(id, farmId);
    }
    updateSale(id, farmId, dto) {
        return this.financeService.updateSale(id, farmId, dto);
    }
    removeSale(id, farmId) {
        return this.financeService.removeSale(id, farmId);
    }
    createCost(farmId, dto) {
        return this.financeService.createCost(farmId, dto);
    }
    findAllCosts(farmId, category, from, to, page, limit) {
        return this.financeService.findAllCosts(farmId, category, from, to, page ? +page : 1, limit ? +limit : 20);
    }
    findOneCost(id, farmId) {
        return this.financeService.findOneCost(id, farmId);
    }
    updateCost(id, farmId, dto) {
        return this.financeService.updateCost(id, farmId, dto);
    }
    removeCost(id, farmId) {
        return this.financeService.removeCost(id, farmId);
    }
    createIncome(farmId, dto) {
        return this.financeService.createIncome(farmId, dto);
    }
    findAllIncomes(farmId, category, from, to, page, limit) {
        return this.financeService.findAllIncomes(farmId, category, from, to, page ? +page : 1, limit ? +limit : 20);
    }
    findOneIncome(id, farmId) {
        return this.financeService.findOneIncome(id, farmId);
    }
    updateIncome(id, farmId, dto) {
        return this.financeService.updateIncome(id, farmId, dto);
    }
    removeIncome(id, farmId) {
        return this.financeService.removeIncome(id, farmId);
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Resumen financiero: ingresos, costos y utilidad neta para un período' }),
    (0, swagger_1.ApiQuery)({ name: 'from', required: true, type: String, description: 'ISO date YYYY-MM-DD' }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: true, type: String, description: 'ISO date YYYY-MM-DD' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Query)('from')),
    __param(2, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Post)('sales'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar una venta' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_sale_dto_1.CreateSaleDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createSale", null);
__decorate([
    (0, common_1.Get)('sales'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar ventas de la finca' }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: client_1.SaleType }),
    (0, swagger_1.ApiQuery)({ name: 'from', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('from')),
    __param(3, (0, common_1.Query)('to')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findAllSales", null);
__decorate([
    (0, common_1.Get)('sales/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una venta por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findOneSale", null);
__decorate([
    (0, common_1.Patch)('sales/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una venta' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateSale", null);
__decorate([
    (0, common_1.Delete)('sales/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una venta' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "removeSale", null);
__decorate([
    (0, common_1.Post)('costs'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar un costo operacional' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_operational_cost_dto_1.CreateOperationalCostDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createCost", null);
__decorate([
    (0, common_1.Get)('costs'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar costos operacionales de la finca' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, enum: client_1.CostCategory }),
    (0, swagger_1.ApiQuery)({ name: 'from', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('from')),
    __param(3, (0, common_1.Query)('to')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findAllCosts", null);
__decorate([
    (0, common_1.Get)('costs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un costo por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findOneCost", null);
__decorate([
    (0, common_1.Patch)('costs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un costo operacional' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateCost", null);
__decorate([
    (0, common_1.Delete)('costs/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un costo' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "removeCost", null);
__decorate([
    (0, common_1.Post)('incomes'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar un ingreso' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_income_record_dto_1.CreateIncomeRecordDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createIncome", null);
__decorate([
    (0, common_1.Get)('incomes'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar ingresos de la finca' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, enum: client_1.IncomeCategory }),
    (0, swagger_1.ApiQuery)({ name: 'from', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'to', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('from')),
    __param(3, (0, common_1.Query)('to')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findAllIncomes", null);
__decorate([
    (0, common_1.Get)('incomes/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un ingreso por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "findOneIncome", null);
__decorate([
    (0, common_1.Patch)('incomes/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un ingreso' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "updateIncome", null);
__decorate([
    (0, common_1.Delete)('incomes/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un ingreso' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "removeIncome", null);
exports.FinanceController = FinanceController = __decorate([
    (0, swagger_1.ApiTags)('Finance'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('finance'),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map