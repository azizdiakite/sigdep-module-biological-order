// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { Route, Routes, Link } from 'react-router-dom';

import { BiologicalOrderOrderListFeature } from '@spbogui-openmrs/biological-order/order-list/feature';

import { BiologicalOrderPatientOrderFeature } from '@spbogui-openmrs/biological-order/patient-order//feature';
import { Paper, Text, useMantineTheme, Badge } from '@mantine/core';

export function App() {
  const theme = useMantineTheme();
  return (
    <>
      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <Paper
        radius={0}
        withBorder
        p={'xs'}
        style={{ backgroundColor: theme.colors.cyan[1] }}
        mb={'xs'}
      >
        <Text
          weight={'bold'}
          transform={'uppercase'}
          color={'cyan.9'}
          size={'xl'}
        >
          Demande d'examens biologiques
        </Text>
      </Paper>
      <Routes>
        <Route
          path="/patient-order/:patientId/*"
          element={<BiologicalOrderPatientOrderFeature />}
        />
        <Route path="/" element={<BiologicalOrderOrderListFeature />} />
      </Routes>
      <Badge color="blue"> v1.0.1</Badge>
      {/* END: routes */}
    </>
  );
}

export default App;
