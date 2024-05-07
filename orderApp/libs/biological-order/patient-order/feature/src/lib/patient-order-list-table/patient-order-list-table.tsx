import { Encounter, Obs } from '@spbogui-openmrs/shared/model';
import { ColumnDef } from '@tanstack/react-table';
import { Button, Group, Text,Tooltip } from '@mantine/core';
import dayjs from 'dayjs';
import { IconChecks, IconClockHour7, IconEye, IconFileInvoice, IconTrash } from '@tabler/icons';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { CustomTable, useRemoveEncounter } from '@spbogui-openmrs/shared/ui';
import { Concepts, FulfillerStatus, notification } from '@spbogui-openmrs/shared/utils';
import { openConfirmModal } from '@mantine/modals';
import { EncounterService } from '@spbogui-openmrs/shared/service';

/* eslint-disable-next-line */
export interface PatientOrderListTableProps {
  orders: Encounter[];
}
const openModal = (id : string ) => openConfirmModal({
  title: 'Confirmation',
  centered: false,
  confirmProps: {color : 'red'},
  children: (
    <Text size="sm">
      Etes vous sur de vouloir supprimer cet enregistrement ?
    </Text>
  ),
  labels: { confirm: 'Confirmer', cancel: 'Annuler' },
  onCancel: () => console.log({'Cancel': id}),
  onConfirm() {

  },
});

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
    accessorFn: (data) => (
      data?.orders[0]?.fulfillerStatus === FulfillerStatus.EXCEPTION && data?.orders[0]?.fulfillerComment !== FulfillerStatus.CANCELLED
      ? 'rejected'
      : data?.orders[0]?.fulfillerStatus === FulfillerStatus.EXCEPTION && data?.orders[0]?.fulfillerComment === FulfillerStatus.CANCELLED
      ? 'cancelled'
      : data?.orders[0]?.fulfillerStatus === FulfillerStatus.RECEIVED
      ? 'progress'
      : data?.orders[0]?.fulfillerStatus === FulfillerStatus.COMPLETED
      ? 'realised'
      : 'unsend'
    ),
    cell: ({ getValue }) => {
      const value = getValue<string>();
      if (value === "realised") {
        return <Text display={'flex'} > Réalisé  <IconChecks color={'green'} />  </Text>;
      } else if(value === "rejected"){
        return <Text display={'flex'}> Rejété <IconTrash color={'red'} /> </Text>;
      }else if(value === "progress") {
        return <Text display={'flex'}> En cours <IconClockHour7 color={'orange'} /> </Text>;
      }else if(value === "cancelled") {
        return <Text display={'flex'}> Annuler <IconClockHour7 color={'orange'} /> </Text>;
      }else{
        return <Text display={'flex'}> Non soumis <IconClockHour7 color={'red'} /> </Text>;
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
  },
 /* {
    id: 'delete',
    header: '',
    accessorFn: (data) =>{
      console.log({data : data});
      
      return data?.orders[0]?.fulfillerStatus === FulfillerStatus.EXCEPTION
      ? {status: 'rejected', uuid: data?.uuid}
      : data?.orders[0]?.fulfillerStatus === FulfillerStatus.RECEIVED
      ? {status: 'progress', uuid: data?.uuid}
      : (data?.orders[0]?.fulfillerStatus === FulfillerStatus.COMPLETED)
      ? {status: 'realised', uuid: data?.uuid}
      : {status: 'unsend', uuid: data?.uuid}
    },
    cell: ( {getValue }) => {
      const value = getValue<any>();
      if(value?.status === "unsend"){
      return <Group spacing={0} position="left" >
          <Tooltip label='Supprimer de la demande'>
            <Button color={'red.7'} onClick={ () =>openModal(value?.uuid)}>
              <IconTrash />
            </Button>
        </Tooltip>
      </Group>
      }
    }

  }*/
];

export function PatientOrderListTable({ orders }: PatientOrderListTableProps) {  
  const data: Encounter[] = useMemo(() => orders, [orders]);
  const columns: ColumnDef<Encounter>[] = useMemo(() => [...cols], []);
  const { removeEncounter } = useRemoveEncounter();
  
  async function deleteEncounter(uuid : string){
    removeEncounter(uuid, {
      onSuccess: () => {
        notification(
          'id-success',
          'success',
          'Demande suprimé avec succès',
          '',
          5000
        );
      },
    })
  }

  async function getEncountersSortedByDateDesc(encounters:Encounter[]): Promise<any[]> {
    return encounters.sort((a, b) => {
        const dateA = new Date(a.encounterDatetime).getTime();
        const dateB = new Date(b.encounterDatetime).getTime();
        return dateB - dateA;
    });
}

 getEncountersSortedByDateDesc(data);
 
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
