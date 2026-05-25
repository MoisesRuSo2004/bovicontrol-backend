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
exports.CreateMilkRecordDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateMilkRecordDto {
    animalId;
    recordDate;
    morningLiters;
    afternoonLiters;
    eveningLiters;
    totalLiters;
    qualityScore;
    notes;
}
exports.CreateMilkRecordDto = CreateMilkRecordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del animal (vaca)' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateMilkRecordDto.prototype, "animalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-06-10', description: 'Fecha del ordeño' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMilkRecordDto.prototype, "recordDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 8.5, description: 'Litros producidos en la mañana' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMilkRecordDto.prototype, "morningLiters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5.0, description: 'Litros producidos en la tarde' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMilkRecordDto.prototype, "afternoonLiters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5.0, description: 'Litros producidos en la noche' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMilkRecordDto.prototype, "eveningLiters", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 18.5, description: 'Total de litros producidos' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateMilkRecordDto.prototype, "totalLiters", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 85, description: 'Puntaje de calidad (0-100)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateMilkRecordDto.prototype, "qualityScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateMilkRecordDto.prototype, "notes", void 0);
//# sourceMappingURL=create-milk-record.dto.js.map