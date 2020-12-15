/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from './entities/user.entity';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { CurrentUser } from '../auth/user.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findOne(@CurrentUser() { username }: User) {
        const {
            password,
            createAt,
            ...result
        } = await this.userService.findOne({ username });
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    update(
        @CurrentUser() { username }: User,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.userService.update({ username }, updateUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    remove(@CurrentUser() { username }: User) {
        return this.userService.remove({ username });
    }
}
