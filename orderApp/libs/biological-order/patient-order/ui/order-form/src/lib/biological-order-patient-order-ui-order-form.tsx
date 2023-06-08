import {
  Center,
  Divider,
  Loader,
  Paper,
  SelectItem,
  Text,
} from '@mantine/core';
import { joiResolver, useForm } from '@mantine/form';
import {
  orderFormSchema,
  OrderFormType,
  ORDER_FORM_INITIAL_VALUE,
} from './forms/order-form-type';
import OrderForm from './forms/order-form/order-form';
import { EncounterForm, Patient } from '@spbogui-openmrs/shared/model';
import {
  useFindConcept,
  useFindFilteredProvider,
  useSaveEncounter,
  useSaveOrder,
} from '@spbogui-openmrs/shared/ui';
import { useEffect, useState } from 'react';
import { notification } from '@spbogui-openmrs/shared/utils';
import { useFindLatestObs } from './use-find-latest-obs/use-find-latest-obs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { EncounterRole , Concepts} from '@spbogui-openmrs/shared/utils';

/* eslint-disable-next-line */
export interface BiologicalOrderPatientOrderUiOrderFormProps {
  patient?: Patient;
  requestDate?: Date;
}

export function BiologicalOrderPatientOrderUiOrderForm({
  patient,
  requestDate,
}: BiologicalOrderPatientOrderUiOrderFormProps) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [regimenList, setRegimenList] = useState<SelectItem[]>([]);
  const [orderForm, setOrderForm] = useState<EncounterForm | undefined>(
    undefined
  );
  const form = useForm<OrderFormType>({
    initialValues: ORDER_FORM_INITIAL_VALUE,
    validate: joiResolver(orderFormSchema) ,
  });

  const {
    pregnancyStatus,
    currentlyBreastfeedingChild,
    initialCd4Absolute,
    initialCd4Percentage,
    loading,
  } = useFindLatestObs(
    patient ? patient.uuid : '',
    dayjs(requestDate).format('YYYY-MM-DD'),
    ''
  );

  useEffect(() => {
    if (!requestDate) {
      navigate(`/patient-order/${patient ? patient.uuid : ''}`);
    }
  });

  const { providerSelect } = useFindFilteredProvider(
    '',
    'custom:(uuid,display)',
    true
  );

  const { concept, isLoading } = useFindConcept(
    Concepts.ARV_REGIMEN,
    'custom:(answers:(display,uuid))'
  );

  const handleSubmit = (values: OrderFormType) => {
    form.values.encounter.patient = patient ?patient.uuid : "";
    console.log(JSON.stringify(values));
    setOrderForm(form.values.encounter);
    setIsSaving(true);
  };

  useEffect(() => {
    if (!form.values.requestDate) {
      form.values.requestDate = requestDate;
    }
  }, [form, requestDate]);

  const loadValues = () => {
      if(pregnancyStatus){
        form.values.pregnancyStatus = pregnancyStatus.uuid
      }
      if(currentlyBreastfeedingChild){
        form.values.currentlyBreastfeedingChild = currentlyBreastfeedingChild.uuid
      }
      if(initialCd4Absolute){
        form.values.initialCd4Absolute = initialCd4Absolute
      }
      if(initialCd4Percentage){
        form.values.initialCd4Percentage =initialCd4Percentage
      }
  }

  useEffect(() => {
    if (concept && !isLoading && regimenList.length === 0) {
      setRegimenList(
        concept.answers.map((a) => {
          return { value: a.uuid, label: a.display };
        })
      );
    }
  }, [concept, isLoading, regimenList.length]);

  const { saveEncounter } = useSaveEncounter();
  const { saveOrder } = useSaveOrder();

  useEffect(() => {
    if (isSaving) {
      if (orderForm) {
        if (!orderForm.uuid) {
          saveEncounter(orderForm, {
            onSuccess: (data) => {
              console.log('Saved successfully Encounter');
              if (data && data.uuid) {
                const order = form.values.order;
                order.patient = data.patient.uuid;
                order.encounter = data.uuid;
                const orderer = form.values.encounter.encounterProviders.find(
                  (e) =>
                    e.encounterRole === EncounterRole.CLINICIAN
                );
                order.orderer = orderer ? orderer.provider : '';
                saveOrder(order, {
                  onSuccess: () => {
                    notification(
                      'id-success',
                      'success',
                      'Demande enregistrée avec succès',
                      '',
                      5000
                    );
                  },
                });
              }
            },
            onError: (error, variables, context) => {
              notification(
                'id-error',
                'error',
                "Demande non enregistrée en raison d'un problème",
                '',
                5000
              );
            },
          });
        }
      }

      setIsSaving(false);
    }
  }, [form.values.order, isSaving, orderForm, saveEncounter, saveOrder]);

  return (
    <>
      {loading && (
        <Center style={{ height: '50vh' }}>
          <Loader size={'xl'} />
        </Center>
      )}

      {!loading && (
        <>
        {loadValues()}
        <Paper withBorder>
          <Text p={'xs'} color={'cyan'} weight={'bold'}>
            Formulaire de demande de charge virale
          </Text>
          <Divider />
          <Paper m={'xs'} withBorder p={'xs'} color={'gray'}>
            <OrderForm
              form={form}
              patient={patient}
              handleSubmit={handleSubmit}
              providers={providerSelect}
              regimenList={regimenList}
            />
          </Paper>
        </Paper>
        </>
      )}
    </>
  );
}

export default BiologicalOrderPatientOrderUiOrderForm;
