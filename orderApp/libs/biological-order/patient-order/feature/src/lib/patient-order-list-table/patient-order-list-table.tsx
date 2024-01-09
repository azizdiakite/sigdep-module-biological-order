import { Encounter, Obs } from '@spbogui-openmrs/shared/model';
import { ColumnDef } from '@tanstack/react-table';
import { Button, Group, Text,Tooltip } from '@mantine/core';
import dayjs from 'dayjs';
import { IconChecks, IconClockHour7, IconEye, IconFileInvoice } from '@tabler/icons';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { CustomTable } from '@spbogui-openmrs/shared/ui';
import { Concepts } from '@spbogui-openmrs/shared/utils';

/* eslint-disable-next-line */
export interface PatientOrderListTableProps {
  orders: Encounter[];
}

const cols: ColumnDef<Encounter>[] = [
  {
    id: 'uuid',
    header: 'uuid',
    accessorFn: (data) => data.uuid,
  },
  {
    id: 'patient',
    header: 'patient',
    accessorFn: (data) => data.patient.uuid,
  },
 /* {
    id: 'names',
    header: 'Nom',
    accessorFn: (data) => data.patient.person.names[0].givenName + " "+  data.patient.person.names[0].familyName,
  },*/
  {
    id: 'orderDate',
    header: 'Date de prélèvement',
    accessorFn: (data) => data.encounterDatetime,
    cell: ({ getValue }) => {
      return (
        <Text style={{ textAlign: 'left' }} size={'sm'}>
          {!!getValue() && dayjs(getValue<Date>()).format('DD/MM/YYYY')}
        </Text>
      );
    },
  },
  {
    id: 'reason',
    header: 'Motif de la demande',
    accessorFn: (data) => data.obs.find((o) => o.concept.uuid === Concepts.REASON_FOR_VIRAL_LOAD_REQUEST),
    cell: ({ getValue }) => (
      <Text size={'sm'}>{getValue<string>() && getValue<Obs>().display.split(":",2)[1]}</Text>
    ),
  },
  {
    id: 'status',
    header: 'Statut de la demande',
    accessorFn: (data) => data.obs.find((o) => o.concept.uuid === Concepts.HIV_VIRAL_LOAD_TEST)?.value?"OK" :"NO",
    cell: ({ getValue }) => {
      const value = getValue<string>();
      if (value === "OK") {
        return <Text display={'flex'} > Réalisé  <IconChecks color={'green'} /> </Text>;
      } else {
        return <Text display={'flex'}> En cours <IconClockHour7 color={'orange'} /> </Text>;
      }
    }
    
  },
  // {
  //   id: 'statusDate',
  //   header: 'Date du statut',
  //   accessorFn: (data) => data.obs.find((o) => o.concept.uuid === '88b7988b-8904-4a20-9e18-604376ecc6db'),
  //   cell: ({ getValue }) => (
  //     <Text size={'sm'}>{getValue<string>() && getValue<Obs>().value}</Text>
  //   ),
  // },
  {
    id: 'preview',
    header: '',
    accessorFn: (data) => data.obs,
    cell: (data) => (
      <Group spacing={0} position="right">
        <Tooltip label='Consulter la demande'>
        <Link
          style={{ textDecoration: 'none' }}
          to={`/patient-order/${data.row.getValue(
            'patient'
          )}/display/${data.row.getValue('uuid')}`}
        >
          <Button color={'blue.7'}>
            <IconFileInvoice />
          </Button>
        </Link>
      </Tooltip>
    </Group>
    ),
  },
  {
    id: 'menu',
    header: '',
    cell: (data) => (
      <Group spacing={0} position="left">
          <Tooltip label='Résultat de la demande'>
          <Link
            style={{ textDecoration: 'none' }}
            to={`/patient-order/${data.row.getValue(
              'patient'
            )}/result/${data.row.getValue('uuid')}`}
          >
            <Button color={'green.7'}>
              <IconEye />
            </Button>
          </Link>
        </Tooltip>
      </Group>
    ),
  }
];

export function PatientOrderListTable({ orders }: PatientOrderListTableProps) {
  const data: Encounter[] = useMemo(() => orders, [orders]);
  const columns: ColumnDef<Encounter>[] = useMemo(() => [...cols], []);
  return (
    <div>
      <CustomTable
        pagination
        initialState={{
          columnVisibility: { uuid: false, patient: false },
        }}
        data={data}
        columns={columns}
        color={'cyan'}
        // searchable
      />
    </div>
  );
}
export default PatientOrderListTable;
