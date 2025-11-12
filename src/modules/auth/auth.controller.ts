import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import { LoginDTO } from '../users/dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() data: CreateUserDTO) {
        return this.authService.register(data);
    }

     @Post('login')
    login(@Body() data: LoginDTO) {
        return this.authService.login(data);
    }

    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
