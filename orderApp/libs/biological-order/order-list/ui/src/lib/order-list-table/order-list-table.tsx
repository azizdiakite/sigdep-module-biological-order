/* eslint-disable @typescript-eslint/no-explicit-any */
import { Group, Text, Button, Badge } from '@mantine/core';
import { Encounter, Obs ,Provider} from '@spbogui-openmrs/shared/model';
import { CustomTable } from '@spbogui-openmrs/shared/ui';
import { IconEye } from '@tabler/icons';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ColumnDef, FilterFn, Row } from '@tanstack/react-table';
import { EncounterRole ,Concepts, FulfillerStatus,} from '@spbogui-openmrs/shared/utils';

/* eslint-disable-next-line */
export interface OrderListTableProps {
  orders: Encounter[];
}

const cols: ColumnDef<Encounter>[] = [
  {
    id: 'uuid',
    header: 'uuid',
    accessorFn: (data) => data?.uuid,
  },
  {
    id: 'patient',
    header: 'patient',
    accessorFn: (data) => data?.patient?.uuid,
  },
  {
    id: 'names',
    header: 'Nom',
    accessorFn: (data) => data?.patient?.person?.names[0]?.givenName + " "+  data?.patient?.person?.names[0]?.familyName,
  },
  {
    id: 'identifier',
    header: 'Numéro du patient',
    accessorFn: (data) => data?.patient?.identifiers[0]?.identifier,
  },
  {
    id: 'orderDate',
    header: 'Date de la demande',
    accessorFn: (data) => data?.encounterDatetime,
    cell: ({ getValue }) => {
      return (
        <Text style={{ textAlign: 'left' }} size={'sm'}>
         {dayjs(getValue<Date>()).format('DD/MM/YYYY')}
        </Text>
      );
    },
  },
 {
    id: 'createDate',
    header: 'Date de creation',
    accessorFn: (data) => data?.dateCreated,
    cell: ({ getValue }) => {
      return (
        <Text style={{ textAlign: 'left' }} size={'sm'}>
          {!!getValue() && dayjs(getValue<Date>()).format('DD/MM/YYYY HH:mm')}
        </Text>
      );
    },
  },
  {
    id: 'status',
    header: 'Statut de la demande',
    filterFn: 'equals', // Vous pouvez personnaliser cela si nécessaire
    accessorFn: (data ) => (      
      data?.orders[0]?.fulfillerStatus === FulfillerStatus.EXCEPTION && data?.orders[0]?.fulfillerComment == FulfillerStatus.DECLINED
      ? 'Échec d\'envoi'
      : data?.orders[0]?.fulfillerStatus === FulfillerStatus.EXCEPTION && data?.orders[0]?.fulfillerComment !== FulfillerStatus.CANCELLED
      ? 'Rejeté'
      : data?.orders[0]?.fulfillerStatus === FulfillerStatus.EXCEPTION && data?.orders[0]?.fulfillerComment === FulfillerStatus.CANCELLED
      ? 'Annulé'
      : data?.orders[0]?.fulfillerStatus === FulfillerStatus.IN_PROGRESS && data?.orders[0]?.fulfillerComment === FulfillerStatus.INPROGRESS
      ? 'En cours'
      : data?.orders[0]?.fulfillerStatus === FulfillerStatus.RECEIVED && data?.orders[0]?.fulfillerComment === FulfillerStatus.ACCEPTED
      ? 'Reçu au labo'
      : data?.orders[0]?.fulfillerStatus === FulfillerStatus.RECEIVED && data?.orders[0]?.fulfillerComment === FulfillerStatus.REQUESTED
      ? 'Envoyé'
      : data?.orders[0]?.fulfillerStatus === FulfillerStatus.COMPLETED
      ? 'Réalisé'
      : 'Envoi en cours'
    ),

    cell: ({ getValue }) => {
      const status = getValue<string>();
      const colorMap: Record<string, string> = {
        'Échec d\'envoi':    'red',
        'Envoi en cours':'yellow',
        'Envoyé':        'blue',
        'Reçu au labo':  'cyan',
        'En cours':      'orange',
        'Réalisé':       'green',
        'Rejeté':        'red',
        'Annulé':        'dark',
      };
      return (
        <Badge color={colorMap[status] ?? 'gray'} variant="filled" size="sm">
          {status}
        </Badge>
      );
    },
  },
  {
    id: 'provider',
    header: 'Prescripteur',
    accessorFn: (data) => data?.encounterProviders.find((e) => e.encounterRole.uuid === EncounterRole.CLINICIAN)?.provider,
    cell: ({ getValue }) => (
      <Text size={'sm'}>{getValue<string>() && getValue<Provider>()?.person?.names[0]?.familyName} {getValue<string>() && getValue<Provider>()?.person?.names[0]?.givenName}</Text>
    ),
  },
  {
    id: 'menu',
    header: 'Action',
    size: 60,
    cell: (data) => (
      <Group spacing={0} position="center">
        <Link
          style={{ textDecoration: 'none' }}
          to={`/patient-order/${data.row.getValue(
            'patient'
          )}/result/${data.row.getValue('uuid')}`}
        >
          <Button size="xs" compact px={6}>
            <IconEye size={14} />
          </Button>
        </Link>
      </Group>
    ),
  },
];


export function OrderListTable({ orders }: OrderListTableProps) {
  const data: Encounter[] = useMemo(() =>
    [...orders].sort((a, b) => new Date(b?.dateCreated).getTime() - new Date(a?.dateCreated).getTime()),
    [orders]
  );
  const columns: ColumnDef<Encounter>[] = useMemo(() => [...cols], []);
  // const tableHooks = (hooks: any) => {
  //   hooks.visibleColumns.push((columns: any) => [
  //     ...columns,
  //     {
  //       id: 'menu',
  //       Header: '',
  //       with: 10,
  //       maxWidth: 10,
  //       Cell: ({ row }: CellValue) => (
  //         <Group spacing={0} position="right">
  //           <ActionIcon color={'green'}>
  //             <Link
  //               style={{ textDecoration: 'none' }}
  //               to={`/patient-order/${row.values.patient}/result/${row.values.uuid}`}
  //             >
  //               <IconEye />
  //             </Link>
  //           </ActionIcon>
  //           {/* <ActionIcon>
  //             <IconSearch />
  //           </ActionIcon> */}
  //         </Group>
  //       ),
  //     },
  //   ]);
  // };
  return (
    <div id='overflowIdFDUli' style={{ fontSize: '12px' }}>
      <CustomTable
        pagination
        initialState={{
          columnVisibility: { uuid: false, patient: false },
        }}
        data={data}
        columns={columns}
        color={'gray'}
        searchable
      />
    </div>
  );
}

export default OrderListTable;
