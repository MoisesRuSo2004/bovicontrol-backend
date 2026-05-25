import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { GenealogyService } from './genealogy.service';

@ApiTags('Genealogy')
@ApiBearerAuth()
@Controller('genealogy')
export class GenealogyController {
  constructor(private readonly genealogyService: GenealogyService) {}

  @Get(':animalId/tree')
  @ApiOperation({ summary: 'Árbol genealógico del animal (hasta 3 generaciones)' })
  getAnimalTree(
    @Param('animalId', ParseUUIDPipe) animalId: string,
    @CurrentUser('farmId') farmId: string,
  ) {
    return this.genealogyService.getAnimalTree(animalId, farmId);
  }

  @Get(':animalId/ancestors')
  @ApiOperation({ summary: 'Listar ancestros del animal' })
  @ApiQuery({ name: 'generations', required: false, type: Number, description: 'Número de generaciones (1-5, default 3)' })
  getAncestors(
    @Param('animalId', ParseUUIDPipe) animalId: string,
    @CurrentUser('farmId') farmId: string,
    @Query('generations') generations?: string,
  ) {
    return this.genealogyService.getAncestors(animalId, farmId, generations ? parseInt(generations, 10) : 3);
  }

  @Get(':animalId/descendants')
  @ApiOperation({ summary: 'Listar descendientes del animal' })
  @ApiQuery({ name: 'generations', required: false, type: Number, description: 'Número de generaciones (1-5, default 3)' })
  getDescendants(
    @Param('animalId', ParseUUIDPipe) animalId: string,
    @CurrentUser('farmId') farmId: string,
    @Query('generations') generations?: string,
  ) {
    return this.genealogyService.getDescendants(animalId, farmId, generations ? parseInt(generations, 10) : 3);
  }

  @Get(':animalId/inbreeding')
  @ApiOperation({ summary: 'Calcular coeficiente de consanguinidad del animal' })
  analyzeInbreeding(
    @Param('animalId', ParseUUIDPipe) animalId: string,
    @CurrentUser('farmId') farmId: string,
  ) {
    return this.genealogyService.analyzeInbreeding(animalId, farmId);
  }

  @Get(':animalId/inbreeding/history')
  @ApiOperation({ summary: 'Historial de análisis de consanguinidad' })
  getInbreedingHistory(
    @Param('animalId', ParseUUIDPipe) animalId: string,
    @CurrentUser('farmId') farmId: string,
  ) {
    return this.genealogyService.getInbreedingHistory(animalId, farmId);
  }
}
