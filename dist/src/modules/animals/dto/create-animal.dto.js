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
exports.CreateAnimalDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CreateAnimalDto {
    tagNumber;
    name;
    sex;
    birthDate;
    birthWeight;
    currentWeight;
    photoUrl;
    status;
    notes;
    breedId;
    fatherId;
    motherId;
}
exports.CreateAnimalDto = CreateAnimalDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'BCT-001', description: 'Número de arete / identificación' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateAnimalDto.prototype, "tagNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Lola', description: 'Nombre del animal' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateAnimalDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.AnimalSex, description: 'Sexo del animal' }),
    (0, class_validator_1.IsEnum)(client_1.AnimalSex),
    __metadata("design:type", String)
], CreateAnimalDto.prototype, "sex", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2022-03-15', description: 'Fecha de nacimiento (ISO 8601)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAnimalDto.prototype, "birthDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 38.5, description: 'Peso al nacer en kg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateAnimalDto.prototype, "birthWeight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 520.0, description: 'Peso actual en kg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateAnimalDto.prototype, "currentWeight", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://res.cloudinary.com/...', description: 'URL de la foto del animal' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateAnimalDto.prototype, "photoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.AnimalStatus, default: client_1.AnimalStatus.ACTIVE }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.AnimalStatus),
    __metadata("design:type", String)
], CreateAnimalDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Animal manso, buena productora' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateAnimalDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID de la raza' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAnimalDto.prototype, "breedId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del padre (animal macho de la misma finca)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAnimalDto.prototype, "fatherId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID de la madre (animal hembra de la misma finca)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAnimalDto.prototype, "motherId", void 0);
//# sourceMappingURL=create-animal.dto.js.map