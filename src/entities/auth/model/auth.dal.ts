import { UnknownAction } from '@reduxjs/toolkit';
import { Dispatch } from 'react';

import { setUser, unsetUser, UsersDal } from '@/entities/user';
import { notify } from '@/shared/ui/toaster/notify';

import { AuthService } from '../api/auth.service';
import { runAccountDeletion } from './lib/delete-account';

export class AuthDal {
  public static async logout(): Promise<void> {
    try {
      await AuthService.logout();
    } catch {
      notify.error('Could not log out. Try again later');
    }
  }

  /** Permanently deletes the current account and clears its browser session */
  public static async deleteAccount(): Promise<boolean> {
    try {
      await runAccountDeletion({
        deleteAccount: AuthService.deleteAccount,
        clearLocalSession: AuthService.clearLocalSession,
      });
      return true;
    } catch {
      notify.error('Could not delete your account. Try again later');
      return false;
    }
  }

  public static listenAuthStateChange(
    dispatch: Dispatch<UnknownAction>,
    onLoad: (value: boolean) => void,
  ) {
    let authRevision = 0;
    let profileLoadTimer: number | undefined;

    /**
     * Loads a profile outside the synchronous Supabase auth callback
     *
     * @param userId - Authenticated user identifier
     * @param revision - Auth revision that started the request
     */
    const loadUserProfile = async (userId: string, revision: number) => {
      try {
        const user = await UsersDal.getUser(userId);

        if (!user) throw new Error('User profile was not found');
        if (revision !== authRevision) return;

        dispatch(setUser(user));
      } catch {
        if (revision !== authRevision) return;

        notify.error('Could not load your account. Try reloading the page');
        dispatch(unsetUser());
      } finally {
        if (revision === authRevision) onLoad(false);
      }
    };

    const unsubscribe = AuthService.listenAuthStateChange({
      onLogin: (supabaseUser) => {
        const revision = ++authRevision;
        onLoad(true);
        window.clearTimeout(profileLoadTimer);
        profileLoadTimer = window.setTimeout(() => {
          void loadUserProfile(supabaseUser.id, revision);
        }, 0);
      },
      onLogout: () => {
        authRevision += 1;
        window.clearTimeout(profileLoadTimer);
        dispatch(unsetUser());
        onLoad(false);
      },
    });

    return () => {
      authRevision += 1;
      window.clearTimeout(profileLoadTimer);
      unsubscribe();
    };
  }

  /**
   * Starts the Google sign-in redirect
   *
   * @returns Whether the browser is leaving for Google
   */
  public static async signInWithGoogle(): Promise<boolean> {
    try {
      await AuthService.signInWithGoogle();
      return true;
    } catch {
      notify.error('Could not sign in with Google. Try again later');
      return false;
    }
  }
}
