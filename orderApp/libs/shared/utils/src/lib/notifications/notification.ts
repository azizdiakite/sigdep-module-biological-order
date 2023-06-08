import { showNotification } from '@mantine/notifications';
import { Encounter } from '@spbogui-openmrs/shared/model';
import { QueryObserverResult } from '@tanstack/react-query';
import dayjs from 'dayjs';

export const notification = (
  id: string,
  type: 'error' | 'success' | 'warning',
  message: string,
  title: string,
  autoClose = 5000
) => {
  return showNotification({
    id,
    onClose: () => console.log('unmounted'),
    autoClose,
    title,
    message,
    color: 'white',
    styles: (theme) => ({
      root: {
        backgroundColor:
          type === 'error'
            ? theme.colors.red[8]
            : type === 'success'
            ? theme.colors.green[8]
            : theme.colors.orange[8],
        borderColor:
          type === 'error'
            ? theme.colors.red[8]
            : type === 'success'
            ? theme.colors.green[8]
            : theme.colors.orange[8],

        '&::before': { backgroundColor: theme.white },
      },
      title: { color: theme.white, fontSize: theme.spacing.lg },
      description: { color: theme.white },
      closeButton: {
        color: theme.white,
        '&:hover': {
          backgroundColor:
            type === 'error'
              ? theme.colors.red[9]
              : type === 'warning'
              ? theme.colors.green[9]
              : theme.colors.orange[9],
        },
      },
    }),
  });
};

export const successNotification = (
  message: string,
  reFetch: () => Promise<QueryObserverResult<Encounter[], unknown>>,
  setLoaded: (loaded: boolean) => void
) => {
  notification(
    dayjs(new Date()).format('YYYY-MM-DD-HH-mm-ss'),
    'success',
    message,
    ''
  );
  reFetch().then(() => setLoaded);
};

export const errorNotification = (
  message: string,
  setLoaded: (loaded: boolean) => void
) => {
  notification(
    dayjs(new Date()).format('YYYY-MM-DD-HH-mm-ss'),
    'error',
    message,
    ''
  );
  setLoaded(true);
};
