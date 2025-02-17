import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { FloorService } from './floor.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreateFloorDto {
  name: string;
}

class UpdateFloorDto {
  name: string;
}

class CreateOfficeDto {
  floorId: number;
  number: string;
}

class UpdateOfficeDto {
  number: string;
}

class OfficeDto {
  id: number;
  number: string;
  floorId: number;
  orders: any[];
}

class FloorDto {
  id: number;
  name: string;
  offices: OfficeDto[];
}

@ApiTags('Floors')
@ApiBearerAuth()
@Controller('floors')
export class FloorController {
  constructor(private floorService: FloorService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Получение списка этажей с офисами' })
  @ApiResponse({ status: 200, description: 'Список этажей', type: [FloorDto] })
  async getFloors() {
    return this.floorService.getFloors();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Создание нового этажа' })
  @ApiBody({ type: CreateFloorDto })
  @ApiResponse({
    status: 201,
    description: 'Этаж успешно создан',
    type: FloorDto,
  })
  async createFloor(@Body() body: CreateFloorDto) {
    return this.floorService.createFloor(body.name);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Редактирование этажа' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateFloorDto })
  @ApiResponse({
    status: 200,
    description: 'Этаж успешно обновлён',
    type: FloorDto,
  })
  async updateFloor(@Param('id') id: number, @Body() body: UpdateFloorDto) {
    return this.floorService.updateFloor(id, body.name);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Удаление этажа' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Этаж успешно удалён' })
  async deleteFloor(@Param('id') id: number) {
    return this.floorService.deleteFloor(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('office')
  @ApiOperation({ summary: 'Создание офиса на этаже' })
  @ApiBody({ type: CreateOfficeDto })
  @ApiResponse({
    status: 201,
    description: 'Офис успешно создан',
    type: OfficeDto,
  })
  async createOffice(@Body() body: CreateOfficeDto) {
    return this.floorService.createOffice(body.floorId, body.number);
  }

  @UseGuards(JwtAuthGuard)
  @Put('office/:id')
  @ApiOperation({ summary: 'Редактирование офиса' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateOfficeDto })
  @ApiResponse({
    status: 200,
    description: 'Офис успешно обновлён',
    type: OfficeDto,
  })
  async updateOffice(@Param('id') id: number, @Body() body: UpdateOfficeDto) {
    return this.floorService.updateOffice(id, body.number);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('office/:id')
  @ApiOperation({ summary: 'Удаление офиса' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Офис успешно удалён' })
  async deleteOffice(@Param('id') id: number) {
    return this.floorService.deleteOffice(id);
  }
}
