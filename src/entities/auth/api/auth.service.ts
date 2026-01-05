import {
  createUserWithEmailAndPassword,
  getAuth,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  User,
} from 'firebase/auth';

import { firebaseActionCodeSettings, firebaseApp } from '@/shared/config';

import { UserLoginDto, UserRegistrationDto } from './';

interface ListenAuthStateChangeParams {
  onLogin: (userId: string) => void;
  onLogout: () => void;
}

const auth = getAuth(firebaseApp);

export class AuthService {
  /** Depricated. Use sendEmailLink instead */
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

  /** Depricated. Use sendEmailLink instead */
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

  static sendEmailLink = async (email: string): Promise<void> => {
    await sendSignInLinkToEmail(auth, email, firebaseActionCodeSettings);
  };

  static isEmailLink = (link: string): boolean => {
    return isSignInWithEmailLink(auth, link);
  };

  static signInWithEmailLink = async (
    email: string,
    link: string,
  ): Promise<User> => {
    const result = await signInWithEmailLink(auth, email, link);
    return result.user;
  };
}
