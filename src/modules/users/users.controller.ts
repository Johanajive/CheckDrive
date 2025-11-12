import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    @Get('name/:name')
    findName(@Param('name') name: string) {
        return this.usersService.findName(name);
    }

    @Post()
    create(@Body() body: CreateUserDTO) {
        return this.usersService.create(body);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDTO) {
        return this.usersService.update(id, body)
    }

    @Delete(':id')
    disabled(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.disabled(id);
    }
}
