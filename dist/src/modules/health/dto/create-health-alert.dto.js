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
exports.CreateHealthAlertDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateHealthAlertDto {
    animalId;
    type;
    title;
    description;
    scheduledDate;
    isCompleted;
}
exports.CreateHealthAlertDto = CreateHealthAlertDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del animal relacionado (puede ser nulo para alertas generales)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateHealthAlertDto.prototype, "animalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.AlertType, description: 'Tipo de alerta' }),
    (0, class_validator_1.IsEnum)(client_1.AlertType),
    __metadata("design:type", String)
], CreateHealthAlertDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Vacuna Aftosa pendiente', description: 'Título de la alerta' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateHealthAlertDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'La vacuna Aftosa del animal BCT-005 vence el 2024-07-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateHealthAlertDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-07-01', description: 'Fecha en que se debe ejecutar la acción' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateHealthAlertDto.prototype, "scheduledDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: false, description: '¿Alerta completada?' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateHealthAlertDto.prototype, "isCompleted", void 0);
//# sourceMappingURL=create-health-alert.dto.js.map