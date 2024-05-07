import { Alert, Center, Divider, Paper, Table, Text } from '@mantine/core';
import { Encounter, Order, Patient } from '@spbogui-openmrs/shared/model';
import { IconHome } from '@tabler/icons';
import dayjs from 'dayjs';
import { Concepts } from '@spbogui-openmrs/shared/utils';

/* eslint-disable-next-line */
export interface BiologicalOrderPatientOrderUiPatientHomeProps {
  patient?: Patient;
  biologicalExams?: Encounter[];
  latestFollowup?: Encounter;
  latestOrder?: Encounter;
}

export function BiologicalOrderPatientOrderUiPatientHome({
  patient,
  biologicalExams,
  latestFollowup,
  latestOrder,
}: BiologicalOrderPatientOrderUiPatientHomeProps) {
  return (
    <Paper withBorder>
      <Text
        // size={'md'}
        color={'cyan.7'}
        weight={'bold'}
        transform={'uppercase'}
        p={'xs'}
      >
        <IconHome />
      </Text>
      <Divider mb={'xs'} />
      <Paper p={'xs'} m={'xs'} withBorder>
        <Text color={'cyan.7'}>Dernière demande de charge virale</Text>
        <Divider color={'cyan.7'} />

        {latestOrder?.orders[0]? (
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Statut</th>
                <th>Numéro de commande</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{dayjs(latestOrder.orders[0].dateActivated).format('DD/MM/YYYY')}</td>
                <td>{latestOrder.obs.find((o) => o.concept.uuid === Concepts.GROSS_HIV_VIRAL_LOAD)?.value?"Réalisé" :"En cours"}</td>
                <td>{latestOrder.orders[0].orderNumber}</td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <Alert>
            <Center>
              <Text>
                Aucune demande de charge virale a ce jour pour ce patient
              </Text>
            </Center>
          </Alert>
        )}
      </Paper>
      {/* {JSON.stringify(latestOrder)} */}
    </Paper>
  );
}

export default BiologicalOrderPatientOrderUiPatientHome;
