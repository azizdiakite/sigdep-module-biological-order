import { Container, Divider, Group, Loader, Paper, Text } from '@mantine/core';
import { useInputState } from '@mantine/hooks';
import { Encounter } from '@spbogui-openmrs/shared/model';
import { useFindPatientByIdentifier } from '@spbogui-openmrs/shared/ui';
import { useEffect, useState } from 'react';
import OrderListFilterForm from './order-list-filter-form/order-list-filter-form';
import OrderListTable from './order-list-table/order-list-table';
import PatientSearchForm from './patient-search-form/patient-search-form';

/* eslint-disable-next-line */
export interface BiologicalOrderOrderListUiProps {
  orders: Encounter[];
  setFilterList: (startDate: Date, endDate: Date) => void;
  setIdentifier: (identifier: string) => void;
  setParams: (params: string) => void;
  setStartDate : (startDate : string) => void;
  setEndDate : (endDate : string) => void;
  patientId?: string;
}

export function BiologicalOrderOrderListUi({
  orders,
  // setIdentifier,
  setStartDate ,
  setEndDate ,
  setFilterList,
  patientId,
  setParams,
}: BiologicalOrderOrderListUiProps) {
  const [identifier, setIdentifier] = useState<string>('');
  const { patient, getPatient, isLoading } = useFindPatientByIdentifier(
    identifier,
    'full'
  );

  // console.log(isLoading);

  useEffect(() => {
    if (identifier !== '') {
      console.log('loading patient');
      getPatient().then(() => {
        if (patient) {
          // setFound(true);
          console.log(patient);
        }
      });
    }
  }, [getPatient, identifier, patient]);

  console.log(identifier);

  return (
    <div>
      <Container size={'xl'}>
        <Paper
          withBorder
          py={'xs'}
          sx={(theme) => ({ backgroundColor: theme.colors.gray[0] })}
        >
          <Group position="apart" mx={'xs'}>
            <Text
              size={'lg'}
              transform={'uppercase'}
              weight={'bold'}
              color={'cyan.7'}
            >
              Liste des demandes d'examen
            </Text>
            <PatientSearchForm
              setIdentifier={setIdentifier}
              isLoading={isLoading}
              patientId={patient && patient.uuid}
            />
          </Group>
          <Divider my={'xs'} />
          <Paper withBorder m={'xs'}>
            <OrderListFilterForm setParams={setParams} setStartDate={setStartDate} setEndDate={setEndDate} />
            <OrderListTable orders={orders} />
          </Paper>
        </Paper>
      </Container>
    </div>
  );
}

export default BiologicalOrderOrderListUi;
