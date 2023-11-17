import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<User | object> {
    return await this.userService.createUser(createUserDto);
  }

  @Get('all')
  async findUsers(): Promise<User[]> {
    return await this.userService.findUsers();
  }

  @Put('update/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() newUserData: UpdateUserDto,
  ): Promise<User | object> {
    return await this.userService.updateUser(id, newUserData);
  }

  @Delete('delete/:id')
  async deleteUser(@Param('id') id: number): Promise<User | object> {
    return await this.userService.deleteUser(id);
  }
}
