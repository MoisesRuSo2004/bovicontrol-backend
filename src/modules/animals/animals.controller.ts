import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AnimalsService } from './animals.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { QueryAnimalDto } from './dto/query-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';

// Use memory storage so the file buffer goes directly to Supabase (no disk I/O)
const photoUploadInterceptor = FileInterceptor('photo', {
  storage: memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      return cb(new BadRequestException('Solo se permiten imágenes JPG, PNG o WebP'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

@ApiTags('Animals')
@ApiBearerAuth()
@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo animal' })
  create(@CurrentUser('farmId') farmId: string, @Body() dto: CreateAnimalDto) {
    return this.animalsService.create(farmId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar animales de la finca con filtros y paginación' })
  findAll(@CurrentUser('farmId') farmId: string, @Query() query: QueryAnimalDto) {
    return this.animalsService.findAll(farmId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Estadísticas del hato' })
  getStats(@CurrentUser('farmId') farmId: string) {
    return this.animalsService.getStats(farmId);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Resumen de animales por categoría productiva (terneros, novillas, paridas, escoteras, etc.)' })
  getCategories(@CurrentUser('farmId') farmId: string) {
    return this.animalsService.getCategorySummary(farmId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un animal' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('farmId') farmId: string) {
    return this.animalsService.findOne(id, farmId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un animal' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('farmId') farmId: string,
    @Body() dto: UpdateAnimalDto,
  ) {
    return this.animalsService.update(id, farmId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un animal' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('farmId') farmId: string) {
    return this.animalsService.remove(id, farmId);
  }

  // ── Photo management ──────────────────────────────────────────────────────

  @Patch(':id/photo')
  @ApiOperation({ summary: 'Subir o reemplazar la foto del animal (Supabase Storage)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(photoUploadInterceptor)
  updatePhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('farmId') farmId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Se requiere una imagen (campo: photo)');
    return this.animalsService.updatePhoto(id, farmId, file.buffer, file.mimetype, file.originalname);
  }

  @Delete(':id/photo')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar la foto del animal' })
  removePhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('farmId') farmId: string,
  ) {
    return this.animalsService.removePhoto(id, farmId);
  }

  // ── Gallery ───────────────────────────────────────────────────────────────

  @Get(':id/gallery')
  @ApiOperation({ summary: 'Listar fotos de la galería del animal (máx. 5)' })
  getGallery(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('farmId') farmId: string,
  ) {
    return this.animalsService.getGallery(id, farmId);
  }

  @Post(':id/gallery')
  @ApiOperation({ summary: 'Agregar una foto a la galería del animal' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(photoUploadInterceptor)
  addGalleryPhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('farmId') farmId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Se requiere una imagen (campo: photo)');
    return this.animalsService.addGalleryPhoto(
      id,
      farmId,
      file.buffer,
      file.mimetype,
      file.originalname,
    );
  }

  @Delete(':id/gallery/:photoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una foto de la galería del animal' })
  removeGalleryPhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('photoId', ParseUUIDPipe) photoId: string,
    @CurrentUser('farmId') farmId: string,
  ) {
    return this.animalsService.removeGalleryPhoto(id, farmId, photoId);
  }
}
