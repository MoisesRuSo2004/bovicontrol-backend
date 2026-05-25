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
exports.ReproductionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const create_pregnancy_dto_1 = require("./dto/create-pregnancy.dto");
const create_reproductive_event_dto_1 = require("./dto/create-reproductive-event.dto");
const update_pregnancy_dto_1 = require("./dto/update-pregnancy.dto");
const reproduction_service_1 = require("./reproduction.service");
let ReproductionController = class ReproductionController {
    reproductionService;
    constructor(reproductionService) {
        this.reproductionService = reproductionService;
    }
    createEvent(farmId, dto) {
        return this.reproductionService.createEvent(farmId, dto);
    }
    findAllEvents(farmId, animalId, page, limit) {
        return this.reproductionService.findAllEvents(farmId, animalId, page ? +page : 1, limit ? +limit : 20);
    }
    findOneEvent(id, farmId) {
        return this.reproductionService.findOneEvent(id, farmId);
    }
    removeEvent(id, farmId) {
        return this.reproductionService.removeEvent(id, farmId);
    }
    updateEvent(id, farmId, dto) {
        return this.reproductionService.updateEvent(id, farmId, dto);
    }
    createPregnancy(farmId, dto) {
        return this.reproductionService.createPregnancy(farmId, dto);
    }
    findAllPregnancies(farmId, animalId, status, page, limit) {
        return this.reproductionService.findAllPregnancies(farmId, animalId, status, page ? +page : 1, limit ? +limit : 20);
    }
    getUpcomingBirths(farmId, daysAhead) {
        return this.reproductionService.getUpcomingBirths(farmId, daysAhead ? +daysAhead : 30);
    }
    findOnePregnancy(id, farmId) {
        return this.reproductionService.findOnePregnancy(id, farmId);
    }
    updatePregnancy(id, farmId, dto) {
        return this.reproductionService.updatePregnancy(id, farmId, dto);
    }
    deletePregnancy(id, farmId) {
        return this.reproductionService.deletePregnancy(id, farmId);
    }
};
exports.ReproductionController = ReproductionController;
__decorate([
    (0, common_1.Post)('events'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar un evento reproductivo' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_reproductive_event_dto_1.CreateReproductiveEventDto]),
    __metadata("design:returntype", void 0)
], ReproductionController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Get)('events'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar eventos reproductivos de la finca' }),
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
], ReproductionController.prototype, "findAllEvents", null);
__decorate([
    (0, common_1.Get)('events/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un evento reproductivo por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReproductionController.prototype, "findOneEvent", null);
__decorate([
    (0, common_1.Delete)('events/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un evento reproductivo' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReproductionController.prototype, "removeEvent", null);
__decorate([
    (0, common_1.Patch)('events/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un evento reproductivo' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ReproductionController.prototype, "updateEvent", null);
__decorate([
    (0, common_1.Post)('pregnancies'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar una preñez' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_pregnancy_dto_1.CreatePregnancyDto]),
    __metadata("design:returntype", void 0)
], ReproductionController.prototype, "createPregnancy", null);
__decorate([
    (0, common_1.Get)('pregnancies'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar preñeces de la finca' }),
    (0, swagger_1.ApiQuery)({ name: 'animalId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.PregnancyStatus }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Query)('animalId')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], ReproductionController.prototype, "findAllPregnancies", null);
__decorate([
    (0, common_1.Get)('pregnancies/upcoming-births'),
    (0, swagger_1.ApiOperation)({ summary: 'Partos esperados en los próximos N días' }),
    (0, swagger_1.ApiQuery)({ name: 'daysAhead', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Query)('daysAhead')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReproductionController.prototype, "getUpcomingBirths", null);
__decorate([
    (0, common_1.Get)('pregnancies/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener detalle de una preñez' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReproductionController.prototype, "findOnePregnancy", null);
__decorate([
    (0, common_1.Patch)('pregnancies/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar estado de una preñez' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_pregnancy_dto_1.UpdatePregnancyDto]),
    __metadata("design:returntype", void 0)
], ReproductionController.prototype, "updatePregnancy", null);
__decorate([
    (0, common_1.Delete)('pregnancies/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una preñez' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ReproductionController.prototype, "deletePregnancy", null);
exports.ReproductionController = ReproductionController = __decorate([
    (0, swagger_1.ApiTags)('Reproduction'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('reproduction'),
    __metadata("design:paramtypes", [reproduction_service_1.ReproductionService])
], ReproductionController);
//# sourceMappingURL=reproduction.controller.js.map