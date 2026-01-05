const EMAIL_LINK_STORAGE_KEY = 'emailForSignIn';

export const saveEmailForSignIn = (email: string) => {
  localStorage.setItem(EMAIL_LINK_STORAGE_KEY, email);
};

export const getEmailForSignIn = (): string | null => {
  return localStorage.getItem(EMAIL_LINK_STORAGE_KEY);
};

export const clearEmailForSignIn = () => {
  localStorage.removeItem(EMAIL_LINK_STORAGE_KEY);
};
