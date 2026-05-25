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
exports.CreatePregnancyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CreatePregnancyDto {
    femaleId;
    maleId;
    conceptionDate;
    expectedBirthDate;
    status;
    gestationDays;
    offspringCount;
    notes;
}
exports.CreatePregnancyDto = CreatePregnancyDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la hembra gestante' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePregnancyDto.prototype, "femaleId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del macho (padre)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePregnancyDto.prototype, "maleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-06-15', description: 'Fecha de concepción confirmada' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePregnancyDto.prototype, "conceptionDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-03-25', description: 'Fecha esperada de parto' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePregnancyDto.prototype, "expectedBirthDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.PregnancyStatus, default: client_1.PregnancyStatus.IN_PROGRESS }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.PregnancyStatus),
    __metadata("design:type", String)
], CreatePregnancyDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 283, description: 'Días de gestación' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePregnancyDto.prototype, "gestationDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: 'Número de crías esperadas' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreatePregnancyDto.prototype, "offspringCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Preñez confirmada por ultrasonido a los 45 días' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreatePregnancyDto.prototype, "notes", void 0);
//# sourceMappingURL=create-pregnancy.dto.js.map