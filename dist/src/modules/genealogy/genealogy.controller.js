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
exports.GenealogyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const genealogy_service_1 = require("./genealogy.service");
let GenealogyController = class GenealogyController {
    genealogyService;
    constructor(genealogyService) {
        this.genealogyService = genealogyService;
    }
    getAnimalTree(animalId, farmId) {
        return this.genealogyService.getAnimalTree(animalId, farmId);
    }
    getAncestors(animalId, farmId, generations) {
        return this.genealogyService.getAncestors(animalId, farmId, generations ? parseInt(generations, 10) : 3);
    }
    getDescendants(animalId, farmId, generations) {
        return this.genealogyService.getDescendants(animalId, farmId, generations ? parseInt(generations, 10) : 3);
    }
    analyzeInbreeding(animalId, farmId) {
        return this.genealogyService.analyzeInbreeding(animalId, farmId);
    }
    getInbreedingHistory(animalId, farmId) {
        return this.genealogyService.getInbreedingHistory(animalId, farmId);
    }
};
exports.GenealogyController = GenealogyController;
__decorate([
    (0, common_1.Get)(':animalId/tree'),
    (0, swagger_1.ApiOperation)({ summary: 'Árbol genealógico del animal (hasta 3 generaciones)' }),
    __param(0, (0, common_1.Param)('animalId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GenealogyController.prototype, "getAnimalTree", null);
__decorate([
    (0, common_1.Get)(':animalId/ancestors'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar ancestros del animal' }),
    (0, swagger_1.ApiQuery)({ name: 'generations', required: false, type: Number, description: 'Número de generaciones (1-5, default 3)' }),
    __param(0, (0, common_1.Param)('animalId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(2, (0, common_1.Query)('generations')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], GenealogyController.prototype, "getAncestors", null);
__decorate([
    (0, common_1.Get)(':animalId/descendants'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar descendientes del animal' }),
    (0, swagger_1.ApiQuery)({ name: 'generations', required: false, type: Number, description: 'Número de generaciones (1-5, default 3)' }),
    __param(0, (0, common_1.Param)('animalId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(2, (0, common_1.Query)('generations')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], GenealogyController.prototype, "getDescendants", null);
__decorate([
    (0, common_1.Get)(':animalId/inbreeding'),
    (0, swagger_1.ApiOperation)({ summary: 'Calcular coeficiente de consanguinidad del animal' }),
    __param(0, (0, common_1.Param)('animalId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GenealogyController.prototype, "analyzeInbreeding", null);
__decorate([
    (0, common_1.Get)(':animalId/inbreeding/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Historial de análisis de consanguinidad' }),
    __param(0, (0, common_1.Param)('animalId', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GenealogyController.prototype, "getInbreedingHistory", null);
exports.GenealogyController = GenealogyController = __decorate([
    (0, swagger_1.ApiTags)('Genealogy'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('genealogy'),
    __metadata("design:paramtypes", [genealogy_service_1.GenealogyService])
], GenealogyController);
//# sourceMappingURL=genealogy.controller.js.map