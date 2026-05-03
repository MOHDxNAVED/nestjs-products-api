import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UploadedFile, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/roles.enum';
import { Roles } from 'src/auth/roles.decorator';
import { SkipThrottle } from '@nestjs/throttler';
import { PaginationDto } from 'src/common/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/file-upload.config';
import { FileCleanupFilter } from 'src/filters/multer-exception.filter';

@ApiTags('products')
@ApiBearerAuth()        // 👈 Swagger mein lock icon dikhao
@UseGuards(JwtAuthGuard,RolesGuard) // 👈 Saari routes protect karo
@Controller('product')
export class ProductController {
    constructor(private readonly productService:ProductService){}

    @ApiOperation({ summary: 'Add new product' })
    @ApiConsumes('multipart/form-data')
    @Roles(Role.ADMIN)
    @ApiResponse({ status: 201, description: 'Product created' })
    @ApiResponse({ status: 400, description: 'Wrong data' })
    @UseInterceptors(FileInterceptor('image',multerConfig))
    @UseFilters(FileCleanupFilter)
    @Post()
    async create(@Body() dto:CreateProductDto,@UploadedFile() file:Express.Multer.File){
        return this.productService.create(dto,file)
    }



     // 👇 GET routes par zyada requests allow — public data hai
    @SkipThrottle()
  // 👆 Rate limiting skip karo — GET requests zyada hoti hain
    @ApiOperation({ summary: 'Sab products lao' })
    @ApiResponse({ status: 200, description: 'Products ki list' })
    @Get()
    findAll(@Query() paginationDto:PaginationDto){
         // 👆 @Query() — URL se query params lo
        //  product?page=2&limit=5 → paginationDto = { page: 2, limit: 5 }
        return this.productService.findAll(paginationDto)

    }

    @SkipThrottle()
    @ApiOperation({ summary: 'Ek product lao ID se' })
    @ApiResponse({ status: 200, description: 'Product mila' })
    @ApiResponse({ status: 404, description: 'Product nahi mila' })
    @Get(':id')
    async findOne(@Param('id') id:string){
        return this.productService.findOne(id)
    }

    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Product update karo' })
    @ApiResponse({ status: 200, description: 'Product update ho gaya' })
    @ApiResponse({ status: 404, description: 'Product nahi mila' })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image',multerConfig))
    @Patch(':id')
    async update(@Param('id') id:string,@Body() dto:UpdateProductDto, @UploadedFile() file:Express.Multer.File){
        return this.productService.update(id,dto,file);
    }

    @ApiOperation({ summary: 'Product delete karo' })
    @ApiResponse({ status: 200, description: 'Product delete ho gaya' })
    @ApiResponse({ status: 404, description: 'Product nahi mila' })
    @Roles(Role.ADMIN)
    @Delete(':id')
    async remove(@Param('id') id:string){
        return this.productService.remove(id)
    }
}
