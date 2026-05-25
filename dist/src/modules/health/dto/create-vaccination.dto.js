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
exports.CreateVaccinationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateVaccinationDto {
    animalId;
    vaccineId;
    appliedDate;
    nextDueDate;
    doseMl;
    batchNumber;
    appliedById;
    notes;
}
exports.CreateVaccinationDto = CreateVaccinationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del animal vacunado' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateVaccinationDto.prototype, "animalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la vacuna aplicada' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateVaccinationDto.prototype, "vaccineId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-06-10', description: 'Fecha de aplicación' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateVaccinationDto.prototype, "appliedDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024-12-10', description: 'Fecha de próxima dosis' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateVaccinationDto.prototype, "nextDueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2.0, description: 'Dosis aplicada en ml' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateVaccinationDto.prototype, "doseMl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Lote 2024-A', description: 'Número de lote de la vacuna' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateVaccinationDto.prototype, "batchNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del veterinario que aplicó la vacuna' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateVaccinationDto.prototype, "appliedById", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Sin reacciones adversas' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateVaccinationDto.prototype, "notes", void 0);
//# sourceMappingURL=create-vaccination.dto.js.map