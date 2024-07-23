import { convertUserDtoToUser } from '../api/mappers/user-dto-to-user.mapper';
import { convertUserToUserDto } from '../api/mappers/user-to-user-dto.mapper';
import { UsersService } from '../api/users.service';
import { User } from './types/user.type';

export class UsersDal {
  public static async getUser(userId: string): Promise<User | null> {
    const user = await UsersService.getUser(userId);

    if (!user) {
      return null;
    }

    return convertUserDtoToUser(user);
  }

  public static async createUser(user: User): Promise<void> {
    const userDto = convertUserToUserDto(user);
    await UsersService.createUser(userDto);
  }

  public static async updateUser(user: User): Promise<void> {
    const userDto = convertUserToUserDto(user);
    await UsersService.updateUser(userDto);
  }
}
