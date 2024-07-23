import { UnknownAction } from '@reduxjs/toolkit';
import { FirebaseError } from 'firebase/app';
import { Dispatch } from 'react';
import toast from 'react-hot-toast';

import { setUser, unsetUser } from '@/entities/user/model/slice/user.slice';
import { User } from '@/entities/user/model/types/user.type';
import { UsersDal } from '@/entities/user/model/users.dal';

import { AuthService } from '../api/auth.service';
import { UserRegistrationDto } from '../api/dto/user-login.dto';
import { UserLoginDto } from '../api/dto/user-registration.dto';
import { getAuthErrorMessage } from '../lib/get-auth-error-message';

export class AuthDal {
  public static async login(loginData: UserLoginDto): Promise<User | null> {
    try {
      const currentUser = await AuthService.signIn(loginData);
      return UsersDal.getUser(currentUser.uid);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const messageError = getAuthErrorMessage(error);
        toast.error(messageError);
      }

      return null;
    }
  }

  public static async register(
    registrationData: UserRegistrationDto,
  ): Promise<User | null> {
    try {
      const currentUser = await AuthService.signUp(registrationData);
      await UsersDal.createUser({
        id: currentUser.uid,
        email: registrationData.email,
        name: registrationData.name,
        taskIds: [],
      });

      return UsersDal.getUser(currentUser.uid);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const messageError = getAuthErrorMessage(error);
        toast.error(messageError);
      }

      return null;
    }
  }

  public static async logout(): Promise<void> {
    await AuthService.logout();
  }

  public static listenAuthStateChange(
    dispatch: Dispatch<UnknownAction>,
    onLoad: (value: boolean) => void,
  ) {
    const params = {
      onLogin: async (userId: string) => {
        onLoad(true);
        try {
          const user = await UsersDal.getUser(userId);
          dispatch(setUser(user));
        } catch {
          toast.error('Failed to load user data');
          dispatch(unsetUser());
        } finally {
          onLoad(false);
        }
      },
      onLogout: () => {
        onLoad(false);
        dispatch(unsetUser());
      },
    };

    AuthService.listenAuthStateChange(params);
  }
}
