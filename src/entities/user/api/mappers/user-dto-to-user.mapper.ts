import { User } from '../../model/types/user.type';
import { UserDto } from '../dto/user.dto';

export const convertUserDtoToUser = (userDto: UserDto): User => {
  return {
    id: userDto.id,
    email: userDto.email,
    name: userDto.name ?? null,
    taskIds: userDto.task_ids ?? [],
  };
};
