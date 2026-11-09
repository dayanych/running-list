export const routesPaths = {
  base: '',
  notFound: '404',

  // Public routes
  guide: 'guide',
  privacy: 'privacy',
  signIn: 'sign-in',
  terms: 'terms',

  // Protected routes
  settings: 'settings',
  year: ':year',
  week: ':week',
} as const;
