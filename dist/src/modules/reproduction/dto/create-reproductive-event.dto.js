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
exports.CreateReproductiveEventDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateReproductiveEventDto {
    femaleId;
    maleId;
    type;
    eventDate;
    notes;
    bullSemen;
    technicianName;
}
exports.CreateReproductiveEventDto = CreateReproductiveEventDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la hembra a la que pertenece el evento' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateReproductiveEventDto.prototype, "femaleId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del toro utilizado (para monta o IA)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateReproductiveEventDto.prototype, "maleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.ReproductiveEventType, description: 'Tipo de evento reproductivo' }),
    (0, class_validator_1.IsEnum)(client_1.ReproductiveEventType),
    __metadata("design:type", String)
], CreateReproductiveEventDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-06-01', description: 'Fecha del evento (ISO 8601)' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateReproductiveEventDto.prototype, "eventDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Sin complicaciones' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateReproductiveEventDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Pajilla congelada lote A-12', description: 'Información de semen usado en IA' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateReproductiveEventDto.prototype, "bullSemen", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Dr. López', description: 'Nombre del técnico o veterinario' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateReproductiveEventDto.prototype, "technicianName", void 0);
//# sourceMappingURL=create-reproductive-event.dto.js.map