import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesEnum } from 'src/common/enum/roles.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles(RolesEnum.ADMIN)
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @Roles(RolesEnum.ADMIN)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    @Get('name/:name')
    @Roles(RolesEnum.ADMIN)
    findName(@Param('name') name: string) {
        return this.usersService.findName(name);
    }

    @Get('document/:document')
    @Roles(RolesEnum.ADMIN)
    findDocument(@Param('document') document: number){
        return this.usersService.findDocument(document)
    }

    @Post()
    @Roles(RolesEnum.ADMIN)
    create(@Body() body: CreateUserDTO) {
        return this.usersService.create(body);
    }

    @Put(':id')
    @Roles(RolesEnum.ADMIN)
    update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDTO) {
        return this.usersService.update(id, body)
    }

    @Delete(':id')
    @Roles(RolesEnum.ADMIN)
    disabled(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.disabled(id);
    }
}
