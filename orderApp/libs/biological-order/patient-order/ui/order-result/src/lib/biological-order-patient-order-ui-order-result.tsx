import { useParams } from 'react-router-dom';
import invariant from 'invariant';
import {
  useFindEncounter,
  useFindFilteredOrder,
  useFindNonCachedObs,
  useGetJasper,
} from '@spbogui-openmrs/shared/ui';
import dayjs from 'dayjs';
import {
  customEncounterParams, Concepts, EncounterRole, FulfillerStatus,
  notification,
  siteList
} from '@spbogui-openmrs/shared/utils';
import {
  Text,
  Group,
  Button,
  Tooltip,
  SimpleGrid,
  Stack,
  Paper,
  Divider,
  Title,
  Alert,
  Badge,
  createStyles,
} from '@mantine/core';
import { ENCOUNTER_INITIAL_VALUES, EncounterForm, Patient } from '@spbogui-openmrs/shared/model';
import { useState } from 'react';
import {
  IconFileDownload, IconBan, IconCheck,
  IconClockCancel, IconClockHour7, IconSend, IconAlertCircle,
  IconFlask, IconCalendar,
} from '@tabler/icons';
import { useFindLatestObs } from '../../../order-form/src/lib/use-find-latest-obs/use-find-latest-obs';

const useStyles = createStyles((theme) => ({
  resultValue: {
    fontSize: 40,
    fontWeight: 900,
    color: theme.colors.cyan[7],
    lineHeight: 1,
  },
  resultLog: {
    fontSize: 18,
    color: theme.colors.blue[6],
    fontWeight: 600,
  },
  resultCard: {
    background: `linear-gradient(135deg, ${theme.colors.cyan[0]} 0%, ${theme.colors.blue[0]} 100%)`,
    border: `2px solid ${theme.colors.cyan[3]}`,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    textAlign: 'center',
  },
  dateLabel: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.gray[6],
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  dateValue: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 700,
    color: theme.colors.blue[7],
  },
}));

/* eslint-disable-next-line */
export interface BiologicalOrderPatientOrderUiOrderResultProps {
  patient: Patient | undefined;
}

