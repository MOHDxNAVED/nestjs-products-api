import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator"
import { CreateDateColumn } from "typeorm"
import { Role } from "./roles.enum"

export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    name:string

    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsStrongPassword()
    @IsNotEmpty()
    password:string

    
    @IsEnum(Role)
    role:Role

}