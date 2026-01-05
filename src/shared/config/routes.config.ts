export const routesPaths = {
  base: '',
  notFound: '404',

  // Public routes
  signIn: 'sign-in', // Deprecated
  signUp: 'sign-up', // Deprecated
  signInEmailLinkRequest: 'sign-in/email',
  signInEmailLink: 'sign-in/email-link',

  // Protected routes
  settings: 'settings',
  year: ':year',
  week: ':week',
} as const;
