import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
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
  name: 'mock user 1',
};

const updatedUser: User = {
  id: 1,
  email: 'new user email',
  password: 'new user password',
  name: 'new user name',
};

const createBody: CreateUserDto = {
  email: 'mock@email.com',
  password: 'Abc@123',
  name: 'Mock User',
};

describe('UserController', () => {
  let usercontroller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(mockUser),
            findUsers: jest.fn().mockResolvedValue(userList),
            updateUser: jest.fn().mockResolvedValue(updatedUser),
            deleteUser: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    usercontroller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(usercontroller).toBeDefined();
    expect(userService).toBeDefined();
  });
  describe('createUser', () => {
    it('Should create a new user successfully', async () => {
      const result = await usercontroller.createUser(createBody);

      expect(result).toEqual(mockUser);
      expect(userService.createUser).toHaveBeenCalledTimes(1);
      expect(userService.createUser).toHaveBeenCalledWith(createBody);
    });

    it('Should return an error if it cannot complete the promise', () => {
      jest.spyOn(userService, 'createUser').mockRejectedValueOnce(new Error());

      expect(usercontroller.createUser(createBody)).rejects.toThrow(Error);
    });
  });

  describe('findUsers', () => {
    it('Should return a list of users', async () => {
      const result = await usercontroller.findUsers();
      expect(result).toEqual(userList);
      expect(userService.findUsers).toHaveBeenCalledTimes(1);
    });
    it('Should return an error if it cannot complete the promise', () => {
      jest.spyOn(userService, 'findUsers').mockRejectedValueOnce(new Error());

      expect(usercontroller.findUsers()).rejects.toThrow(Error);
    });
  });

  describe('updatedProduct', () => {
    it('Should update a user for the given id', async () => {
      const userID = 1;

      const updateBody: UpdateUserDto = {
        email: 'new user email',
        password: 'new user password',
        name: 'new user name',
      };

      const result = await usercontroller.updateUser(userID, updateBody);

      expect(result).toEqual(updatedUser);
      expect(userService.updateUser).toHaveBeenCalledTimes(1);
      expect(userService.updateUser).toHaveBeenCalledWith(userID, updateBody);
    });

    it('Should return an error if it cannot complete the promise', () => {
      const userID = 1;

      const updateBody: UpdateUserDto = {
        email: 'new user email',
        password: 'new user password',
        name: 'new user name',
      };

      jest.spyOn(userService, 'updateUser').mockRejectedValueOnce(new Error());

      expect(usercontroller.updateUser(userID, updateBody)).rejects.toThrow(
        Error,
      );
    });
  });

  describe('deleteUser', () => {
    it('Should remove a user for the given id', async () => {
      const userID = 1;

      const result = await usercontroller.deleteUser(userID);

      expect(result).toEqual(mockUser);
      expect(userService.deleteUser).toHaveBeenCalledTimes(1);
      expect(userService.deleteUser).toHaveBeenCalledWith(userID);
    });

    it('Should return an error if it cannot complete the promise', () => {
      const userID = 1;

      jest.spyOn(userService, 'deleteUser').mockRejectedValueOnce(new Error());

      expect(usercontroller.deleteUser(userID)).rejects.toThrow(Error);
    });
  });
});
