import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AuthDal } from '@/entities/auth';
import { unsetUser } from '@/entities/user';

/** Coordinates session and account deletion actions on the settings page */
export const useSettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

  const { mutate: logout, isPending: isLogoutPending } = useMutation({
    mutationKey: ['logout'],
    mutationFn: () => AuthDal.logout(),
  });
  const { mutate: deleteAccount, isPending: isDeletePending } = useMutation({
    mutationKey: ['delete-account'],
    mutationFn: () => AuthDal.deleteAccount(),
    onSuccess: (wasDeleted) => {
      if (!wasDeleted) return;

      dispatch(unsetUser());
      navigate('/', { replace: true });
    },
  });

  const toggleDeleteConfirmation = () => {
    setIsDeleteConfirmationOpen((isOpen) => !isOpen);
  };
  const closeDeleteConfirmation = () => {
    setIsDeleteConfirmationOpen(false);
  };

  return {
    closeDeleteConfirmation,
    deleteAccount,
    isDeleteConfirmationOpen,
    isDeletePending,
    isLogoutPending,
    logout,
    toggleDeleteConfirmation,
  };
};
