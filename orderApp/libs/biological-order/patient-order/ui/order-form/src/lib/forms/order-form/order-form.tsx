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
} from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { UseFormReturnType } from '@mantine/form';
import { Patient } from '@spbogui-openmrs/shared/model';
import { IconCalendar, IconCircle } from '@tabler/icons';
import dayjs from 'dayjs';
import { OrderFormType } from '../order-form-type';
import { createStyles } from '@mantine/core';
import { ObsInput } from '@spbogui-openmrs/shared/ui';
import { Concepts } from '@spbogui-openmrs/shared/utils';

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
  },
}));

/* eslint-disable-next-line */
export interface OrderFormProps {
  form: UseFormReturnType<OrderFormType>;
  patient?: Patient;
  providers: SelectItem[];
  regimenList: SelectItem[];
  handleSubmit: (values: OrderFormType) => void;
}

export function OrderForm({
  form,
  handleSubmit,
  patient,
  providers,
  regimenList,
}: OrderFormProps) {
  const { classes } = styles();
  const theme = useMantineTheme();
  const currentDate = new Date(); 
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      {patient && (
        <>
        {/* {form.values.encounter.patient = patient.uuid} */}
        <Container>
          <Text size={'lg'} mb={'lg'} weight={'bold'} color={'cyan.6'}>
            DONNEES PATIENT
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
              {patient.person.gender === 'M' ? <IconSquareX /> : <IconSquare />} */}
            </Group>
           )}
          <Text size={'lg'} my={'lg'} weight={'bold'} color={'cyan.6'}>
            DONNEES CLINIQUES
          </Text>
          <Group>
            <Text size={'sm'}>Type de VIH : </Text>
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
            <Text size={'sm'}>Le patient est-il actuellement sous ARV ?</Text>
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
              placeholder="......"
              variant={'unstyled'}
              maxDate={currentDate}
              type='date'
            />
          </Group>
          <Group>
            <Text size={'sm'}>Ligne thérapeutique : </Text>
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
            <Text size={'sm'}>Régime thérapeutique :</Text>
            <ObsInput
              form={form}
              name={'regime'}
              concept={Concepts.ARV_REGIMEN}
              data={regimenList}
              type={'select'}
              placeholder={'.........................................'}
              variant={'unstyled'}
              style={{ width: '70%' }}
            />
            {/* <Select
              data={[]}
              // value={'ok'}
            /> */}
          </Group>
          <Paper withBorder p={'xs'}>
          <Group mb={'sm'}>
            <Text size={'sm'} weight="bold" underline>
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
                  name={'initialCd4Absolute'}
                  concept={Concepts.INNITIAL_CD4_COUNT}
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
                  placeholder={'__/__/____'}
                  type={'date'}
                />
              </Group>
            </Grid.Col>
          </Grid>
          <Group>
            <Text size={'sm'}>
              Le patient a-t-il déjà bénéficié d’une mesure de charge virale ?
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
              placeholder={'.........................................'}
            />
            <Space />
            <Space />
            <Space />

            <Text size={'sm'}>Date </Text>
            <ObsInput
              form={form}
              name={'latestViralLoadDate'}
              concept={Concepts.LAST_VIRAL_LOAD_DATE}
              variant="unstyled"
              placeholder={'__/__/____'}
              type={'date'}
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
                      <Text size={'sm'}>Nom du clinicien</Text>
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
                      <Text size={'sm'}>Date de la demande de l'analyse</Text>
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
                  </td>
                  <td>
                    <Group mb={'xs'}>
                      <Text size={'sm'}>Nom du préleveur</Text>
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
                      <Text size={'sm'}>Date du prélèvement</Text>
                      <DatePicker
                        variant="unstyled"
                        icon={<IconCalendar />}
                        locale="fr"
                        inputFormat="DD/MM/YYYY"
                        maxDate={currentDate}
                        placeholder={'__/__/____'}
                        {...form.getInputProps('encounter.encounterDatetime')}
                      />
                    </Group>
                    <Group mb={'xs'}>
                      <Text size={'sm'}>Heure du prélèvement</Text>
                      <TimeInput variant="unstyled" />
                    </Group>
                    <Group mb={'xs'}>
                      <Text size={'sm'}>Type de prélèvement</Text>

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
                        ]}
                        variant={'unstyled'}
                      />
                    </Group>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Paper>

          <Group position="center" p={'xs'}>
            <Button type={'submit'}>Enregistrer</Button>
          </Group>
          {/* {JSON.stringify(form.values.encounter)}  */}
          {/* {JSON.stringify(form.errors)}   */}
        </Container>
        </>
      )}
      
    </form>
  );
}

export default OrderForm;
