import {
  Button,
  Container,
  Grid,
  Group,
  Paper,
  Radio,
  Select,
  SelectItem,
  Space,
  Table,
  Text,
  useMantineTheme,
  Alert
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { UseFormReturnType } from '@mantine/form';
import { Patient } from '@spbogui-openmrs/shared/model';
import { IconCalendar, IconCircle } from '@tabler/icons';
import dayjs from 'dayjs';
import { OrderFormType } from '../order-form-type';
import { createStyles } from '@mantine/core';
import { ObsInput } from '@spbogui-openmrs/shared/ui';
import { Concepts } from '@spbogui-openmrs/shared/utils';
import { openConfirmModal } from '@mantine/modals';
import { useFindLatestObs } from '../../use-find-latest-obs/use-find-latest-obs';

export const styles = createStyles((theme) => ({
  table: {
    // borderBottomColor: theme.colors.gray[3],
    // borderBottomStyle: 'solid',
    // borderBottomWidth: 1,
    // width: '100%',
    '& > tbody > tr > td': {
      borderStyle: 'solid',
      borderColor: theme.colors.gray[3],
      borderWidth: 1,
    },
  }
}));

/* eslint-disable-next-line */
export interface OrderFormProps {
  form: UseFormReturnType<OrderFormType>;
  patient?: Patient;
  providers: SelectItem[];
  regimenList: SelectItem[];
  isTransfered?: boolean,
  handleSubmit: (values: OrderFormType) => void;
  handleUpdateParent: () => void;
}
export function OrderForm({
  form,
  handleSubmit,
  handleUpdateParent,
  patient,
  providers,
  regimenList,
  isTransfered,
}: OrderFormProps) {
  const { classes } = styles();
  const theme = useMantineTheme();
  const currentDate = new Date(); 
  const futureDate =  new Date(dayjs(form.values.requestDate).format('YYYY-MM-DD'));
  function compareDates(date1: Date, date2: Date): number {
    const date1SansHeure = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const date2SansHeure = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    if (date1SansHeure < date2SansHeure) {
      return -1; // date1 est avant date2
    } else if (date1SansHeure > date2SansHeure) {
      return 1; // date1 est après date2
    } else {
      return 0; // date1 et date2 sont égales
    }
  }

  if(compareDates(futureDate, currentDate) == 0){
    futureDate.setDate(new Date().getDate());
  }else{
    futureDate.setDate(futureDate.getDate());
  }
  const pastDate = new Date();
  pastDate.setDate(currentDate.getDate() - 1);
  
  const {
    transfered
  } = useFindLatestObs(
    patient ? patient.uuid : '',
    dayjs(form.values.requestDate).format('YYYY-MM-DD'),
    ''
  );
  const openModal = () => openConfirmModal({
    title: 'Confirmation',
    centered: true,
    children: (
      <Text size="sm">
        Etes vous sur de vouloir continuer ?
       </Text>
    ),
    labels: { confirm: 'Confirmer', cancel: 'Annuler' },
    onCancel: () => console.log('Cancel'),
    onConfirm() {
       handleSubmit(form.values);
       handleUpdateParent();
       const timer = setTimeout(() => {
        window.history.back();
      }, 5000); // 5000 millisecondes = 5 secondes
      return () => clearTimeout(timer);
      //form.reset();
    },
  });

  return (
      <form>
      {patient && (
        <>
          { patient.person.dead ? (
            <Alert color="red" title="ATTENTION !!!!">
            La demande ne peut etre effectuée car le patient est décédé .
          </Alert>): ''}
      
          { isTransfered  ? (
            <Alert color="red" ml={'xl'}>
            {"Patient transféré à : "+ transfered?.value}
          </Alert>): ''}

        <Container id='print'  style={{
        border: patient.person.dead || isTransfered  ? '2px solid #ffe3e3': 'none', // Exemple de bordure de 2px solide rouge
        borderRadius: '8px', // Exemple de bord arrondi
      }}>
          <Text size={'lg'} mb={'lg'} weight={'bold'} color={'cyan.6'}>
            DONNEES PATIENT
             { /*JSON.stringify(form.values.latestViralLoadLaboratory) */}
          </Text>
          <Group mb={'xs'}>
            <Text size={'sm'}>Date de naissance : </Text>
            <Text weight={'bold'}>
              {dayjs(patient.person.birthdate).format('DD/MM/YYYY')}
            </Text>
          </Group>
          <Group mb={'xs'}>
            <Text size={'sm'}>Age : </Text>
            <Text weight={'bold'}>{patient.person.age}</Text>
            <Space />
            <Space />
            <Text size={'sm'}>Sexe : </Text>
            <Text>Masculin</Text>{' '}
            {patient.person.gender === 'M' ? (
              <IconCircle strokeWidth={6} color={'#00abfb'} size={20} />
            ) : (
              <IconCircle stroke={1} color={'gray'} size={20} />
            )}
            <Space />
            <Text>Féminin</Text>{' '}
            {patient.person.gender === 'F' ? (
              <IconCircle
                stroke={6}
                // color={'#00abfb'}
                style={{ color: theme.colors.blue[6] }}
                size={20}
              />
            ) : (
              <IconCircle stroke={1} color={'gray'} size={20} />
            )}
          </Group>
          {patient.person.gender === 'F'  &&(
            <Group>
              <Group>
                <Text size={'sm'} pb={'xs'}>
                  Grossesse :
                </Text>
                <ObsInput
                  concept={Concepts.PREGNANCY_STATUS}
                  form={form}
                  type={'radio'}
                  name={'pregnancyStatus'}
                  readOnly>

                  <Group>
                    <Text size={'sm'} pb={'xs'}>
                      Oui :{' '}
                    </Text>
                    <Radio value={Concepts.YES} />
                    <Text size={'sm'} pb={'xs'}>
                      Non :{' '}
                    </Text>
                    <Radio value={Concepts.NO} />
                  </Group>
                  </ObsInput>
              </Group>
              {/* <Text size={'sm'}>Grossesse : </Text>
              {patient.person.gender === 'F' ? <IconSquareX /> : <IconSquare />}
              <Space /> */}
              <Space /> 
              <Space /> 
              <Space /> 
              <Space />
              <Space />
              <Group>
                <Text size={'sm'} pb={'xs'}>
                  Allaitement :{' '}
                </Text>
                <ObsInput
                  concept={Concepts.CURRENTLY_BREAST_FEEDING}
                  form={form}
                  type={'radio'}
                  name={'currentlyBreastfeedingChild'}
                  readOnly
                >
                  <Group>
                    <Text size={'sm'} pb={'xs'}>
                      Oui :{' '}
                    </Text>
                    <Radio value={Concepts.YES} />
                    <Text size={'sm'} pb={'xs'}>
                      Non :{' '}
                    </Text>
                    <Radio value={Concepts.NO} />
                  </Group>
                  </ObsInput>
              </Group>

              {/* <Text size={'sm'}>Allaitement : </Text>
              decede : 7707/YF/14/00055
              transferer : 7707/YF/12/00025	
              {patient.person.gender === 'M' ? <IconSquareX /> : <IconSquare />} */}
            </Group>
          )}
          <Text size={'lg'} my={'lg'} weight={'bold'} color={'cyan.6'}>
            DONNEES CLINIQUES
          </Text>
          <Group>
            <Text size={'sm'}>Type de VIH : <span style={{ color: theme.colors.red[8] }}>*</span> </Text>
            <Space />
            <Space />
            <Space />
            <ObsInput
              type="radio"
              concept={Concepts.HIV_TYPE}
              form={form}
              name={'hivType'}
            >
              <Group>
                <Text size={'sm'} pb={'xs'}>
                  VIH-1 :
                </Text>
                <Radio value={Concepts.VIH_1} />

                <Text size={'sm'} pb={'xs'}>
                  VIH-2 :
                </Text>
                <Radio value={Concepts.VIH_2} />

                <Text size={'sm'} pb={'xs'}>
                  VIH-1 et VIH-2 :{' '}
                </Text>
                <Radio value={Concepts.VIH_1_2} />
              </Group>
            </ObsInput>
          </Group>
          <Group>
            <Text size={'sm'}>Le patient est-il actuellement sous ARV ?  <span style={{ color: theme.colors.red[8] }}>*</span></Text>
            <ObsInput
              concept={Concepts.STARTED_ARV_TREATMENT}
              name="isOnTreatment"
              form={form}
              type={'radio'}
            >
              <Group>
                <Text size={'sm'} pb={'xs'}>
                  Oui
                </Text>
                <Radio value={'true'} />
                <Text size={'sm'} pb={'xs'}>
                  Non
                </Text>
                <Radio value={"false"} />
              </Group>
            </ObsInput>
          </Group>
          <Group>
            <Text size={'sm'}>
              Si oui, Année initiation 1er traitement ARV{' '}
            </Text>
            <ObsInput
              form={form}
              name={'arvInitialYear'}
              concept={Concepts.ARV_START_DATE}
              readOnly={true}
              placeholder="......"
              variant={'unstyled'}
              maxDate={currentDate}
              type='date'
            />
          </Group>
          <Group>
            <Text size={'sm'}>Ligne thérapeutique :  <span style={{ color: theme.colors.red[8] }}>*</span></Text>
            <ObsInput
              name="regimeLine"
              concept={Concepts.ANTI_RETRO_TREATMENT_LINE}
              form={form}
              type={'radio'}
            >
              <Group>
                <Text size={'sm'} pb={'xs'}>
                  1
                  <sup>
                    <small>ère</small>
                  </sup>
                  Ligne:
                </Text>
                <Radio value={Concepts.FIRST_TREATMENT_LINE} />
                <Space />
                <Text size={'sm'} pb={'xs'}>
                  2
                  <sup>
                    <small>ème</small>
                  </sup>
                  Ligne:
                </Text>
                <Radio value={Concepts.SECOND_TREATMENT_LINE} />
                <Space />
                <Text size={'sm'} pb={'xs'}>
                  3
                  <sup>
                    <small>ème</small>
                  </sup>
                  Ligne:
                </Text>
                <Radio value={Concepts.THIRD_TREATMENT_LINE} />
                <Text size={'sm'} pb={'xs'}>
                  Autre ligne:
                </Text>
                <Radio value={Concepts.OTHER} />
                {/* <ObsInput
                  form={form}
                  name={'otherRegimeLine'}
                  concept={'CI0060002AAAAAAAAAAAAAAAAAAAAAAAAAAA'}
                  placeholder=".........................................................................."
                  variant={'unstyled'}
                /> */}
              </Group>
            </ObsInput>
          </Group>
          <Group mb={'sm'}>
            <Text size={'sm'}>Régime thérapeutique : <span style={{ color: theme.colors.red[8] }}>*</span></Text>
            <ObsInput
              form={form}
              name={'regime'}
              concept={Concepts.ARV_REGIMEN}
              data={regimenList}
              style={{color: form.values.regime ? "#F59E00": "#dc3545"}}
              {...(form.values.regime != undefined ? {readOnly: true}: {} )}
              type={'select'}
              placeholder={'.........................................'}
              variant={'unstyled'}
             //style={{ width: '70%' }}
            />
            {/* <Select
              data={[]}
              // value={'ok'}
            /> */}
          </Group>
          <Paper withBorder p={'xs'}>
          <Group mb={'sm'}>
            <Text  size={'sm'} weight="bold" underline>
              Motif de la demande de la CV
            </Text>
            <ObsInput
              form={form}
              name={'requestReason'}
              concept={Concepts.REASON_FOR_VIRAL_LOAD_REQUEST}
              type={'radio'}
            >
              <Group pt={'xs'}>
                <Text size={'sm'} pb={5}>
                  CV contrôle sous ARV
                </Text>
                <Radio
                  // label={'CV contrôle sous ARV'}
                  value={Concepts.CONTROL_VIRAL_LOAD}
                />
                <Space />
                <Text size={'sm'} pb={5}>
                  Échec virologique
                </Text>
                <Radio
                  // label={'CV contrôle sous ARV'}
                  value={Concepts.VIROLOGIC_FAILURE}
                />
                <Space />
                <Text size={'sm'} pb={5}>
                  Échec immunologique
                </Text>    
                <Radio
                  // label={'CV contrôle sous ARV'}
                  value={Concepts.IMUNOLOGOC_FAILURE}
                />
                
                <Space />
                <Text size={'sm'} pb={8}>
                  Échec clinique
                </Text>
                <Radio
                  // label={'CV contrôle sous ARV'}
                  value={Concepts.CLINICAL_FAILURE}
                />
              </Group>
            </ObsInput>
            </Group>
            <Group mb={'sm'}>
            <Text size={'sm'} pb={5}>
                  Autres (à préciser)
                </Text>
            <ObsInput
                  style={{ width: '20%' }}
                  variant="unstyled"
                  placeholder={
                    '..................................................................'
                  }
                  concept={Concepts.OTHER_REASON}
                  form={form}
                  name={'otherCVReason'}
                />
            </Group>
          </Paper>

          <Grid my={'md'} pl={'lg'}>
            <Grid.Col span={6} p={'lg'}>
              <Text size={'sm'} weight={'bold'} underline mb={'sm'}>
                A l'initiation du traitement
              </Text>
              <Group>
                <Text size={'sm'}>CD4 valeur absolue :</Text>
                <ObsInput
                  form={form}
                  type={'number'}
                  name={'initialCd4Absolute'}
                  concept={Concepts.INNITIAL_CD4_COUNT}
                  {...(form.values.initialCd4Absolute != undefined ? {readOnly: true}: {} )}
                  variant="unstyled"
                  placeholder={'.........................................'}
                />
              </Group>
              <Group>
                <Text size={'sm'}>CD4 pourcentage :</Text>
                <ObsInput
                  form={form}
                  name={'initialCd4Percentage'}
                  concept={Concepts.INNITIAL_CD4_PERCENT}
                  {...(form.values.initialCd4Percentage != undefined ? {readOnly: true}: {} )}
                  variant="unstyled"
                  placeholder={'.........................................'}
                  
                />
              </Group>
              <Group>
                <Text size={'sm'}>Date :</Text>
                <ObsInput
                  form={form}
                  name={'initialCd4Date'}
                  concept={Concepts.INNITIAL_CD4_DATE}
                  variant="unstyled"
                  {...(form.values.initialCd4Date != undefined ? {readOnly: true}: {} )}
                  placeholder={'__/__/____'}
                  type={'date'}
                />
              </Group>
            </Grid.Col>
            <Grid.Col span={6} p={'lg'}>
              <Text size={'sm'} weight={'bold'} underline mb={'sm'}>
                A la demande de Charge virale
              </Text>
              <Group>
                <Text size={'sm'}>CD4 valeur absolue :</Text>
                <ObsInput
                  form={form}
                  name={'latestCd4Absolute'}
                  concept={Concepts.LATE_CD4_COUNT}
                  readOnly={true}
                  variant="unstyled"
                  placeholder={'.........................................'}
                />
              </Group>
              <Group>
                <Text size={'sm'}>CD4 pourcentage :</Text>
                <ObsInput
                  form={form}
                  name={'latestCd4Percentage'}
                  concept={Concepts.LATE_CD4_PERCENT}
                  readOnly={true}
                  variant="unstyled"
                  placeholder={'.........................................'}
                />
              </Group>
              <Group>
                <Text size={'sm'}>Date :</Text>
                <ObsInput
                  form={form}
                  name={'latestCd4Date'}
                  concept={Concepts.LATE_CD4_DATE}
                  variant="unstyled"
                  {...(form.values.latestCd4Date != undefined ? {readOnly: true}: {} )}
                  placeholder={'__/__/____'}
                  type={'date'}
                />
              </Group>
            </Grid.Col>
          </Grid>
          <Group>
            <Text size={'sm'}>
              Le patient a-t-il déjà bénéficié d’une mesure de charge virale ? <span style={{ color: theme.colors.red[8] }}>*</span>
            </Text>
            <ObsInput
              form={form}
              name={'hasViralLoad'}
              concept={Concepts.HAS_VIRAL_LOAD}
              variant="unstyled"
              type={'radio'}
            >
              <Group>
                <Text size={'sm'} pb={'xs'}>
                  Oui :{' '}
                </Text>
                <Radio value={Concepts.YES} />
                <Text size={'sm'} pb={'xs'}>
                  Non :{' '}
                </Text>
                <Radio value={Concepts.NO} />
              </Group>
            </ObsInput>
          </Group>
        
            <Group>
            <Text size={'sm'}>Si oui,</Text>
            <Text size={'sm'}>Valeur : </Text>
            <ObsInput
              form={form}
              name={'latestViralLoad'}
              concept={Concepts.LAST_VIRAL_LOAD}
              variant="unstyled"
              type='text'
              placeholder={'........................................................'}
            />
          <Text size={'sm'}>préciser le laboratoire : </Text>
          <ObsInput
            form={form}
            name={'latestViralLoadLaboratory'}
            concept={Concepts.LAST_VIRAL_LOAD_LABORATORY}
            variant="unstyled"
         //   readOnly={form.values.latestViralLoadLaboratory ? true: false}
         readOnly
            placeholder={'......................................................'}
              />
          </Group>
          <Group>
          <Text size={'sm'}>Date </Text>
            <ObsInput
              form={form}
              name={'latestViralLoadDate'}
              concept={Concepts.LAST_VIRAL_LOAD_DATE}
              variant="unstyled"
              placeholder={'__/__/____'}
              {...(form.values.latestViralLoadDate != undefined ? {readOnly: true}: {} )}
              type={'date'}
              readOnly
            />
          </Group>
          <Text
            size={'lg'}
            my={'lg'}
            weight={'bold'}
            color={'cyan.6'}
            transform={'uppercase'}
          >
            Identification du prélèvement
          </Text>
          <Paper withBorder>
            <Table className={classes.table}>
              <tbody>
                <tr>
                  <td>
                    <Group mb={'xs'}>
                      <Text size={'sm'}>Nom du clinicien  <span style={{ color: theme.colors.red[8] }}>*</span></Text>
                      <Select
                        searchable
                        data={providers}
                        variant={'unstyled'}
                        {...form.getInputProps(
                          'encounter.encounterProviders.0.provider'
                        )}
                      />
                    </Group>
                    <Group mb={'xs'}>
                      <Text size={'sm'}>Date de la demande de l'analyse  <span style={{ color: theme.colors.red[8] }}>*</span></Text>
                      <ObsInput
                        concept={Concepts.VIRAL_LOAD_REQUEST_DATE}
                        variant="unstyled"
                        placeholder={'__/__/____'}
                        form={form}
                        name={'requestDate'}
                        type={'date'}
                        readOnly
                      />
                    </Group>

                    <Group mb={'xs'}>
                      <Text size={'sm'}>N° Tel clinicien</Text>
                      <ObsInput
                        concept={Concepts.CLINICIAN_PHONE_NUMBER}
                        variant="unstyled"
                        placeholder={'.....................................'}
                        form={form}
                        name={'clinicianPhoneNumber'}
                        type={'number'}
                      />
                    </Group>
                    <Group mb={'xs'}>
                      <Text size={'sm'}>E-mail clinicien</Text>
                      <ObsInput
                        concept={Concepts.CLINICAL_EMAIL}
                        variant="unstyled"
                        placeholder={'.....................................'}
                        form={form}
                        name={'clinicianEmail'}
                        type={'text'}
                      />
                    </Group>
                  </td>
                  <td>
                    <Group mb={'xs'}>
                      <Text size={'sm'}>Nom du préleveur  <span style={{ color: theme.colors.red[8] }}>*</span></Text>
                      <Select
                        data={providers}
                        searchable
                        variant={'unstyled'}
                        {...form.getInputProps(
                          'encounter.encounterProviders.1.provider'
                        )}
                      />
                    </Group>
                    <Group mb={'xs'}>
                      <Text size={'sm'}>Date du prélèvement  <span style={{ color: theme.colors.red[8] }}>*</span></Text>
                      <DatePicker
                        variant="unstyled"
                        icon={<IconCalendar />}
                        locale="fr"
                        inputFormat="DD/MM/YYYY"
                        minDate={futureDate}
                        maxDate={new Date()}
                        placeholder={'__/__/____'}
                        {...form.getInputProps('encounter.encounterDatetime')}
                        readOnly
                      />
                    </Group>
                    
                    <Group mb={'xs'}>
                      <Text size={'sm'}>Heure du prélèvement</Text>
                      <ObsInput
                        concept={Concepts.VIRAL_LOAD_REQUEST_TIME}
                        variant="unstyled"
                        placeholder={'__/__/____'}
                        form={form}
                        name={'encounterTime'}
                        type={'time'}
                        readOnly
                      />
                    </Group>
                    <Group mb={'xs'} >
                      <Text size={'sm'} >Type de prélèvement  <span style={{ color: theme.colors.red[8] }}>*</span></Text>

                      <ObsInput
                        type={'select'}
                        form={form}
                        name={'collectionType'}
                        concept={Concepts.COLLECTION_TYPE}
                        data={[
                          {
                            value: Concepts.PLASMA,
                            label: 'Plasma',
                          },
                          {
                            value: Concepts.DBS,
                            label: 'DBS',
                          },
                          {
                            value: Concepts.PSC,
                            label: 'PSC',
                          },
                        ]}
                        variant={'unstyled'}
                      />
                    </Group>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Paper>
          {/* {JSON.stringify(form.values.encounter)}  */}
          {/* {JSON.stringify(form.errors)}   */}
        </Container>
        { patient.person.dead ? ' ': (
          <Group position="center" p={'xs'}>
             <Button onClick={openModal}  disabled={!form.isValid()}>Enregistrer</Button>
           </Group>
          )
          }
        </>
      )}

      </form>
  );
}

export default OrderForm;
