import { useParams } from 'react-router-dom';
import invariant from 'invariant';
import {
  useFindEncounter,
  useFindOnePatient} from '@spbogui-openmrs/shared/ui';
import dayjs from 'dayjs';
import {
  customEncounterParams ,Concepts, IdentifierType} from '@spbogui-openmrs/shared/utils';
import {
  Text,
  Paper,
  Group,
  Space,
  Grid,
  Table,
  Button,
  useMantineTheme,
  Flex
} from '@mantine/core';
import ReactToPrint from 'react-to-print';
import { IconPrinter } from '@tabler/icons';


/* eslint-disable-next-line */
export interface BiologicalOrderPatientOrderUiOrderDisplayProps {}

export function BiologicalOrderPatientOrderUiOrderDisplay(
  props: BiologicalOrderPatientOrderUiOrderDisplayProps
) {
  const theme = useMantineTheme();

  const {patientId, requestId } = useParams();
  invariant(requestId, '');
  invariant(patientId, '');

  const { encounter } = useFindEncounter(requestId ,customEncounterParams ,true);
  const { patient } = useFindOnePatient(patientId ,'full' ,true);

  const hivType = encounter?.obs.find((o) => o.concept.uuid === Concepts.TYPE_VIH); 
  const startArvTreatment = encounter?.obs.find((o) => o.concept.uuid === Concepts.STARTED_ARV_TREATMENT);
  const startArvTreatmentDate = encounter?.obs.find((o) => o.concept.uuid === Concepts.ARV_START_DATE);
  const firstLine = encounter?.obs.find((o) => o.value.uuid === Concepts.FIRST_TREATMENT_LINE);
  const secondLine = encounter?.obs.find((o) => o.value.uuid === Concepts.SECOND_TREATMENT_LINE);
  const thirdLine = encounter?.obs.find((o) => o.value.uuid === Concepts.THIRD_TREATMENT_LINE);
  const reasonForViralLoad = encounter?.obs.find((o) => o.concept.uuid === Concepts.REASON_FOR_VIRAL_LOAD_REQUEST);
  const otherReason = encounter?.obs.find((o) => o.concept.uuid === Concepts.OTHER_REASON);
  const initialCd4Count = encounter?.obs.find((o) => o.concept.uuid === Concepts.INNITIAL_CD4_COUNT);
  const initialCd4Percent = encounter?.obs.find((o) => o.concept.uuid === Concepts.INNITIAL_CD4_PERCENT);
  const initialCd4Date = encounter?.obs.find((o) => o.concept.uuid === Concepts.INNITIAL_CD4_DATE);
  const lateCd4Count = encounter?.obs.find((o) => o.concept.uuid === Concepts.LATE_CD4_COUNT);
  const lateCd4Percent = encounter?.obs.find((o) => o.concept.uuid === Concepts.LATE_CD4_PERCENT);
  const lateCd4Date = encounter?.obs.find((o) => o.concept.uuid === Concepts.LATE_CD4_DATE);
  const arvRegimen = encounter?.obs.find((o) => o.concept.uuid === Concepts.ARV_REGIMEN);
  const hasViralLoad = encounter?.obs.find((o) => o.concept.uuid === Concepts.HAS_VIRAL_LOAD);
  const lastViralLoad = encounter?.obs.find((o) => o.concept.uuid === Concepts.LAST_VIRAL_LOAD);
  const lastViralLoadDate = encounter?.obs.find((o) => o.concept.uuid === Concepts.LAST_VIRAL_LOAD_DATE);
  const laboratoire = encounter?.obs.find((o) => o.concept.uuid === Concepts.LAST_VIRAL_LOAD_LABORATORY);
  const viralLoadRequestDate = encounter?.obs.find((o) => o.concept.uuid === Concepts.VIRAL_LOAD_REQUEST_DATE);
  const viralLoadRequestTime = encounter?.obs.find((o) => o.concept.uuid === Concepts.VIRAL_LOAD_REQUEST_TIME);
  const collectionType = encounter?.obs.find((o) => o.concept.uuid === Concepts.COLLECTION_TYPE);
  const pregnancyStatus = encounter?.obs.find((o) => o.concept.uuid === Concepts.PREGNANCY_STATUS);
  const currentlyBreastfeeding = encounter?.obs.find((o) => o.concept.uuid === Concepts.CURRENTLY_BREAST_FEEDING);
  const clinicianPhoneNumber = encounter?.obs.find((o) => o.concept.uuid === Concepts.CLINICIAN_PHONE_NUMBER);
  const clinicianEmail = encounter?.obs.find((o) => o.concept.uuid === Concepts.CLINICAL_EMAIL);
  const upidIdentifier = localStorage.getItem('upid') ? localStorage.getItem('upid'): '';

  //console.log({upidIdentifier: upidIdentifier});
  
  return (
    <div>
    <Paper shadow="xl" radius="xl" p="md" id='print' bg={'gray.1'}>
          <Text size={'lg'} weight={'bold'} color={'cyan.6'}>
            DONNEES PATIENT
            {/*JSON.stringify(clinicianPhoneNumber?.value)*/}
          </Text>
          <Table >
              <tbody>
                

                <tr>
                 
                  <td>
                    <Text size={'sm'}>Code ARV : </Text>
                    <Text weight={'bold'}>
                      { encounter?.patient?.identifiers[0]?.identifier }
                    </Text>
                  </td>
                  <td>
                    <Text size={'sm'}>UPID : </Text>
                    <Text weight={'bold'}>
                      { upidIdentifier }
                    </Text>
                  </td>
                  <td>
                  <Text size={'sm'} pb={'xs'}>Allaitement :{''}</Text>
                  <Text weight={'bold'}>{currentlyBreastfeeding ? currentlyBreastfeeding?.display?.split(":", 2)[1] : ''}</Text>
                  </td>
                  <td>
                    <Text size={'sm'}>Sexe : </Text>
                    <Text weight={'bold'}>
                       {patient?.person?.gender === 'M' ? ('MASCULIN') : ('FEMININ')}
                    </Text>
                  </td>
                </tr>
                <tr>
                   {/*<td>
                   <Text size={'sm'}>Nom & Prénom(s) : </Text>
                    <Text weight={'bold'}>
                      patient?.person?.display
                    </Text> 
                  </td>*/}
                  <td>
                    <Text size={'sm'}>Date de naissance : </Text>
                    <Text weight={'bold'}>
                      {dayjs(patient?.person?.birthdate).format('DD/MM/YYYY')}
                    </Text>
                  </td>
                  <td>
                    <Text size={'sm'}>Age : </Text> 
                    <Text weight={'bold'}>{patient?.person?.age}</Text>
                  </td>
                  <td>
                  <Text size={'sm'} pb={'xs'}>Grossesse :</Text>
                  <Text weight={'bold'}> {pregnancyStatus ? pregnancyStatus?.display?.split(":", 2)[1] : ''}</Text>
                  </td>
                </tr>


              </tbody>
            </Table>
     <Text size={'lg'} my={'xs'} weight={'bold'} color={'cyan.6'}>
            DONNEES CLINIQUES
     </Text>
     <Group mb={'xs'}>
        <Text size={'sm'}>Type de VIH : </Text>
        <Text weight={'bold'}> {hivType ? hivType?.display?.split(":", 2)[1] : ''} </Text>
      </Group>
      <Space />
      <Group mb={'xs'}>
        <Text size={'sm'}>Le patient est-il actuellement sous ARV :  </Text>
        <Text weight={'bold'}>
             {startArvTreatment?.display?.split(":", 2)[1].trim() =='true' ? 'Oui' :'Non'}
        </Text>
        <Text size={'sm'}> Date  :  </Text>
        <Text weight={'bold'}>
             {dayjs(startArvTreatmentDate?.value).format('DD/MM/YYYY')}
        </Text>
      </Group>
      <Group mb={'xs'}>
      <Text size={'sm'}> Ligne thérapeutique :  </Text>
        <Text weight={'bold'}>
             {firstLine ? firstLine?.display?.split(":", 2)[1].trim()+ ' Ligne' : ''}
             {secondLine ? secondLine?.display?.split(":", 2)[1].trim()+ ' Ligne' :''}
             {thirdLine ? thirdLine?.display?.split(":", 2)[1].trim()+ ' Ligne':''}
        </Text>
      </Group>
      <Group mb={'xs'}>
      <Text size={'sm'}> Régime thérapeutique :  </Text>
        <Text weight={'bold'}>
            {arvRegimen ? arvRegimen?.display?.split(":", 2)[1].trim() : ''}
        </Text>
      </Group>
      <Group mb={'sm'}>
          <Text  size={'sm'}>
            Motif de la demande de la CV :
          </Text>
          <Text weight={'bold'}>
             {reasonForViralLoad ? reasonForViralLoad?.display?.split(":", 2)[1].trim() : ''}
        </Text>

        <Text  size={'sm'}>
           Autres (à préciser) :
          </Text>
          <Text weight={'bold'}>
             {otherReason ? otherReason?.display.split(":", 2)[1] : ''}
        </Text>
      </Group>
       
      <Grid my={'xs'} pl={'xs'}>
            <Grid.Col span={6} p={'xs'}>
              <Text size={'sm'} weight={'bold'} underline mb={'sm'}>
                A l'initiation du traitement
              </Text>
              <Group>
                  <Text size={'sm'}>CD4 valeur absolue :</Text>
                  <Text weight={'bold'}>
                      {initialCd4Count ? initialCd4Count?.display?.split(":", 2)[1] : ''}
                  </Text>
              </Group>
              <Group>
                <Text size={'sm'}>CD4 pourcentage :</Text>
                <Text weight={'bold'}>
                      {initialCd4Percent ? initialCd4Percent?.display?.split(":", 2)[1] : ''}
                  </Text>
              </Group>
              <Group>
                <Text size={'sm'}>Date :</Text>
                <Text weight={'bold'}>
                  {dayjs(initialCd4Date?.value).format('DD/MM/YYYY')}
               </Text>
              </Group>
            </Grid.Col>
            <Grid.Col span={6} p={'xs'}>
              <Text size={'sm'} weight={'bold'} underline mb={'sm'}>
                A la demande de Charge virale
              </Text>
              <Group>
                <Text size={'sm'}>CD4 valeur absolue :</Text>
                <Text weight={'bold'}>
                      {lateCd4Count ? lateCd4Count?.display?.split(":", 2)[1] : ''}
                 </Text>
              </Group>
              <Group>
                <Text size={'sm'}>CD4 pourcentage :</Text>
                <Text weight={'bold'}>
                      {lateCd4Percent ? lateCd4Percent?.display?.split(":", 2)[1] : ''}
                </Text>
              </Group>
              <Group>
                <Text size={'sm'}>Date :</Text>
                <Text weight={'bold'}>
                  {dayjs(lateCd4Date?.value).format('DD/MM/YYYY')}
               </Text>
              </Group>
            </Grid.Col>
          </Grid>
          <Group mb={'sm'}>
            <Text size={'sm'}>
              Le patient a-t-il déjà bénéficié d’une mesure de charge virale: 
            </Text>
            <Text weight={'bold'}>
                {hasViralLoad ? hasViralLoad?.display?.split(":", 2)[1] : ''}
            </Text>
            <Text size={'sm'}>
              Valeur: 
            </Text>
            <Text weight={'bold'}>
                {lastViralLoad ? lastViralLoad?.display?.split(":", 2)[1] : ''}
            </Text>
          </Group> 
          <Group mb={'sm'} ml={'xl'}>
                <Text size={'sm'}>
                  Laboratoire: 
                </Text>
                <Text weight={'bold'}>
                    {laboratoire ? laboratoire?.display?.split(":", 2)[1] : ''}
                </Text>
                <Text size={'sm'}>
                  Date: 
                </Text>
                <Text weight={'bold'}>
                  {lastViralLoadDate ? dayjs(lastViralLoadDate?.value).format('DD/MM/YYYY') : ''}
                </Text>
             </Group>
          <Paper >
            <Table >
              <tbody>
                <tr>
                  <td>
                    <Group mb={'xs'}>
                      <Text size={'sm'}>Nom du clinicien  <span style={{ color: theme.colors.red[8] }}>*</span></Text>
                      <Text weight={'bold'}>
                        {encounter?.encounterProviders[0].provider.person.names[0].givenName}
                      </Text>
                    </Group>
                    <Group mb={'xs'}>
                      <Text size={'sm'}>Date de la demande de l'analyse  <span style={{ color: theme.colors.red[8] }}>*</span></Text>
                      <Text weight={'bold'}>
                        {dayjs(viralLoadRequestDate?.value).format('DD/MM/YYYY')}
                      </Text>
                    </Group>

                    <Group mb={'xs'}>
                      <Text size={'sm'}>N° Tel clinicien</Text>
                      {clinicianPhoneNumber ? clinicianPhoneNumber?.value: ''}
                    </Group>
                    <Group mb={'xs'}>
                      <Text size={'sm'}>E-mail clinicien</Text>
                      {clinicianEmail ? clinicianEmail?.value: ''}
                    </Group>
                  </td>
                  <td>
                    <Group mb={'xs'}>
                      <Text size={'sm'}>Nom du préleveur  <span style={{ color: theme.colors.red[8] }}>*</span></Text>
                      <Text weight={'bold'}>
                       {encounter?.encounterProviders[1].provider.person.names[0].givenName}
                      </Text>
                    </Group>
                    <Group mb={'xs'}>
                      <Text size={'sm'}>Date du prélèvement  <span style={{ color: theme.colors.red[8] }}>*</span></Text>
                      <Text weight={'bold'}>
                        {dayjs(encounter?.encounterDatetime).format('DD/MM/YYYY')}
                      </Text>
                    </Group>
                    <Group mb={'xs'}>
                      <Text size={'sm'}>Heure du prélèvement</Text>
                      <Text weight={'bold'}>
                        {viralLoadRequestTime ?  viralLoadRequestTime?.display?.split(":", 3)[1] : ''} : { viralLoadRequestTime ? viralLoadRequestTime?.display?.split(":", 3)[2]: ''}
                      </Text>
                    </Group>
                    <Group mb={'xs'} >
                      <Text size={'sm'} >Type de prélèvement  <span style={{ color: theme.colors.red[8] }}>*</span></Text>
                      <Text weight={'bold'}>
                      {collectionType ? collectionType?.display?.split(":", 2)[1] : ''}
                      </Text>
                    </Group>
                  </td>
                </tr>
              </tbody>
            </Table>
           
          </Paper>
    </Paper>
    <Flex
      direction={{ base: 'column', sm: 'row' }}
      gap={{ base: 'sm', sm: 'lg' }}
      justify={{ sm: 'center' }}
      mt={'md'}
    >
     {/*  <ReactToPrint
          trigger={() =>  <Button
          leftIcon={<IconPrinter />}
          color={'cyan'}
          >
            Imprimer
          </Button>}content={() =>  document.getElementById('print')!}
          /> */}
    </Flex>
   
  </div>
  );
}

export default BiologicalOrderPatientOrderUiOrderDisplay;
/*.New: #8FED8F (Vert clair)
.Auto Matches: #4DA6FF (Bleu)
.Potential Matches: #FFFF4D (Jaune)
.Conflict Matches: #FF6666 (Rouge)*/