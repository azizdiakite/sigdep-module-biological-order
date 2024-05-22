import {
  Button,
  Divider,
  Grid,
  Group,
  Paper,
  Text,
  Alert,
  Title,
  Flex,
  Tooltip
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useInputState } from '@mantine/hooks';
import { BiologicalOrderPatientOrderUiOrderForm } from '@spbogui-openmrs/biological-order/patient-order/ui/order-form';
import { BiologicalOrderPatientOrderUiOrderPrint } from '@spbogui-openmrs/biological-order/patient-order/ui/order-print';
import { BiologicalOrderPatientOrderUiOrderDisplay, BiologicalOrderPatientOrderUiOrderResult,  } from '@spbogui-openmrs/biological-order/patient-order/ui/order-result';
import { BiologicalOrderPatientOrderUiPatientHome , } from '@spbogui-openmrs/biological-order/patient-order/ui/patient-home';
import {
  useFindFilteredEncounter,
  useFindLastClosedEncounter,
  useFindLastEnrollmentEncounter,
  useFindOneLocation,
  useFindOnePatient,
} from '@spbogui-openmrs/shared/ui';
import {
  Concepts,
  customEncounterParams,
  EncounterType,
  FulfillerStatus,
  IdentifierType,
} from '@spbogui-openmrs/shared/utils';
import { IconArrowRight, IconCalendar, IconList, IconPlus, IconPrinter } from '@tabler/icons';
import invariant from 'invariant';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import PatientOrderListTable from './patient-order-list-table/patient-order-list-table';
import dayjs from 'dayjs';
import { useFindLatestObs } from 'libs/biological-order/patient-order/ui/order-form/src/lib/use-find-latest-obs/use-find-latest-obs';
import { useEffect, useState } from 'react';
import { Encounter, Obs, PatientIdentifier } from '@spbogui-openmrs/shared/model';
import ReactToPrint from 'react-to-print';

/* eslint-disable-next-line */
export interface BiologicalOrderPatientOrderFeatureProps {}

