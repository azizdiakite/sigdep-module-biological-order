import {
  Center,
  Divider,
  Loader,
  Paper,
  SelectItem,
  Text,
  Flex
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
import { initFormValues, notification } from '@spbogui-openmrs/shared/utils';
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
  requestDate
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
    arvInitialYear,
    hivTypeForm,
    isOntreatmentForm,
    treatmentStartDate,
    initialCd4AbsoluteForm,
    initialCd4PercentageForm, 
    treatmentLine,
    initialCd4DateForm,
    arvRegimen,
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
      if(initialCd4AbsoluteForm){
        form.values.initialCd4Absolute = initialCd4AbsoluteForm
      }
      
      if(initialCd4PercentageForm){
        form.values.initialCd4Percentage = initialCd4PercentageForm
      }

      if(initialCd4Absolute || initialCd4AbsoluteForm){
        form.values.latestCd4Absolute = initialCd4Absolute === undefined ?  initialCd4AbsoluteForm : initialCd4Absolute ;
      }
      
      if(initialCd4Percentage || initialCd4PercentageForm){
        form.values.latestCd4Percentage = initialCd4Percentage === undefined ? initialCd4PercentageForm : initialCd4Percentage ;
      }

      if(treatmentStartDate){        
        form.values.arvInitialYear = new Date(arvInitialYear)
      }

      if(initialCd4DateForm){        
        form.values.initialCd4Date = new Date(initialCd4DateForm);
        form.values.latestCd4Date = new Date(initialCd4DateForm);
      }

      if(hivTypeForm){

        if(hivTypeForm.display === initFormValues.HIV_1){
          form.values.hivType = Concepts.VIH_1
        }
        if(hivTypeForm.display === initFormValues.HIV_2) {
          form.values.hivType = Concepts.VIH_2
        } 
        if(hivTypeForm.display === initFormValues.HIV_1_2) {
          form.values.hivType = Concepts.VIH_1_2
        }
      }

      if(isOntreatmentForm){
        form.values.isOnTreatment = isOntreatmentForm.display === initFormValues.TREATMENT_YES ? 'true' : 'false' ;
      }
      
      if(arvRegimen){
        form.values.regime = arvRegimen.uuid ;
      }
      
      if (treatmentLine) {
         
        if(treatmentLine.display === initFormValues.THIRD_LINE_DESCRIPTION){
          form.values.regimeLine = Concepts.THIRD_TREATMENT_LINE
  
        }else if (treatmentLine.display === initFormValues.SECOND_LINE_DESCRIPTION) {
          form.values.regimeLine = Concepts.SECOND_TREATMENT_LINE
  
        }else if(treatmentLine.display === initFormValues.FIRST_LINE_DESCRIPTION){
          form.values.regimeLine = Concepts.FIRST_TREATMENT_LINE
  
        } else {
          form.values.regimeLine = Concepts.OTHER
        }
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
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          gap={{ base: 'sm', sm: 'lg' }}
          justify={{ sm: 'space-between' }}>
      
      <Text p={'xs'} color={'cyan'} weight={'bold'}>
        Formulaire de demande de charge virale
      </Text>
      { patient && patient.identifiers[1] ?(
         <Text p={'xs'} color={'cyan'} weight={'bold'}>
         UPID : {patient && patient.identifiers[1] && patient.identifiers[1].identifier}
       </Text>
      )
       : ""
      }
      
    
    
    </Flex>
         
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
