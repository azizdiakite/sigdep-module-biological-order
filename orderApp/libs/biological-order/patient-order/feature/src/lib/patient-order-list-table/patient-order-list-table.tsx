import { Encounter, Obs } from '@spbogui-openmrs/shared/model';
import { ColumnDef } from '@tanstack/react-table';
import { Badge, Button, Group, Loader, Text, Tooltip } from '@mantine/core';
import dayjs from 'dayjs';
import {
  IconAlertCircle, IconBan, IconCheck, IconChecks,
  IconClockCancel, IconClockHour7, IconEye, IconFileInvoice, IconSend,
} from '@tabler/icons';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { CustomTable } from '@spbogui-openmrs/shared/ui';
import { Concepts, FulfillerStatus } from '@spbogui-openmrs/shared/utils';
import { openConfirmModal } from '@mantine/modals';

/* eslint-disable-next-line */
export interface PatientOrderListTableProps {
  orders: Encounter[];
}

const openModal = (id: string) => openConfirmModal({
  title: 'Confirmation',
  centered: false,
  confirmProps: { color: 'red' },
  children: (
    <Text size="sm">Etes vous sur de vouloir supprimer cet enregistrement ?</Text>
  ),
  labels: { confirm: 'Confirmer', cancel: 'Annuler' },
  onCancel: () => console.log({ 'Cancel': id }),
  onConfirm() {},
});

type StatusKey = 'realised' | 'rejected' | 'received' | 'progress' | 'cancelled' | 'send' | 'waiting' | 'unsend';

const statusConfig: Record<StatusKey, { label: string; color: string; icon: JSX.Element }> = {
  realised:  { label: 'Réalisé',       color: 'green',  icon: <IconChecks size={14} /> },
  rejected:  { label: 'Rejeté',        color: 'red',    icon: <IconBan size={14} /> },
  received:  { label: 'Reçu au labo',  color: 'cyan',   icon: <IconCheck size={14} /> },
  progress:  { label: 'En cours',      color: 'orange', icon: <IconClockHour7 size={14} /> },
  cancelled: { label: 'Annulé',        color: 'gray',   icon: <IconClockCancel size={14} /> },
  send:      { label: 'Envoyé',        color: 'blue',   icon: <IconSend size={14} /> },
  waiting:   { label: 'Envoi en cours',color: 'yellow', icon: <Loader size={12} color="blue" /> },
  unsend:    { label: 'Échec d\'envoi', color: 'red', icon: <IconAlertCircle size={14} /> },
};

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
    id: 'orderDate',
    header: 'Date de prélèvement',
    accessorFn: (data) => data.encounterDatetime,
    cell: ({ getValue }) => (
      <Text size={'sm'}>
        {!!getValue() && dayjs(getValue<Date>()).format('DD/MM/YYYY')}
      </Text>
    ),
  },
  {
    id: 'createDate',
    header: 'Date de création',
    accessorFn: (data) => data.dateCreated,
    cell: ({ getValue }) => (
      <Text size={'sm'} color="dimmed">
        {!!getValue() && dayjs(getValue<Date>()).format('DD/MM/YYYY HH:mm')}
      </Text>
    ),
  },
  {
    id: 'reason',
    header: 'Motif',
    accessorFn: (data) => data.obs.find((o) => o.concept.uuid === Concepts.REASON_FOR_VIRAL_LOAD_REQUEST),
    cell: ({ getValue }) => (
      <Text size={'sm'}>{getValue<string>() && getValue<Obs>().display.split(':', 2)[1]}</Text>
    ),
  },
  {
    id: 'status',
    header: 'Statut',
    accessorFn: (data) => (
      data?.orders[0]?.fulfillerStatus === FulfillerStatus.EXCEPTION && data?.orders[0]?.fulfillerComment === FulfillerStatus.DECLINED
        ? 'unsend'
        : data?.orders[0]?.fulfillerStatus === FulfillerStatus.EXCEPTION && data?.orders[0]?.fulfillerComment === FulfillerStatus.CANCELLED
        ? 'cancelled'
        : data?.orders[0]?.fulfillerStatus === FulfillerStatus.EXCEPTION
        ? 'rejected'
        : data?.orders[0]?.fulfillerStatus === FulfillerStatus.IN_PROGRESS && data?.orders[0]?.fulfillerComment === FulfillerStatus.INPROGRESS
        ? 'progress'
        : data?.orders[0]?.fulfillerStatus === FulfillerStatus.RECEIVED && data?.orders[0]?.fulfillerComment === FulfillerStatus.ACCEPTED
        ? 'received'
        : data?.orders[0]?.fulfillerStatus === FulfillerStatus.RECEIVED && data?.orders[0]?.fulfillerComment === FulfillerStatus.REQUESTED
        ? 'send'
        : data?.orders[0]?.fulfillerStatus === FulfillerStatus.COMPLETED
        ? 'realised'
        : 'waiting'
    ),
    cell: ({ getValue }) => {
      const key = getValue<StatusKey>();
      const cfg = statusConfig[key] ?? statusConfig.unsend;
      return (
        <Badge
          color={cfg.color}
          variant="filled"
          size="sm"
          leftSection={<span style={{ display: 'flex', alignItems: 'center' }}>{cfg.icon}</span>}
        >
          {cfg.label}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    size: 100,
    cell: (data) => (
      <Group spacing={4} position="center" noWrap>
        <Tooltip label="Consulter la demande" withArrow>
          <Link
            style={{ textDecoration: 'none' }}
            to={`/patient-order/${data.row.getValue('patient')}/display/${data.row.getValue('uuid')}`}
          >
            <Button color="blue" size="xs" compact px={6}>
              <IconFileInvoice size={16} />
            </Button>
          </Link>
        </Tooltip>
        <Tooltip label="Résultat de la demande" withArrow>
          <Link
            style={{ textDecoration: 'none' }}
            to={`/patient-order/${data.row.getValue('patient')}/result/${data.row.getValue('uuid')}`}
          >
            <Button color="green" size="xs" compact px={6}>
              <IconEye size={16} />
            </Button>
          </Link>
        </Tooltip>
      </Group>
    ),
  },
];

export function PatientOrderListTable({ orders }: PatientOrderListTableProps) {
  const data: Encounter[] = useMemo(() =>
    [...orders].sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()),
    [orders]
  );
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
        color={'gray'}
      />
    </div>
  );
}

export default PatientOrderListTable;
