import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

const userList: User[] = [
  {
    id: 1,
    email: 'mock@email.com',
    password: 'hashed password',
    name: 'mock user 1',
  },
  {
    id: 2,
    email: 'mock@email.com',
    password: 'hashed password',
    name: 'mock user 2',
  },
];

const mockUser: User = {
  id: 1,
  email: 'mock@email.com',
  password: 'hashed password',
  name: 'mock user',
};

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
            findOne: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn().mockResolvedValue(userList),
            remove: jest.fn().mockResolvedValue(mockUser),
            findByEmail: jest.fn(),
            merge: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('createUser', () => {
    it('Should encrypt the password and create a new user', async () => {
      const createBody: CreateUserDto = {
        email: 'mock@email.com',
        password: 'Abc@123',
        name: 'Mock User',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);

      const result = await userService.createUser(createBody);

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: createBody.email },
      });

      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(bcrypt.hash).toHaveBeenCalledWith(createBody.password, 10);

      expect(result).toEqual(mockUser);
    });

    it('Should return "email already in use" if the provided email is already in use', () => {
      const createBody: CreateUserDto = {
        email: 'mock@email.com',
        password: 'Abc@123',
        name: 'Mock User',
      };

      jest
        .spyOn(userRepository, 'findOne')
        .mockRejectedValue(new Error('email already in use'));

      expect(userService.findByEmail(createBody.email)).rejects.toThrow(
        'email already in use',
      );
    });
  });

  describe('findUsers', () => {
    it('Should return a list of users', async () => {
      const result = await userService.findUsers();

      expect(userRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(userList);
    });
    it('Should return an error if it cannot complete the promise', () => {
      jest.spyOn(userRepository, 'find').mockRejectedValue(new Error());

      expect(userService.findUsers()).rejects.toThrow(Error);
    });
  });

  describe('findByEmail', () => {
    it('Should return a user for the provided email', async () => {
      const userEmail = 'mock@email.com';

      const result = await userService.findByEmail(userEmail);

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenLastCalledWith({
        where: { email: userEmail },
      });

      expect(result).toEqual(mockUser);
    });

    it('Should return an error if the provided email does not match any user', async () => {
      const userEmail = 'mock@email.com';

      jest.spyOn(userRepository, 'findOne').mockRejectedValue(new Error());

      expect(userService.findByEmail(userEmail)).rejects.toThrow(Error);
    });
  });

  describe('updateUser', () => {
    it('Should update a user for the given id', async () => {
      const userID = 1;

      const updateBody: UpdateUserDto = {
        email: 'new user email',
        password: 'new user password',
        name: 'new user name',
      };

      const mockUser: User = {
        id: 1,
        email: 'mock@email.com',
        password: 'hashed password',
        name: 'mock user',
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
      jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValue('new user password' as never);

      const result = await userService.updateUser(userID, updateBody);

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userID },
      });
      expect(userService.findByEmail).toHaveBeenCalledTimes(1);
      expect(userService.findByEmail).toHaveBeenCalledWith(updateBody.email);

      expect(userRepository.merge).toHaveBeenCalledTimes(1);
      expect(userRepository.merge).toHaveBeenCalledWith(mockUser, updateBody);

      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);

      expect(result).toEqual(mockUser);
    });

    it('Should return "user not found" when the given id does not match a user', async () => {
      const userID = 1;

      const updateBody: UpdateUserDto = {
        email: 'new user email',
        password: 'new user password',
        name: 'new user name',
      };

      jest
        .spyOn(userRepository, 'findOne')
        .mockRejectedValue(new Error('user not found'));

      expect(userService.updateUser(userID, updateBody)).rejects.toThrow(
        'user not found',
      );
    });
    it('Should return "email already in use" when the given email is already in use', () => {
      const userID = 1;

      const updateBody: UpdateUserDto = {
        email: 'new user email',
        password: 'new user password',
        name: 'new user name',
      };

      jest
        .spyOn(userService, 'findByEmail')
        .mockRejectedValue(new Error('email already in use'));

      expect(userService.updateUser(userID, updateBody)).rejects.toThrow(
        'email already in use',
      );
    });
  });

  describe('deleteUser', () => {
    it('Should delete one user for the given id', async () => {
      const userID = 1;

      const result = await userService.deleteUser(userID);

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userID },
      });

      expect(userRepository.remove).toHaveBeenCalledTimes(1);
      expect(userRepository.remove).toHaveBeenCalledWith(mockUser);

      expect(result).toEqual(mockUser);
    });

    it('Should return "user not found" when the given id does not match a user', () => {
      const userID = 1;

      jest
        .spyOn(userRepository, 'findOne')
        .mockRejectedValue(new Error('user not found'));

      expect(userService.deleteUser(userID)).rejects.toThrow('user not found');
    });
  });
});
