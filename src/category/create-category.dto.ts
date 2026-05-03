import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto{
    @ApiProperty({ example: 'Electronics', description: 'Category ka naam' })
    @IsString()
    @IsNotEmpty()
    name:string;
}