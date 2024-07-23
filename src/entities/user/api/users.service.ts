import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { firebaseDb } from '@/shared/config/firebase.config';
import { PATH_TO_USERS_COLLECTION } from '@/shared/models/constants/firebase-paths';

import { UserDto } from './dto/user.dto';

export class UsersService {
  public static async getUser(id: string): Promise<UserDto | null> {
    const user = await getDoc(doc(firebaseDb, PATH_TO_USERS_COLLECTION, id));
    return user.data() as UserDto;
  }
  public static async createUser(userDto: UserDto): Promise<void> {
    await setDoc(
      doc(firebaseDb, PATH_TO_USERS_COLLECTION, userDto.id),
      userDto,
    );
  }

  public static async updateUser(userDto: UserDto): Promise<void> {
    await updateDoc(
      doc(firebaseDb, PATH_TO_USERS_COLLECTION, userDto.id),
      userDto,
    );
  }
}
