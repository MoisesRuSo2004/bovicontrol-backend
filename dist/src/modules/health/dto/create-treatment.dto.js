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
exports.CreateTreatmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CreateTreatmentDto {
    animalId;
    diagnosis;
    medicationId;
    appliedById;
    startDate;
    endDate;
    dosage;
    dosageUnit;
    frequency;
    status;
    notes;
}
exports.CreateTreatmentDto = CreateTreatmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del animal en tratamiento' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTreatmentDto.prototype, "animalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mastitis aguda', description: 'Diagnóstico del tratamiento' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateTreatmentDto.prototype, "diagnosis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del medicamento utilizado' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTreatmentDto.prototype, "medicationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del usuario que aplicó el tratamiento' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTreatmentDto.prototype, "appliedById", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-06-10', description: 'Fecha de inicio del tratamiento' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTreatmentDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024-06-17', description: 'Fecha de fin planificada' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTreatmentDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 20.0, description: 'Dosis aplicada' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateTreatmentDto.prototype, "dosage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'ml', description: 'Unidad de dosificación' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateTreatmentDto.prototype, "dosageUnit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Cada 24 horas por 5 días', description: 'Frecuencia de aplicación' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateTreatmentDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.TreatmentStatus, default: client_1.TreatmentStatus.ACTIVE }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TreatmentStatus),
    __metadata("design:type", String)
], CreateTreatmentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Buena respuesta al tratamiento' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateTreatmentDto.prototype, "notes", void 0);
//# sourceMappingURL=create-treatment.dto.js.map