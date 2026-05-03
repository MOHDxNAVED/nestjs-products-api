import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './create.user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { throttle } from 'rxjs';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}
 
    // 👇 Signup par rate limiting
  @Throttle({ short: { ttl: 60000, limit: 5 } })
  // 👆 1 minute mein sirf 5 signup attempts — spam rokne ke liye
    @ApiOperation({ summary: 'Naya user register karo' })
    @Post('sign-up')
    async createUser(@Body() dto:CreateUserDto){
        return this.authService.createUser(dto)
    }
    
     // 👇 Login par strict rate limiting — Brute Force rokne ke liye
  @Throttle({ short: { ttl: 60000, limit: 5 } })
  // 👆 1 minute mein sirf 5 login attempts
    @ApiOperation({ summary: 'Login karo — token milo' })
    @Post('log-in')
    async login(@Body() dto:LoginDto){
        return this.authService.login(dto)
    }
}