export function BiologicalOrderPatientOrderUiOrderResult({
  patient
}: BiologicalOrderPatientOrderUiOrderResultProps) {
  const { patientId, requestId } = useParams();
  const [requestDate, setRequestDate] = useState<Date>();
  const { classes } = useStyles();

  const { getJasperReport } = useGetJasper();
  invariant(patientId, '');
  invariant(requestId, '');
  const view = 'custom:(dateCreated,value)';
  const viewaccession = 'custom:(dateCreated,value,encounter:(encounterDatetime,obs:(display,concept:(uuid),value:(uuid),groupMembers:(value:(uuid),concept:(datatype:(name),uuid),uuid)))';

  const ENCOUNTER_INITIAL_VALUE_FORM: EncounterForm = {
    ...ENCOUNTER_INITIAL_VALUES,
    encounterProviders: [
      { encounterRole: EncounterRole.CLINICIAN, provider: '738185ba-eac9-11e5-8f4d-e06995eac916' },
      { encounterRole: EncounterRole.COLLECTOR, provider: '738185ba-eac9-11e5-8f4d-e06995eac916' },
    ],
  };

  const { pregnancyStatus, currentlyBreastfeedingChild } = useFindLatestObs(
    patient ? patient.uuid : '',
    dayjs(requestDate).format('YYYY-MM-DD'),
    ''
  );

  const { encounter } = useFindEncounter(requestId, customEncounterParams, true);
  const obs = encounter?.obs.find((o) => o.concept.uuid === Concepts.GROSS_HIV_VIRAL_LOAD);
  const isRejected = encounter?.orders[0]?.fulfillerStatus == FulfillerStatus.EXCEPTION && (encounter?.orders[0]?.fulfillerComment !== FulfillerStatus.CANCELLED && encounter?.orders[0]?.fulfillerComment !== FulfillerStatus.DECLINED);
  const isReceived = encounter?.orders[0]?.fulfillerStatus == FulfillerStatus.RECEIVED && encounter?.orders[0]?.fulfillerComment === FulfillerStatus.ACCEPTED;
  const isSend = encounter?.orders[0]?.fulfillerStatus == FulfillerStatus.RECEIVED && encounter?.orders[0]?.fulfillerComment === FulfillerStatus.REQUESTED;
  const isInProgress = encounter?.orders[0]?.fulfillerStatus == FulfillerStatus.IN_PROGRESS && encounter?.orders[0]?.fulfillerComment === FulfillerStatus.INPROGRESS;
  const isCompleted = encounter?.orders[0]?.fulfillerStatus == FulfillerStatus.COMPLETED;
  const isCancelled = encounter?.orders[0]?.fulfillerStatus == FulfillerStatus.EXCEPTION && encounter?.orders[0]?.fulfillerComment === FulfillerStatus.CANCELLED;
  const isUnsend = encounter?.orders[0]?.fulfillerStatus == FulfillerStatus.EXCEPTION && encounter?.orders[0]?.fulfillerComment == FulfillerStatus.DECLINED;

  const orderId = Number(localStorage.getItem('orderId') ? localStorage.getItem('orderId') : '0');
  const hivType = encounter?.obs.find((o) => o?.concept?.uuid === Concepts.TYPE_VIH);
  let isDoubleValue = false;
  isDoubleValue = !isNaN(parseFloat(obs?.value));

  function splitString(input: any) {
    const index = input.indexOf('/');
    if (index === -1) return [input, ''];
    return [input.slice(0, index), input.slice(index + 1)];
  }

  const { obs: accessionNumberObsList } = useFindNonCachedObs(patient ? patient?.uuid : '', Concepts.ACCESSION_NUMBER, viewaccession);
  const releasedDate = encounter?.obs?.find((o) => o.concept.uuid === Concepts.RELEASED_DATE);
  const technicalValidationDate = encounter?.obs?.find((o) => o.concept.uuid === Concepts.TECHNICAL_VALIDATION_DATE);
  const receivedDate = encounter?.obs?.find((o) => o.concept.uuid === Concepts.RECEIVED_DATE);
  const codeEtablisement = localStorage.getItem('code') ? localStorage.getItem('code') : '.';
  const site = localStorage.getItem('site') ? localStorage.getItem('site') : '.';
  const collectionType = encounter?.obs.find((o) => o.concept.uuid === Concepts.COLLECTION_TYPE);
  const prefix = encounter?.orders[0]?.accessionNumber ? encounter?.orders[0]?.accessionNumber?.replace(/[^a-zA-Z]/g, '') : '';
  const platformName = siteList.find(site => site.code.includes(prefix))?.name || undefined;
  const accessionNumberObs = accessionNumberObsList.find((obs) => obs.value === encounter?.orders[0]?.accessionNumber);

  const downloadResult = () => {
    const parameters = {
      age: patient?.person?.age?.toString(),
      sex: patient?.person?.gender,
      platformName,
      labUnit: '',
      siteCode: codeEtablisement,
      siteName: site,
      patientCode: patient?.identifiers[0].identifier,
      labno: encounter?.orders[0]?.accessionNumber,
      birthDate: dayjs(patient?.person?.birthdate).format('DD/MM/YYYY'),
      vlPregnancy: patient?.person?.gender == 'F' ? ((pregnancyStatus?.uuid === Concepts.YES) ? 'OUI' : 'NON') : '',
      vlSuckle: patient?.person?.gender == 'F' ? ((currentlyBreastfeedingChild?.uuid === Concepts.YES) ? 'OUI' : 'NON') : '',
      collectionDate: encounter?.encounterDatetime && dayjs(encounter?.encounterDatetime).format('DD/MM/YYYY'),
      receivedDate: receivedDate && dayjs(receivedDate?.value).format('DD/MM/YYYY'),
      completedDate: technicalValidationDate && dayjs(technicalValidationDate?.value).format('DD/MM/YYYY'),
      releasedDate: releasedDate && dayjs(releasedDate?.value).format('DD/MM/YYYY'),
      hivType: hivType ? hivType.display.split(':', 2)[1] : '',
      result: obs ? obs.value : '',
      resultLog: isDoubleValue ? (Math.log(obs?.value) / Math.log(10)).toFixed(2) : '',
      sampleTypeName: collectionType ? collectionType?.display?.split(':', 2)[1] : '',
    };

    getJasperReport(parameters, {
      onSuccess: (data) => { downloadBase64Pdf(data ? data : ''); },
      onError() {
        notification('id-error', 'error', 'Erreur rencontrée. Veuillez reesayer plus tard !!!', '', 5000);
      },
    });
  };

  const downloadBase64Pdf = (base64Data: string) => {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = encounter?.orders[0].accessionNumber + '_' + new Date();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  const { result } = useFindFilteredOrder();
  localStorage.setItem('notifCount', result?.total ? result?.total.toString() : '0');

  // Statut courant pour le badge
  const currentStatus = isCompleted ? { label: 'Réalisé', color: 'green' }
    : isRejected ? { label: 'Rejeté', color: 'red' }
    : isReceived ? { label: 'Reçu au labo', color: 'cyan' }
    : isSend ? { label: 'Envoyé', color: 'blue' }
    : isInProgress ? { label: 'En cours', color: 'orange' }
    : isCancelled ? { label: 'Annulé', color: 'gray' }
    : isUnsend ? { label: 'Échec d\'envoi', color: 'red' }
    : { label: 'Envoi en cours', color: 'yellow' };

  const renderAlternativeMessage = () => {
    if (isRejected) {
      const [firstPart, secondPart] = splitString(encounter?.orders[0]?.fulfillerComment);
      return (
        <Alert color="red" icon={<IconBan size={18} />} title="Demande rejetée" radius="md">
          <Text size="sm"><b>Motif du refus :</b> {firstPart}</Text>
          {secondPart && <Text size="sm" mt={4}><b>Observation :</b> {secondPart}</Text>}
        </Alert>
      );
    }
    if (isReceived) return (
      <Alert color="cyan" icon={<IconCheck size={18} />} title="Reçu au laboratoire" radius="md">
        L'échantillon a été reçu au laboratoire.
      </Alert>
    );
    if (isSend) return (
      <Alert color="blue" icon={<IconSend size={18} />} title="Demande envoyée" radius="md">
        La demande a été envoyée au laboratoire.
      </Alert>
    );
    if (isInProgress) return (
      <Alert color="orange" icon={<IconClockHour7 size={18} />} title="En cours de traitement" radius="md">
        L'échantillon est en cours de traitement au laboratoire.
      </Alert>
    );
    if (isCancelled) return (
      <Alert color="gray" icon={<IconClockCancel size={18} />} title="Demande annulée" radius="md">
        La demande a été annulée.
      </Alert>
    );
    if (isUnsend) return (
      <Alert color="orange" icon={<IconAlertCircle size={18} />} title="Échec d'envoi" radius="md">
        La demande a été envoyée mais n'est pas parvenue au serveur. Veuillez vérifier la connexion et réessayer.
      </Alert>
    );
    return (
      <Alert color="yellow" icon={<IconAlertCircle size={18} />} title="Envoi en cours" radius="md">
        La demande est en cours d'envoi au laboratoire.
      </Alert>
    );
  };

  return (
    <Stack spacing="sm">

      {/* En-tête */}
      <Group position="apart" align="center">
        <Group spacing="xs">
          <IconFlask size={20} color="#228be6" />
          <Title order={5} color="dark">Résultats de la demande</Title>
        </Group>
        <Group spacing="xs">
          <Badge color={currentStatus.color} variant="filled" size="md">
            {currentStatus.label}
          </Badge>
          {obs && isCompleted && (
            <Tooltip label="Télécharger le résultat PDF" withArrow>
              <Button
                leftIcon={<IconFileDownload size={16} />}
                color="green"
                size="xs"
                onClick={downloadResult}
              >
                Télécharger
              </Button>
            </Tooltip>
          )}
        </Group>
      </Group>

      <Divider />

      {obs && isCompleted ? (
        <Stack spacing="sm">

          {/* Numéro de labo + résultat */}
          <Group grow align="flex-start">

            {/* N° labo */}
            <Paper withBorder p="sm" radius="sm">
              <Text size="xs" color="dimmed" weight={500} transform="uppercase" mb={4}>
                Numéro de laboratoire
              </Text>
              <Text size="lg" weight={900} color="blue">
                {encounter?.orders[0].accessionNumber ?? '—'}
              </Text>
              {platformName && (
                <Text size="xs" color="dimmed" mt={2}>{platformName}</Text>
              )}
            </Paper>

            {/* Résultat mis en avant */}
            <div className={classes.resultCard}>
              <Text size="xs" color="dimmed" weight={600} transform="uppercase" mb={6}>
                {hivType ? hivType.display.split(':', 2)[1] : 'Charge virale'}
              </Text>
              <Text className={classes.resultValue}>
                {obs ? obs.value : '—'}
              </Text>
              <Text size="xs" color="dimmed" mt={2}>copies/ml</Text>
              {isDoubleValue && (
                <Text className={classes.resultLog} mt={4}>
                  Log : {(Math.log(obs.value) / Math.log(10)).toFixed(2)} log/ml
                </Text>
              )}
            </div>

          </Group>

          {/* Dates */}
          <Paper withBorder p="sm" radius="sm">
            <Group mb="xs" spacing="xs">
              <IconCalendar size={16} color="#228be6" />
              <Text size="xs" weight={600} color="dimmed" transform="uppercase">Suivi de la demande</Text>
            </Group>
            <SimpleGrid cols={3} spacing="md" breakpoints={[{ maxWidth: 'sm', cols: 2 }]}>
              {[
                { label: 'Date de prélèvement', value: encounter?.encounterDatetime ? dayjs(encounter.encounterDatetime).format('DD/MM/YYYY') : '—' },
                { label: 'Réception au laboratoire', value: receivedDate ? dayjs(receivedDate.value).format('DD/MM/YYYY') : '—' },
                { label: 'Validation technique', value: technicalValidationDate ? dayjs(technicalValidationDate.value).format('DD/MM/YYYY') : '—' },
                { label: 'Validation biologique', value: releasedDate ? dayjs(releasedDate.value).format('DD/MM/YYYY') : '—' },
                { label: 'Réception sur le site', value: accessionNumberObs ? dayjs(accessionNumberObs.obsDatetime).format('DD/MM/YYYY') : '—' },
              ].map((item) => (
                <Stack key={item.label} spacing={2}>
                  <Text className={classes.dateLabel}>{item.label}</Text>
                  <Text className={classes.dateValue}>{item.value}</Text>
                </Stack>
              ))}
            </SimpleGrid>
          </Paper>

        </Stack>
      ) : (
        renderAlternativeMessage()
      )}

    </Stack>
  );
}

export default BiologicalOrderPatientOrderUiOrderResult;
