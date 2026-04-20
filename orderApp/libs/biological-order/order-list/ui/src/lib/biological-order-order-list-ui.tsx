import { Button, Container, createStyles, Divider, Group, Indicator, keyframes, Loader, LoadingOverlay, Paper, Stack, Table, Text, Title, Tooltip, Transition, Center, Badge, useMantineTheme } from '@mantine/core';
import { Encounter, NotifOrder } from '@spbogui-openmrs/shared/model';
import { useFindFilteredOrder, useFindPatientByIdentifier, useReviseOrder } from '@spbogui-openmrs/shared/ui';
import { useEffect, useState } from 'react';
import OrderListFilterForm from './order-list-filter-form/order-list-filter-form';
import OrderListTable from './order-list-table/order-list-table';
import PatientSearchForm from './patient-search-form/patient-search-form';
import { useClickOutside } from '@mantine/hooks';
import { IconBellRinging, IconChecks, IconBan, IconCheck, IconClockHour7, IconClockCancel, IconSend, IconAlertCircle, IconList } from '@tabler/icons';
import { Link } from 'react-router-dom';

const ring = keyframes({
  '0%':   { transform: 'rotate(0)' },
  '10%':  { transform: 'rotate(15deg)' },
  '20%':  { transform: 'rotate(-15deg)' },
  '30%':  { transform: 'rotate(10deg)' },
  '40%':  { transform: 'rotate(-10deg)' },
  '50%':  { transform: 'rotate(0)' },
  '100%': { transform: 'rotate(0)' },
});

