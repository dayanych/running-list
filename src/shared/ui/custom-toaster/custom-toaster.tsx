import { ToastBar, Toaster } from 'react-hot-toast';

export const CustomToaster = () => {
  return (
    <Toaster
      toastOptions={{
        loading: {
          style: {
            background: '#363636',
            color: '#fff',
          },
        },
        success: {
          duration: 4000,
          iconTheme: {
            primary: '#fff',
            secondary: '#16a34a',
          },
          style: {
            background: '#16a34a',
            color: '#fff',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
          },
          style: {
            background: '#ef4444',
            color: '#fff',
          },
        },
      }}
    >
      {(toast) =>
        toast.message ? (
          <ToastBar toast={toast}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
              </>
            )}
          </ToastBar>
        ) : (
          <></>
        )
      }
    </Toaster>
  );
};
