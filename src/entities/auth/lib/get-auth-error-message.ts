import { FirebaseError } from 'firebase/app';

import { FirebaseAuthErrorCodes } from '../model/constants/firebase-error-codes.constant';

export const getAuthErrorMessage = (error: FirebaseError): string => {
  switch (error.code) {
    case FirebaseAuthErrorCodes.EMAIL_EXISTS:
      return 'Email already exists';
    case FirebaseAuthErrorCodes.WEAK_PASSWORD:
      return 'Password must be at least 6 characters long';
    case FirebaseAuthErrorCodes.QUOTA_EXCEEDED:
      return 'Quota exceeded';
    case FirebaseAuthErrorCodes.INVALID_EMAIL:
      return 'Invalid email';
    case FirebaseAuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
      return 'Invalid credential';
    case FirebaseAuthErrorCodes.INVALID_PASSWORD:
      return 'Invalid password';
    default:
      return error.message;
  }
};
