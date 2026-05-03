import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateProductDto{
    @ApiProperty({ example: 'Laptop', description: 'Product ka naam' })
    @IsString()
    @IsNotEmpty()
    name:string;
    
    @ApiProperty({ example: 'Gaming Laptop', description: 'Product ki description' })
    @IsString()
    @IsNotEmpty()
    description:string;

    @ApiProperty({ example: 75000, description: 'Product ki price' })
    @Type(()=>Number)
    @IsNumber()
    @Min(0)
    price:number;

    @ApiProperty({ example: true, description: 'Product available hai?' })
    @IsOptional()
    @Transform(({value})=>{
        if(value=='true') return true;
        if(value=='false') return false;
    })
    @IsBoolean()
    isAvailable:boolean;

    @ApiProperty({ example: 'uuid', description: 'Category ID' })
    @IsString()
    @IsNotEmpty()
    categoryId:string
}