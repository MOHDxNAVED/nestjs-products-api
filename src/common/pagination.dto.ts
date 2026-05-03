import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min, min } from "class-validator";

export class PaginationDto{
    @ApiPropertyOptional({example:1,description:'kon sa page chaiye'})
    @IsOptional()
    @Type(()=>Number)    // 👈 Query string se aata hai — string to number convert
    @IsPositive()
    page:number=1;


    @ApiPropertyOptional({example:10,description:'Ek page me kinte result'})
    @IsOptional()
    @Min(1)
    @Type(()=>Number)
    limit:number=10
}