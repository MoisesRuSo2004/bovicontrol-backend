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
exports.CreateDiseaseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateDiseaseDto {
    animalId;
    name;
    description;
    diagnosisDate;
    status;
    resolvedDate;
    diagnosedById;
    symptoms;
    notes;
}
exports.CreateDiseaseDto = CreateDiseaseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del animal afectado' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDiseaseDto.prototype, "animalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mastitis clínica', description: 'Nombre o diagnóstico de la enfermedad' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateDiseaseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Mastitis en cuarto posterior derecho', description: 'Descripción detallada' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateDiseaseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-06-08', description: 'Fecha de diagnóstico' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDiseaseDto.prototype, "diagnosisDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.DiseaseStatus, default: client_1.DiseaseStatus.ACTIVE }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.DiseaseStatus),
    __metadata("design:type", String)
], CreateDiseaseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024-06-20', description: 'Fecha de resolución o cierre' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDiseaseDto.prototype, "resolvedDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del veterinario que realizó el diagnóstico' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateDiseaseDto.prototype, "diagnosedById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Signos: cuarto caliente, secreción anormal, fiebre 39.8°C' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateDiseaseDto.prototype, "symptoms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Recuperación completa esperada en 10 días' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateDiseaseDto.prototype, "notes", void 0);
//# sourceMappingURL=create-disease.dto.js.map