export function BiologicalOrderPatientOrderFeature(
  props: BiologicalOrderPatientOrderFeatureProps
) {
  const { patientId } = useParams();
  const [accepted, setAccepted] = useState(false);
  const [sended, setSended] = useState(false);
  const [encounters, setEncounters] = useState<Encounter[]>();

  invariant(patientId, '');


  const [requestDate, setRequestDate] = useInputState<Date | undefined>(
    undefined
  );

  function containsTwoHyphens(str: string): boolean {
    const hyphenCount = (str.match(/-/g) || []).length;
    return hyphenCount === 2;
}

  const { patient } = useFindOnePatient(patientId, 'full', true);
  let  patientIdList = [];
  patientIdList = patient && patient.identifiers.length > 0 ? patient?.identifiers : [];
  getUpid(patientIdList)
  const { transfered, selfStopTreatment, negatifVih} = useFindLatestObs(patient ? patient.uuid : '',dayjs(requestDate).format('YYYY-MM-DD'),'');
  //const {encounters } = useFindAllEncounters(EncounterType.REQUEST_EXAM ,"2010-01-01" ,"9999-12-12" ,customEncounterParams ,'100' ,true)
  let { encounter } = useFindFilteredEncounter(patientId ,EncounterType.REQUEST_EXAM ,customEncounterParams ,'' ,'' ,true);
  let { encounterClosed } = useFindLastClosedEncounter(patientId ,customEncounterParams ,'' ,'' ,true);
  let { lastEnrollmentEncounter } = useFindLastEnrollmentEncounter(patientId ,customEncounterParams ,'' ,'' ,true);

 
    const closedEncounter  = encounterClosed[0] ;
    const isRealTransfered = closedEncounter?.obs?.find((o) => o?.concept?.uuid === Concepts.TRANSFERERD);
    const isSelfStopTreatment = closedEncounter?.obs?.find((o) => o?.concept?.uuid === Concepts.SELF_STOP_TREATMENT_CHECKED);
    const isFakePositive = closedEncounter?.obs?.find((o) => o?.concept?.uuid === Concepts.FAKE_POSITIVE);
    const isDead = closedEncounter?.obs?.find((o) => o?.concept?.uuid === Concepts.PATIENT_DEATH);
    

  
  //console.log({lastEnrollmentEncounter: lastEnrollmentEncounter[0]?.encounterDatetime});
 // console.log({encounterClosed: encounterClosed[0].encounterDatetime});
  //console.log({isTransfered: isTransfered(lastEnrollmentEncounter, encounterClosed)});


  const lastResult = encounter[0]?.obs.find((o) => o.concept.uuid === Concepts.GROSS_HIV_VIRAL_LOAD);
  const lastResultIsAvailable = (lastResult !== undefined && encounter?.length > 0) || (lastResult === undefined && encounter?.length === 0) || (encounter[0]?.orders[0]?.fulfillerStatus == FulfillerStatus.EXCEPTION) || (encounter[0]?.orders[0]?.fulfillerStatus == null);
  //const lastResultIsAvailable = true;
  const patientIsTranfered = transfered && isTransfered(lastEnrollmentEncounter, encounterClosed)
  let displayCalendar =  (lastResultIsAvailable && !patient?.person?.dead && !patientIsTranfered) && !sended && (selfStopTreatment === undefined) && (negatifVih === undefined)
  let warning_message = '';

  if(patient && patient?.person?.dead){
    warning_message = "La demande ne peut etre effectuée car le patient est décédé.";
  }

  //console.log({transfered: isTransfered(lastEnrollmentEncounter, encounterClosed)});
  
  if(patientIsTranfered){
    warning_message = "Ce patient a été transféré à : "+ transfered.value;
  }
  if(selfStopTreatment){
    warning_message = "Ce patient a volontairement arreté son traitement le : "+ dayjs(selfStopTreatment).format('DD/MM/YYYY')  ;
  }
  if(negatifVih){
    warning_message = "Ce patient a été declaré négatif le : "+ dayjs(negatifVih).format('DD/MM/YYYY')  ;
  }
  if(!lastResultIsAvailable || sended){
    warning_message = "Une nouvelle demande ne peut etre éffectuée car le dernier resultat n'est pas encore disponible...";
  }
  
  const handleClick = () => {
    setAccepted(true)
  };

  const updatePage = () => {
    setSended(true);
  };

  function getUpid(ids :PatientIdentifier[]){
    ids.forEach( (i) => {
      if(containsTwoHyphens(i.identifier)){
        localStorage.setItem('upid', i.identifier);
      }else{
        localStorage.setItem('upid', '');
      }
    })
   }


  function isTransfered( lastEnrollmentEncounter: Encounter[], encounterClosed: Encounter[]){
      if(encounterClosed && transfered){
        return  isDateBefore(lastEnrollmentEncounter[0]?.encounterDatetime, encounterClosed[0]?.encounterDatetime);
      }else{
        return false;
      }
  }

  function isDateBefore(firstDateStr: Date, secondDateStr: Date): boolean {
    return new Date(firstDateStr) < new Date(secondDateStr);
}

  const updatEncounter = () => {
    let { encounter } = useFindFilteredEncounter(patientId ,EncounterType.REQUEST_EXAM ,customEncounterParams ,'' ,'' ,true);
    console.log({encounter: encounter});
    setEncounters(encounter)
  };

  const locuuid = localStorage.getItem('location_uuid') ? localStorage.getItem('location_uuid'): '';
  const uuid = locuuid === null ? '' : locuuid
  const { location } = useFindOneLocation(uuid);
  if (location !== undefined && location !== null) {
    localStorage.setItem('site', location?.name) ;
    localStorage.setItem('district', location.parentLocation?.display ) ;
    localStorage.setItem('district_uuid', location.parentLocation?.uuid) ;
    localStorage.setItem('code', location.postalCode);
  }

  useEffect(() => {
    
  }, [encounter]);

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
          <Text> Nom et Prénom(s) : </Text>
          <Text size={'lg'}  weight={'bold'}>
            {patient && patient.person.display}
          </Text>
          <Text> Numéro du patient : </Text>
          <Text size={'md'} color={'cyan'} weight={'bold'}>
            {patient && patient.identifiers[0].identifier}
          </Text>
            
        {/*  {patient && (
           <>
          { patient.person.dead ? (
            <Alert color="red" title="ATTENTION !!!!">
            La demande ne peut etre effectuée car le patient est décédé .
            </Alert>): ''}
           </>
          )}*/}


        </Group>

        {displayCalendar|| accepted? (
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
                <BiologicalOrderPatientOrderUiOrderPrint patient={patient} encounter={encounter[0]}  disabled={!requestDate}/>
             {/* <ReactToPrint
                trigger={() =>  <Button
                  leftIcon={<IconPrinter />}
                  color={'cyan'}
                  disabled={!requestDate}
                >
                  Fiche de demande
                </Button>}content={() =>  document.getElementById('print')!}
                /> */ }
              </Group>
        ): ( 
          <>
           { patientIsTranfered && lastResultIsAvailable ? (
            <div>
                <Alert color="red" title="ATTENTION !!!!">{warning_message}</Alert>
                <Flex
                    direction={{ base: 'column', sm: 'row' }}
                    gap={{ base: 'sm', sm: 'lg' }}
                    justify={{ sm: 'flex-start' }} ml={'md'}>
                    <Title order={5}>Pour soumettre le formulaire veuillez cliquez sur le boutton </Title>
                    <Tooltip label='Continuer'>
                       <Button size={'xs'} onClick={handleClick} color={'bleu.7'}><IconArrowRight/></Button>
                    </Tooltip>
                </Flex>
                
            </div>
          ) : (
           <Alert color="red" title="ATTENTION !!!!">{warning_message} </Alert>
           )}
          </>
         )}
  

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
              <PatientOrderListTable orders={encounter || encounters} />
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
                    isTransfered={isTransfered(lastEnrollmentEncounter, encounterClosed)}
                    handleUpdateParent={updatePage}
                  />
                }
              />
              <Route
                path="result/:requestId"
                element={<BiologicalOrderPatientOrderUiOrderResult />}
              />
               <Route
                path="display/:requestId"
                element={<BiologicalOrderPatientOrderUiOrderDisplay />}
              />
              <Route
                path="print"
                element={
                  <BiologicalOrderPatientOrderUiOrderPrint patient={patient} encounter={encounter[0]}  />
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
