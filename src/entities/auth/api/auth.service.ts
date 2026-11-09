import type { User } from '@supabase/supabase-js';

import { supabase } from '@/shared/config';

interface ListenAuthStateChangeParams {
  onLogin: (user: User) => void;
  onLogout: () => void;
}

export class AuthService {
  static logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  /** Permanently deletes the authenticated account through the server */
  static deleteAccount = async (): Promise<void> => {
    const { error } = await supabase.functions.invoke('delete-account');
    if (error) throw error;
  };

  /** Removes the deleted account session from this browser */
  static clearLocalSession = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) throw error;
  };

  /**
   * Subscribes to session changes, including the initial session
   *
   * @param params - Handlers for a signed-in user and for a sign-out
   * @returns Function that removes the subscription
   */
  static listenAuthStateChange(params: ListenAuthStateChangeParams) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      // A refreshed token belongs to the same user, so there is nothing to reload
      if (event === 'TOKEN_REFRESHED') return;

      if (session) {
        params.onLogin(session.user);
      } else {
        params.onLogout();
      }
    });

    return () => data.subscription.unsubscribe();
  }

  /**
   * Sends the browser to Google; the session arrives through
   * listenAuthStateChange after Supabase redirects back to the app
   */
  static signInWithGoogle = async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: { prompt: 'select_account' },
      },
    });
    if (error) throw error;
  };
}
