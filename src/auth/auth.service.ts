import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create.user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './login.dto';
import { use } from 'passport';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private userRepo:Repository<User>, private jwtService:JwtService){}

    async createUser(dto:CreateUserDto){
        const existingUser=await this.userRepo.findOne({where:{email:dto.email}})
        if(existingUser){
            throw new ConflictException(`user is already resgisted with this email id ${dto.email}`)
        }

        //hashed the password
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user=this.userRepo.create({
            name:dto.name,
            email:dto.email,
            password:hashedPassword,
            role:dto.role
        })
        await this.userRepo.save(user)

        const {password,...result}=user;
        return result

    }

    async login(dto:LoginDto){
        const user=await this.userRepo.findOne({where:{email:dto.email}})
        if(!user){
            throw new UnauthorizedException(`Wrong crendetials`)
        }

        const isPasswprd=await bcrypt.compare(dto.password,user.password)
        if(!isPasswprd){
            throw new UnauthorizedException(`wrong credentials`)
        }

        //Jwt token
        const token=this.jwtService.sign({
            sub:user.id,
            email:user.email,
            role:user.role
        });
        console.log(token)

        return{
            accesstoken:token,
            user:{
                sub:user.id,
                email:user.email,
                role:user.role
            }
        }

    }
}
