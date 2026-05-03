import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './create-category.dto';

@Injectable()
export class CategoryService {
    constructor(@InjectRepository(Category) private categoryRepo:Repository<Category>){}

    async create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepo.create(dto);
    return await this.categoryRepo.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepo.find({
      relations: ['products']  // 👈 Products bhi saath lao
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['products']  // 👈 Products bhi saath lao
    });

    if (!category) {
      throw new NotFoundException(`Category ${id} nahi mili`);
    }

    return category;
  }
}
