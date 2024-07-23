import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';

import { firebaseApp } from '@/shared/config/firebase.config';

import { UserRegistrationDto } from './dto/user-login.dto';
import { UserLoginDto } from './dto/user-registration.dto';

interface ListenAuthStateChangeParams {
  onLogin: (userId: string) => void;
  onLogout: () => void;
}

const auth = getAuth(firebaseApp);

export class AuthService {
  static signUp = async ({
    email,
    password,
  }: UserRegistrationDto): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    return userCredential.user;
  };

  static signIn = async ({ email, password }: UserLoginDto): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    return userCredential.user;
  };

  static logout = async (): Promise<void> => {
    await auth.signOut();
  };

  static listenAuthStateChange(params: ListenAuthStateChangeParams) {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        params.onLogout();
      } else {
        params.onLogin(user.uid);
      }
    });
  }
}
