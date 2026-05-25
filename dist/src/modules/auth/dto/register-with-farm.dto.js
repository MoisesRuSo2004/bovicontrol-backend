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
exports.RegisterWithFarmDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class RegisterWithFarmDto {
    firstName;
    lastName;
    email;
    password;
    phone;
    farmName;
    farmLocation;
    farmDepartment;
    farmMunicipality;
    farmAreaHectares;
    farmPhone;
    farmEmail;
    farmRut;
}
exports.RegisterWithFarmDto = RegisterWithFarmDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Juan' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es requerido' }),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], RegisterWithFarmDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Pérez' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El apellido es requerido' }),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], RegisterWithFarmDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'juan@finca.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'El email no tiene un formato válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El email es requerido' }),
    __metadata("design:type", String)
], RegisterWithFarmDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SecurePass123!' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'La contraseña debe contener mayúsculas, minúsculas y números',
    }),
    __metadata("design:type", String)
], RegisterWithFarmDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+57 300 123 4567' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], RegisterWithFarmDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Finca El Progreso' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'El nombre de la finca es requerido' }),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], RegisterWithFarmDto.prototype, "farmName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Vereda La Esperanza, km 12 vía Bogotá' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], RegisterWithFarmDto.prototype, "farmLocation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Cundinamarca' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], RegisterWithFarmDto.prototype, "farmDepartment", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Villavicencio' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], RegisterWithFarmDto.prototype, "farmMunicipality", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 150.5, description: 'Área de la finca en hectáreas' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], RegisterWithFarmDto.prototype, "farmAreaHectares", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+57 300 987 6543' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(30),
    __metadata("design:type", String)
], RegisterWithFarmDto.prototype, "farmPhone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'finca@ejemplo.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'El email de la finca no es válido' }),
    (0, class_validator_1.MaxLength)(150),
    __metadata("design:type", String)
], RegisterWithFarmDto.prototype, "farmEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '900.123.456-7', description: 'NIT / RUT de la finca (único)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], RegisterWithFarmDto.prototype, "farmRut", void 0);
//# sourceMappingURL=register-with-farm.dto.js.map