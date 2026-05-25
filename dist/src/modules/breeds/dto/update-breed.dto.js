"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBreedDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_breed_dto_1 = require("./create-breed.dto");
class UpdateBreedDto extends (0, swagger_1.PartialType)(create_breed_dto_1.CreateBreedDto) {
}
exports.UpdateBreedDto = UpdateBreedDto;
//# sourceMappingURL=update-breed.dto.js.map