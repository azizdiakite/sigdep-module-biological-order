import * as ReactDOM from 'react-dom/client';

import App from './app/app';

import { BrowserRouter, HashRouter } from 'react-router-dom';
import { NotificationsProvider } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createEmotionCache, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

createEmotionCache({ key: 'mantine' });

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <QueryClientProvider client={queryClient}>
    <MantineProvider withCSSVariables withGlobalStyles>
      <ModalsProvider>
        <NotificationsProvider position="top-right" zIndex={2077}>
          <HashRouter>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
          </HashRouter>
        </NotificationsProvider>
      </ModalsProvider>
    </MantineProvider>
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
  </QueryClientProvider>
);
