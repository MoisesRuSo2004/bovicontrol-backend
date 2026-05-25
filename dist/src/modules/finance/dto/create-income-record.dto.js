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
exports.CreateIncomeRecordDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CreateIncomeRecordDto {
    category;
    description;
    incomeDate;
    amount;
    saleId;
    reference;
    registeredById;
    notes;
}
exports.CreateIncomeRecordDto = CreateIncomeRecordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.IncomeCategory, description: 'Categoría del ingreso' }),
    (0, class_validator_1.IsEnum)(client_1.IncomeCategory),
    __metadata("design:type", String)
], CreateIncomeRecordDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Venta de leche semana 23', description: 'Descripción del ingreso' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateIncomeRecordDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-06-10', description: 'Fecha del ingreso' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateIncomeRecordDto.prototype, "incomeDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1800000, description: 'Monto en COP' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateIncomeRecordDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID de la venta asociada' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateIncomeRecordDto.prototype, "saleId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Recibo #789' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateIncomeRecordDto.prototype, "reference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del usuario que registró el ingreso' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateIncomeRecordDto.prototype, "registeredById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateIncomeRecordDto.prototype, "notes", void 0);
//# sourceMappingURL=create-income-record.dto.js.map