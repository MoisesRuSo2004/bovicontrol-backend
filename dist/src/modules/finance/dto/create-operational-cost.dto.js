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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOperationalCostDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CreateOperationalCostDto {
    category;
    description;
    costDate;
    amount;
    supplier;
    reference;
    registeredById;
    notes;
}
exports.CreateOperationalCostDto = CreateOperationalCostDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.CostCategory, description: 'Categoría del costo' }),
    (0, class_validator_1.IsEnum)(client_1.CostCategory),
    __metadata("design:type", String)
], CreateOperationalCostDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Compra de concentrado 40kg', description: 'Descripción del costo' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateOperationalCostDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-06-10', description: 'Fecha del gasto' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateOperationalCostDto.prototype, "costDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 450000, description: 'Monto en COP' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateOperationalCostDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Distribuidora Agropecuaria SA', description: 'Proveedor' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateOperationalCostDto.prototype, "supplier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Factura #456', description: 'Referencia de la factura' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateOperationalCostDto.prototype, "reference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del usuario que registró el costo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateOperationalCostDto.prototype, "registeredById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateOperationalCostDto.prototype, "notes", void 0);
//# sourceMappingURL=create-operational-cost.dto.js.map