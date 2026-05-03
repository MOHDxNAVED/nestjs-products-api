import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class LoginDto{

    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @ApiProperty({ example: 'password123' })
    @IsStrongPassword()
    @IsNotEmpty()
    password:string
}
