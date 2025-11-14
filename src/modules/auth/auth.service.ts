import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entity/user.entity'; 
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from '../users/dto/login.dto';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private userRepo: Repository<Users>,
        private jwtService: JwtService,
        private readonly logsService: LogsService,
    ) {}

    /**
     * register: Registra un nuevo usuario en el sistema.
     * Encripta la contraseña, guarda el usuario y genera un log.
     * 
     * @param data { CreateUserDTO } - Datos del usuario a registrar.
     * @returns Mensaje y datos básicos del usuario registrado.
     */
    async register(data: CreateUserDTO) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const registerUser = this.userRepo.create({
            ...data,
            password: hashedPassword,
        });
        await this.userRepo.save(registerUser);

        // Log: Registro de nuevo usuario
        await this.logsService.create({
            date: new Date(),
            host: 'auth-service',
            service: 'register',
            content: `Usuario ${registerUser.name} (${registerUser.email}) registrado correctamente.`,
        });

        return {
            message: 'Usuario registrado correctamente',
            user: { name: registerUser.name, email: registerUser.email },
        };
    }

    /**
     * login: Inicia sesión validando email y contraseña.
     * Genera un token JWT si las credenciales son correctas.
     * 
     * @param data { LoginDTO } - Credenciales del usuario.
     * @returns Token JWT.
     * @throws UnauthorizedException si las credenciales son incorrectas.
     */
    async login(data: LoginDTO) {
        const user = await this.userRepo.findOne({
            where: { email: data.email },
        });

        if (!user) {
            // Log: intento con usuario inexistente
            await this.logsService.create({
                date: new Date(),
                host: 'auth-service',
                service: 'login',
                content: `Intento de inicio de sesión fallido: usuario con correo ${data.email} no encontrado.`,
            });
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const isPasswordValid = await bcrypt.compare(
            data.password,
            user.password,
        );

        if (!isPasswordValid) {
            // Log: contraseña incorrecta
            await this.logsService.create({
                date: new Date(),
                host: 'auth-service',
                service: 'login',
                content: `Inicio de sesión fallido: contraseña incorrecta para ${data.email}.`,
            });
            throw new UnauthorizedException('Contraseña incorrecta');
        }

        const payloadToken = {
            id: user.id_user,
            email: user.email,
            name: user.name,
            role: user.role,
        };
        const token = await this.jwtService.signAsync(payloadToken);

        // Log: login exitoso
        await this.logsService.create({
            date: new Date(),
            host: 'auth-service',
            service: 'login',
            content: `Usuario ${user.name} (${user.email}) inició sesión correctamente.`,
        });

        return { accessToken: token };
    }
}
