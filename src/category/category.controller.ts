import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './create-category.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService:CategoryService){}

  @ApiOperation({ summary: 'Nayi category banao' })
  @ApiResponse({ status: 201, description: 'Category ban gayi' })
  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }


  @ApiOperation({ summary: 'Sab categories lao' })
  @ApiResponse({ status: 200, description: 'Categories ki list' })
  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: 'Ek category lao ID se' })
  @ApiResponse({ status: 200, description: 'Category mili' })
  @ApiResponse({ status: 404, description: 'Category nahi mili' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }
}
