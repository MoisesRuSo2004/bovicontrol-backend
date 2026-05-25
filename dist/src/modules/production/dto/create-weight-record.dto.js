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
exports.CreateWeightRecordDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateWeightRecordDto {
    animalId;
    recordDate;
    weightKg;
    method;
    recordedById;
    notes;
}
exports.CreateWeightRecordDto = CreateWeightRecordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del animal pesado' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateWeightRecordDto.prototype, "animalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-06-10', description: 'Fecha del pesaje' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateWeightRecordDto.prototype, "recordDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 380.0, description: 'Peso en kg' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateWeightRecordDto.prototype, "weightKg", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Báscula digital marca Gallagher', description: 'Método o instrumento de pesaje' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateWeightRecordDto.prototype, "method", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del operario que realizó el pesaje' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateWeightRecordDto.prototype, "recordedById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateWeightRecordDto.prototype, "notes", void 0);
//# sourceMappingURL=create-weight-record.dto.js.map