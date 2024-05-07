/* eslint-disable @typescript-eslint/no-explicit-any */
import { Group, Text, Button ,Space } from '@mantine/core';
import { Encounter, Obs ,Provider} from '@spbogui-openmrs/shared/model';
import { CustomTable } from '@spbogui-openmrs/shared/ui';
import { IconEye } from '@tabler/icons';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { EncounterRole ,Concepts, FulfillerStatus,} from '@spbogui-openmrs/shared/utils';

/* eslint-disable-next-line */
export interface OrderListTableProps {
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
  {
    id: 'names',
    header: 'Nom',
    accessorFn: (data) => data.patient.person.names[0].givenName + " "+  data.patient.person.names[0].familyName,
  },
  {
    id: 'identifier',
    header: 'Numéro du patient',
    accessorFn: (data) => data.patient.identifiers[0]?.identifier,
  },
  {
    id: 'orderDate',
    header: 'Date de la demande',
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
    id: 'status',
    header: 'Statut de la demande',
    //accessorFn: (data) => (data?.orders[0]?.fulfillerStatus == EXCEPTION) && (data?.orders[0]?.accessionNumber == "") ? 'Réjeté' : (data.obs.find((o) => o.concept.uuid === Concepts.GROSS_HIV_VIRAL_LOAD)?.value?"Réalisé" :"En cours"),
    accessorFn: (data ) => (
      data?.orders[0]?.fulfillerStatus === FulfillerStatus.EXCEPTION && data?.orders[0]?.fulfillerComment !== FulfillerStatus.CANCELLED
      ? 'Réjeté'
      : data?.orders[0]?.fulfillerStatus === FulfillerStatus.EXCEPTION && data?.orders[0]?.fulfillerComment === FulfillerStatus.CANCELLED
      ? 'Annuler'
      : data?.orders[0]?.fulfillerStatus === FulfillerStatus.RECEIVED
      ? 'En cours'
      : data?.orders[0]?.fulfillerStatus === FulfillerStatus.COMPLETED
      ? 'Réalisé'
      : 'Non soumis'
    ),

    // cell: ({ getValue }) => (
    //   <Text size={'sm'}>{ getValue<Obs>().value?"Completed":"In Progress" }</Text>
    // ),
  },
  {
    id: 'regime',
    header: 'Regime',
    accessorFn: (data) => data.obs.find((o) => o.concept.uuid === Concepts.ARV_REGIMEN)?.display,
    // cell: ({ getValue }) => (
    //   <Text size={'sm'}>{ getValue<Obs>().value?"Completed":"In Progress" }</Text>
    // ),
  },
  {
    id: 'provider',
    header: 'Prescripteur',
    accessorFn: (data) => data.encounterProviders.find((e) => e.encounterRole.uuid === EncounterRole.CLINICIAN)?.provider,
    cell: ({ getValue }) => (
      <Text size={'sm'}>{getValue<string>() && getValue<Provider>().person.names[0].familyName} {getValue<string>() && getValue<Provider>().person.names[0].givenName}</Text>
    ),
  },
  {
    id: 'menu',
    header: 'Action',
    cell: (data) => (
      <Group spacing={0} position="right">
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
      </Group>
    ),
  },
];

export function OrderListTable({ orders }: OrderListTableProps) {
  const data: Encounter[] = useMemo(() => orders, [orders]);
  const columns: ColumnDef<Encounter>[] = useMemo(() => [...cols], []);

  async function getEncountersSortedByDateDesc(encounters:Encounter[]): Promise<any[]> {
    return encounters.sort((a, b) => {
        const dateA = new Date(a.encounterDatetime).getTime();
        const dateB = new Date(b.encounterDatetime).getTime();
        return dateB - dateA;
    });
}

 getEncountersSortedByDateDesc(data)
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
    <div>
      <CustomTable
        pagination
        initialState={{
          columnVisibility: { uuid: false, patient: false },
        }}
        data={data}
        columns={columns}
        color={'cyan'}
        searchable
      />
    </div>
  );
}

export default OrderListTable;
