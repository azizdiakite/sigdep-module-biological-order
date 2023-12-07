import {
  Button,
  Divider,
  Grid,
  Group,
  Paper,
  Select,
  Text,
  Alert
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useInputState } from '@mantine/hooks';
import { BiologicalOrderPatientOrderUiOrderForm } from '@spbogui-openmrs/biological-order/patient-order/ui/order-form';
import { BiologicalOrderPatientOrderUiOrderPrint } from '@spbogui-openmrs/biological-order/patient-order/ui/order-print';
import { BiologicalOrderPatientOrderUiOrderResult } from '@spbogui-openmrs/biological-order/patient-order/ui/order-result';
import { BiologicalOrderPatientOrderUiPatientHome } from '@spbogui-openmrs/biological-order/patient-order/ui/patient-home';
import {
  useFindFilteredEncounter,
  useFindAllEncounters,
  useFindOnePatient,
} from '@spbogui-openmrs/shared/ui';
import {
  Concepts,
  customEncounterParams,
  EncounterType,
} from '@spbogui-openmrs/shared/utils';
import { IconCalendar, IconList, IconPlus, IconPrinter } from '@tabler/icons';
import invariant from 'invariant';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import PatientOrderListTable from './patient-order-list-table/patient-order-list-table';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import ReactToPrint from "react-to-print";

/* eslint-disable-next-line */
export interface BiologicalOrderPatientOrderFeatureProps {}

export function BiologicalOrderPatientOrderFeature(
  props: BiologicalOrderPatientOrderFeatureProps
) {
  const { patientId } = useParams();
  invariant(patientId, '');


  const [requestDate, setRequestDate] = useInputState<Date | undefined>(
    undefined
  );

  const { patient } = useFindOnePatient(patientId, 'full', true);
  //const {encounters } = useFindAllEncounters(EncounterType.REQUEST_EXAM ,"2010-01-01" ,"9999-12-12" ,customEncounterParams ,'100' ,true)
  const {encounter } = useFindFilteredEncounter(patientId ,EncounterType.REQUEST_EXAM ,customEncounterParams ,'' ,'' ,true);
  const lastResult = encounter[0]?.obs.find((o) => o.concept.uuid === Concepts.HIV_VIRAL_LOAD_TEST);
  const lastResultIsAvailable = (lastResult !== undefined && encounter.length > 0) || (lastResult === undefined && encounter.length === 0);
  //const lastResultIsAvailable = true;
  


  // const { encounter: latestCd4 } = useFindFilteredEncounter(
  //   patientId,
  //   EncounterType.BIOLOGICAL_EXAM,
  //   customEncounterParams,
  //   'concept=',
  //   '2',
  //   true
  // );

  // const { encounter: latestVisit } = useFindFilteredEncounter(
  //   patientId,
  //   EncounterType.FOLLOWUP_VISIT,
  //   customEncounterParams,
  //   '',
  //   '1',
  //   true
  // );

  // const { encounter: latestEnrollment } = useFindFilteredEncounter(
  //   patientId,
  //   EncounterType.ENROLLMENT,
  //   customEncounterParams,
  //   '',
  //   '1',
  //   true
  // );
 
  return (  
    <Paper
      withBorder
      m={'xs'}
      sx={(theme) => ({ backgroundColor: theme.colors.gray[0] })}
    >
      <Group p="xs" position="apart">
        <Text
          size={'lg'}
          weight={'bold'}
          color={'cyan.7'}
          transform={'uppercase'}
        >
          Demande d'examen du patient
        </Text>
        <Link to={'/'}>
          <Button leftIcon={<IconList />} color={'gray'}>
            Retourner à la liste
          </Button>
        </Link>
      </Group>
      <Divider />
      <Group p={'xs'} position={'apart'}>
        <Group>
          <Text> Numéro du patient : </Text>
          <Text size={'lg'} color={'cyan'} weight={'bold'}>
            {patient && patient.identifiers[0].identifier}
          </Text>
        </Group>

        {lastResultIsAvailable ? (
                <Group>
                {/* <Select data={[]} /> */}
                <DatePicker
                  icon={<IconCalendar />}
                  placeholder={'Date de demande'}
                  onChange={setRequestDate}
                  inputFormat={'DD/MM/YYYY'}
                  locale={'fr'}
                  maxDate={new Date()}
                  minDate={dayjs(new Date()).subtract(7, 'day').toDate()}/>
                <Link to={'form'}>
                  <Button
                    leftIcon={<IconPlus />}
                    color={'cyan'}
                    disabled={!requestDate}
                  >
                    Nouvelle demande
                  </Button>
                </Link>
                <ReactToPrint
                trigger={() =>  <Button
                  leftIcon={<IconPrinter />}
                  color={'cyan'}
                  disabled={!requestDate}
                >
                  Imprimer fiche de demande
                </Button>}
                content={() =>  document.getElementById('print')!
              }
              />
              </Group>
        ): ( 
           <Alert color="red" title="ATTENTION !!!!">
            Une nouvelle demande ne peut etre effectuée car le resultat precedent n'est pas encore disponible...
         </Alert>)}
  

      </Group>
      <Divider />
      <Grid>
        <Grid.Col span={5} p={'xs'}>
          <Paper withBorder p={'xs'}>
            <Paper withBorder>
              <Text
                p={'xs'}
                // size={'xs'}
                // transform={'uppercase'}
                color={'cyan'}
                weight={'bolder'}
              >
                Liste des demandes du patient
              </Text>
              <Divider mb={'xs'} />
              <PatientOrderListTable orders={encounter} />
            </Paper>
          </Paper>
        </Grid.Col>
        <Grid.Col span={7} p={'xs'}>
          <Paper withBorder p={'xs'}>
            <Routes>
              <Route
                path="form"
                element={
                  <BiologicalOrderPatientOrderUiOrderForm
                    patient={patient}
                    requestDate={requestDate}
                  />
                }
              />
              <Route
                path="result/:requestId"
                element={<BiologicalOrderPatientOrderUiOrderResult />}
              />
              <Route
                path="print"
                element={
                  <BiologicalOrderPatientOrderUiOrderPrint patient={patient} />
                }
              />
              <Route
                path=""
                element={<BiologicalOrderPatientOrderUiPatientHome latestOrder={encounter[0]}/>}
              />
            </Routes>
          </Paper>
        </Grid.Col>
      </Grid>
    </Paper>
  );
}

export default BiologicalOrderPatientOrderFeature;