const useStyles = createStyles((theme) => ({
  ringingIcon: {
    animation: `${ring} 2s ease infinite`,
    transformOrigin: 'top center',
    display: 'inline-flex',
  },
  header: {
    background: `linear-gradient(135deg, ${theme.colors.cyan[7]} 0%, ${theme.colors.blue[8]} 100%)`,
    borderRadius: `${theme.radius.sm}px ${theme.radius.sm}px 0 0`,
    padding: theme.spacing.md,
  },
  notifRow: {
    padding: '6px 10px',
    borderBottom: `1px solid ${theme.colors.gray[2]}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '&:hover': {
      backgroundColor: theme.colors.gray[1],
    },
  },
}));

/* eslint-disable-next-line */
export interface BiologicalOrderOrderListUiProps {
  orders: Encounter[];
  isLoading?: boolean;
  setFilterList: (startDate: Date, endDate: Date) => void;
  setIdentifier: (identifier: string) => void;
  setParams: (params: string) => void;
  setStartDate : (startDate : string) => void;
  setEndDate : (endDate : string) => void;
  patientId?: string;
}
const scaleY = {
  in: { opacity: 1, transform: 'scaleY(1)' },
  out: { opacity: 0, transform: 'scaleY(0)' },
  common: { transformOrigin: 'top' },
  transitionProperty: 'transform, opacity',
};
export function BiologicalOrderOrderListUi({
  orders,
  isLoading: ordersLoading = false,
  setStartDate ,
  setEndDate ,
  setFilterList,
  patientId,
  setParams,
}: BiologicalOrderOrderListUiProps) {
  const theme = useMantineTheme();
  const { classes } = useStyles();

  const [identifier, setIdentifier] = useState<string>('');
  const { patient, getPatient, isLoading } = useFindPatientByIdentifier(
    identifier,
    'full'
  );
  const [opened, setOpened] = useState(false);
  const clickOutsideRef = useClickOutside(() => setOpened(false));
  const {result , isLoading: loadingOrders} = useFindFilteredOrder()
  const { updateOrder } = useReviseOrder()

  const handleClosePaper = () => {
    setOpened(false);
  };

  useEffect(() => {
    if (identifier !== '') {
      getPatient().then(() => {
        if (patient) {
          console.log(patient);
        }
      });
    }
  }, [getPatient, identifier, patient]);

  return (
    <Container fluid p={0}>
      <Paper withBorder radius={'sm'} style={{ overflow: 'hidden' }}>

        <Paper p={'sm'} style={{ backgroundColor: theme.colors.gray[0] }}>

          {/* Barre d'actions : cloche + recherche patient */}
          <Group position="apart" align="center" mb={'xs'}>

            {/* Cloche de notifications */}
            <Tooltip label="Résultats reçus" withArrow position="right">
              <Indicator
                label={result?.total ?? 0}
                inline
                size={20}
                color="red"
                showZero={false}
              >
                <div style={{ position: 'relative' }}>
                  <Button
                    onClick={() => setOpened((o) => !o)}
                    variant="filled"
                    color="blue"
                    leftIcon={<span className={classes.ringingIcon}><IconBellRinging size={18} /></span>}
                    size="sm"
                  >
                    Notifications
                  </Button>

                  <Transition mounted={opened} transition={scaleY} duration={200} timingFunction="ease">
                    {(styles) => (
                      <Paper
                        shadow="lg"
                        ref={clickOutsideRef}
                        onClick={handleClosePaper}
                        withBorder
                        style={{
                          ...styles,
                          position: 'absolute',
                          top: '110%',
                          left: 0,
                          width: 320,
                          maxHeight: 280,
                          overflowY: 'auto',
                          zIndex: 100,
                        }}
                      >
                        <Text
                          size="xs"
                          weight={600}
                          color="dimmed"
                          p={'xs'}
                          style={{ borderBottom: `1px solid ${theme.colors.gray[2]}` }}
                        >
                          RÉSULTATS DISPONIBLES
                        </Text>
                        {result?.orders?.length === 0 && (
                          <Center p={'md'}>
                            <Text size="sm" color="dimmed">Aucune notification</Text>
                          </Center>
                        )}
                        {result?.orders.map((order: NotifOrder, index) => {
                          const statusIcon =
                            order.status === 'COMPLETED' ? <IconChecks size={16} color={theme.colors.green[6]} /> :
                            order.status === 'EXCEPTION' && order?.comment === 'CANCELLED' ? <IconClockCancel size={16} color={theme.colors.gray[6]} /> :
                            order.status === 'EXCEPTION' ? <IconBan size={16} color={theme.colors.red[6]} /> :
                            order.status === 'RECEIVED' && order?.comment === 'ACCEPTED' ? <IconCheck size={16} color={theme.colors.green[6]} /> :
                            order.status === 'IN_PROGRESS' ? <IconClockHour7 size={16} color={theme.colors.orange[6]} /> :
                            order.status === 'RECEIVED' && order?.comment === 'REQUESTED' ? <IconSend size={16} color={theme.colors.blue[6]} /> :
                            <IconAlertCircle size={16} color={theme.colors.gray[6]} />;

                          return (
                            <Link
                              key={index}
                              style={{ textDecoration: 'none', color: 'inherit' }}
                              to={`/patient-order/${order?.personUuid}/result/${order?.encounterUuid}`}
                              onClick={() => updateOrder(order?.orderId)}
                            >
                              <div className={classes.notifRow}>
                                <Text size="sm" weight={500}>{order?.patientName}</Text>
                                {statusIcon}
                              </div>
                            </Link>
                          );
                        })}
                      </Paper>
                    )}
                  </Transition>
                </div>
              </Indicator>
            </Tooltip>

            {/* Recherche patient */}
            <PatientSearchForm
              setIdentifier={setIdentifier}
              isLoading={isLoading}
              patientId={patient && patient?.uuid}
            />
          </Group>

          <Divider my={'xs'} label="Filtrer par période" labelPosition="left" />

          {/* Tableau + filtres */}
          <Paper
            withBorder
            style={{ overflow: 'visible', position: 'relative', backgroundColor: 'white' }}
          >
            <OrderListFilterForm
              setParams={setParams}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
            <Divider />
            <LoadingOverlay
              visible={ordersLoading}
              overlayBlur={3}
              overlayOpacity={0.6}
              overlayColor="#f8f9fa"
              loader={
                <Center>
                  <Stack align="center" spacing="xs">
                    <Loader size="xl" variant="dots" color="cyan" />
                    <Text size="sm" color="cyan" weight={500}>Chargement en cours...</Text>
                  </Stack>
                </Center>
              }
            />
            <OrderListTable orders={orders} />
          </Paper>

        </Paper>
      </Paper>
    </Container>
  );
}

export default BiologicalOrderOrderListUi;
