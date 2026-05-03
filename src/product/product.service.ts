import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER,Cache } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { unlink } from 'fs/promises';



@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private productRepo:Repository<Product>,
        @Inject(CACHE_MANAGER) private cacheManager:Cache
        // 👆 Cache Manager inject kiya
        // Isse cache set/get/delete kar sakte hain

){}  //product table inject kia

    async create(dto: CreateProductDto, file?: Express.Multer.File) {

    const product = this.productRepo.create({
      ...dto,
      image: file ? file.path : null,
      // 👆 File aaya? → Path save karo
      // File nahi aaya? → null rakho
      // file.path = "uploads/product-1234567890-987654321.jpg"
    });

    const saved= await this.productRepo.save(product);

    // 👇 Naya product bana — purana cache delete kar
     await this.cacheManager.clear();
     return saved;

    
  }

    async findAll(paginationDto:PaginationDto){
         const { page, limit } = paginationDto;

         // 👇 Cache key banao — unique honi chahiye
        const cacheKey = `products-page-${page}-limit-${limit}`;
        // Har page ka alag cache hoga
        // page=1,limit=10 → "products-page-1-limit-10"
        // page=2,limit=10 → "products-page-2-limit-10"

        // 👇 Pehle cache check karo
        const cachedData = await this.cacheManager.get(cacheKey);

        if (cachedData) {
       console.log('Cache se data mila ✅');
       return cachedData;
      // 👆 DB hit nahi hua — cache se diya ✅
    }

    // 👇 Cache mein nahi mila — DB se lo
    console.log('DB se data fetch ho raha hai 🔄');

        //formula for skip the record
        const skip = (page - 1) * limit;

        // 👇 findAndCount — data aur total count dono ek saat
        const [data, total] = await this.productRepo.findAndCount({
            skip,    // 👈 Kitne records skip karo
            take: limit,  // 👈 Kitne records lo
            order: { 
        // 👈 Order by — latest pehle
            },
         });

        const totalPages = Math.ceil(total / limit);  // Math.ceil → 10.3 → 11 pages (upar round karo)
        const result= {
      data,           // 👈 Is page ke products
      meta: {
        total,        // 👈 Total kitne products hain
        page,         // 👈 Abhi kaun sa page hai
        limit,        // 👈 Ek page mein kitne
        totalPages,   // 👈 Total kitne pages hain
        hasNextPage: page < totalPages,   // 👈 Agle page hai?
        hasPrevPage: page > 1,            // 👈 Pichla page hai?
      }
    };
    // 👇 DB se mila — Cache mein save karo
    await this.cacheManager.set(cacheKey, result);
    // 👆 Next request par DB hit nahi hoga ✅

    return result;
    }



    async findOne(id:string):Promise<Product>{
         // 👇 Cache check karo
        const cacheKey = `product-${id}`;
        const cachedProduct = await this.cacheManager.get<Product>(cacheKey);
        if (cachedProduct) {
            console.log(`Product ${id} cache se mila ✅`);
            return cachedProduct;
        }
        const product=await this.productRepo.findOne({where:{id}})
        if(!product){
            throw new NotFoundException(`product with this ${id} not found`)
        }
        // 👇 Cache mein save karo
        await this.cacheManager.set(cacheKey, product);

        return product
    }




    async update(id:string,dto:UpdateProductDto, file?:Express.Multer.File):Promise<Product>{
        const product=await this.findOne(id);  // search
        if(file && product.image){
            try{
                await unlink(product.image)
            } catch (err){
                    console.log('Purani Image nhi mili',err.message);
            }
        }
        Object.assign(product,{...dto,image:file?file.path:product.image})             // fields update kro from dto
        const updated= await this.productRepo.save(product)  // save kro
        // 👇 Cache invalidate karo
        await this.cacheManager.del(`product-${id}`);
        // 👆 Sirf is product ka cache delete karo

        await this.cacheManager.clear();
        // 👆 List cache bhi reset karo — updated data aaye

        return updated;

    }

    async remove(id:string):Promise<{message:string}>{
        const product=await this.findOne(id)
        if(product.image){
            try{
                await unlink(product.image)
            }catch (err){
                console.log('image not found',err.message)
            }
        }
       await this.productRepo.remove(product)
       // 👇 Cache invalidate karo
        await this.cacheManager.del(`product-${id}`);
        await this.cacheManager.clear();

        return {message:`product has been deleted with this ${id}`}
    }

    
}
