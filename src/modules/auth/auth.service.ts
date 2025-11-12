import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private userRepo: Repository<Users>
    ){}

    async register(data: CreateUserDTO){
        const hashedPassword = await bcrypt.hash(data.password, 10)
        const registerUser = await this.userRepo.create({...data, password: hashedPassword})
        await this.userRepo.save(registerUser)
        return {message: 'Usuario registrado correctamente', user: {name: registerUser.name, email: registerUser.email}}
    }
}
