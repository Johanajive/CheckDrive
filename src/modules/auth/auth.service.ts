import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entity/user.entity'; 
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from '../users/dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private userRepo: Repository<Users>,
        private jwtService: JwtService
    ){}

    async register(data: CreateUserDTO){
        const hashedPassword = await bcrypt.hash(data.password, 10)
        const registerUser = await this.userRepo.create({...data, password: hashedPassword})
        await this.userRepo.save(registerUser)
        return {message: 'Usuario registrado correctamente', user: {name: registerUser.name, email: registerUser.email}}
    }

    async login(data: LoginDTO){
        const user = await this.userRepo.findOne({ where: {email: data.email} })

        if(!user){throw new UnauthorizedException('Credenciales invalidas')}

        const isPasswordValid = await bcrypt.compare(data.password, user.password)
        if(!isPasswordValid){throw new UnauthorizedException('Contraseña incorrecta')}

        const payloadToken = { id: user.id_user, email: user.email, name: user.name, role: user.role}
        const token = await this.jwtService.signAsync(payloadToken)
        return { accessToken: token }
    }
}
