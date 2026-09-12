import * as React from 'react';

import type { ToastProps } from './toast';

const TOAST_LIMIT = 3;

/** Grace period between closing a toast and dropping it from the store */
const TOAST_REMOVE_DELAY = 400;

type ToasterToast = ToastProps & {
  id: string;
  description: React.ReactNode;
};

type Action =
  | { type: 'ADD_TOAST'; toast: ToasterToast }
  | { type: 'DISMISS_TOAST'; toastId?: string }
  | { type: 'REMOVE_TOAST'; toastId?: string };

interface State {
  toasts: ToasterToast[];
}

let count = 0;

const genId = () => {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
};

const listeners: Array<(state: State) => void> = [];
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

let memoryState: State = { toasts: [] };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case 'DISMISS_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((toast) =>
          action.toastId === undefined || toast.id === action.toastId
            ? { ...toast, open: false }
            : toast,
        ),
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts:
          action.toastId === undefined
            ? []
            : state.toasts.filter((toast) => toast.id !== action.toastId),
      };
  }
};

const dispatch = (action: Action) => {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
};

/**
 * Schedules removal of a closed toast once its exit animation has finished
 *
 * @param toastId - Id of the toast to drop from the store
 */
const queueRemoval = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({ type: 'REMOVE_TOAST', toastId });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

/**
 * Closes one toast, or every toast when no id is given, and schedules removal
 *
 * Every dismissal path funnels through here: Radix does not fire `onOpenChange`
 * when the controlled `open` prop changes, so a programmatic dismiss would
 * otherwise leave the record in the store forever
 *
 * @param toastId - Id of the toast to close, or undefined to close all of them
 */
const dismissToast = (toastId?: string) => {
  const targets = toastId
    ? [toastId]
    : memoryState.toasts.map((toast) => toast.id);

  targets.forEach(queueRemoval);
  dispatch({ type: 'DISMISS_TOAST', toastId });
};

/**
 * Pushes a toast onto the shared store
 *
 * Lives outside React so that data access layers and query callbacks can
 * report to the user without holding a component reference
 *
 * @param props - Toast content and presentation options
 * @returns The toast id together with a callback that closes it early
 */
const toast = (props: Omit<ToasterToast, 'id'>) => {
  const id = genId();

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismissToast(id);
      },
    },
  });

  return { id, dismiss: () => dismissToast(id) };
};

/**
 * Subscribes a component to the toast store
 *
 * @returns The visible toasts and a callback that closes one or all of them
 */
const useToast = () => {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);

    return () => {
      const index = listeners.indexOf(setState);

      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return { ...state, dismiss: dismissToast };
};

export { toast, type ToasterToast, useToast };
