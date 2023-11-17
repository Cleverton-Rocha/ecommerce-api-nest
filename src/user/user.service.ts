import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User | object> {
    const emailIsUnique = await this.findByEmail(createUserDto.email);

    if (emailIsUnique) {
      return { error: 'email already in use' };
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }
  async findUsers(): Promise<User[] | undefined> {
    return this.userRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async deleteUser(id: number): Promise<User | object> {
    const userToDelete = await this.userRepository.findOne({ where: { id } });

    if (!userToDelete) {
      return { error: 'user not found' };
    }

    await this.userRepository.remove(userToDelete);
    return userToDelete;
  }

  async updateUser(
    id: number,
    newUserData: UpdateUserDto,
  ): Promise<User | object> {
    const userToUpdate = await this.userRepository.findOne({ where: { id } });

    if (!userToUpdate) {
      return { error: 'user not found' };
    }

    if (userToUpdate.email !== newUserData.email) {
      const emailIsUnique = await this.findByEmail(newUserData.email);
      if (emailIsUnique) {
        return { error: 'email already in use' };
      }
    }

    if (newUserData.password) {
      const hashedPassword = await bcrypt.hash(newUserData.password, 10);
      Object.assign(userToUpdate, { ...newUserData, password: hashedPassword });
    } else {
      Object.assign(userToUpdate, newUserData);
    }
    await this.userRepository.save(userToUpdate);
    return userToUpdate;
  }
}
