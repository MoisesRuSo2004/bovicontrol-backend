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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimalsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const animals_service_1 = require("./animals.service");
const create_animal_dto_1 = require("./dto/create-animal.dto");
const query_animal_dto_1 = require("./dto/query-animal.dto");
const update_animal_dto_1 = require("./dto/update-animal.dto");
const photoUploadInterceptor = (0, platform_express_1.FileInterceptor)('photo', {
    storage: (0, multer_1.memoryStorage)(),
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|jpg|png|webp)$/)) {
            return cb(new common_1.BadRequestException('Solo se permiten imágenes JPG, PNG o WebP'), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
});
let AnimalsController = class AnimalsController {
    animalsService;
    constructor(animalsService) {
        this.animalsService = animalsService;
    }
    create(farmId, dto) {
        return this.animalsService.create(farmId, dto);
    }
    findAll(farmId, query) {
        return this.animalsService.findAll(farmId, query);
    }
    getStats(farmId) {
        return this.animalsService.getStats(farmId);
    }
    getCategories(farmId) {
        return this.animalsService.getCategorySummary(farmId);
    }
    findOne(id, farmId) {
        return this.animalsService.findOne(id, farmId);
    }
    update(id, farmId, dto) {
        return this.animalsService.update(id, farmId, dto);
    }
    remove(id, farmId) {
        return this.animalsService.remove(id, farmId);
    }
    updatePhoto(id, farmId, file) {
        if (!file)
            throw new common_1.BadRequestException('Se requiere una imagen (campo: photo)');
        return this.animalsService.updatePhoto(id, farmId, file.buffer, file.mimetype, file.originalname);
    }
    removePhoto(id, farmId) {
        return this.animalsService.removePhoto(id, farmId);
    }
    getGallery(id, farmId) {
        return this.animalsService.getGallery(id, farmId);
    }
    addGalleryPhoto(id, farmId, file) {
        if (!file)
            throw new common_1.BadRequestException('Se requiere una imagen (campo: photo)');
        return this.animalsService.addGalleryPhoto(id, farmId, file.buffer, file.mimetype, file.originalname);
    }
    removeGalleryPhoto(id, photoId, farmId) {
        return this.animalsService.removeGalleryPhoto(id, farmId, photoId);
    }
};
exports.AnimalsController = AnimalsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar un nuevo animal' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_animal_dto_1.CreateAnimalDto]),
    __metadata("design:returntype", void 0)
], AnimalsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar animales de la finca con filtros y paginación' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_animal_dto_1.QueryAnimalDto]),
    __metadata("design:returntype", void 0)
], AnimalsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Estadísticas del hato' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnimalsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Resumen de animales por categoría productiva (terneros, novillas, paridas, escoteras, etc.)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnimalsController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener detalle de un animal' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AnimalsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un animal' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_animal_dto_1.UpdateAnimalDto]),
    __metadata("design:returntype", void 0)
], AnimalsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un animal' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AnimalsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/photo'),
    (0, swagger_1.ApiOperation)({ summary: 'Subir o reemplazar la foto del animal (Supabase Storage)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)(photoUploadInterceptor),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], AnimalsController.prototype, "updatePhoto", null);
__decorate([
    (0, common_1.Delete)(':id/photo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar la foto del animal' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AnimalsController.prototype, "removePhoto", null);
__decorate([
    (0, common_1.Get)(':id/gallery'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar fotos de la galería del animal (máx. 5)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AnimalsController.prototype, "getGallery", null);
__decorate([
    (0, common_1.Post)(':id/gallery'),
    (0, swagger_1.ApiOperation)({ summary: 'Agregar una foto a la galería del animal' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)(photoUploadInterceptor),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], AnimalsController.prototype, "addGalleryPhoto", null);
__decorate([
    (0, common_1.Delete)(':id/gallery/:photoId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una foto de la galería del animal' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Param)('photoId', common_1.ParseUUIDPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)('farmId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AnimalsController.prototype, "removeGalleryPhoto", null);
exports.AnimalsController = AnimalsController = __decorate([
    (0, swagger_1.ApiTags)('Animals'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('animals'),
    __metadata("design:paramtypes", [animals_service_1.AnimalsService])
], AnimalsController);
//# sourceMappingURL=animals.controller.js.map