import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import { appConfig } from './app.config';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

export const firebaseActionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: `${appConfig.appUrl}/sign-in/email-link`,
  // This must be true.
  handleCodeInApp: true,
  // The domain must be configured in Firebase Hosting and owned by the project.
  linkDomain: 'custom-domain.com',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDb = getFirestore(firebaseApp);
