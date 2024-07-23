import { User } from '../../model/types/user.type';
import { UserDto } from '../dto/user.dto';

export const convertUserToUserDto = (user: User): UserDto => {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? null,
    task_ids: user.taskIds ?? [],
  };
};
