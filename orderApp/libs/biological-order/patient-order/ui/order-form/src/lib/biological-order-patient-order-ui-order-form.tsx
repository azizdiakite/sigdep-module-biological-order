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
import { EncounterForm, Patient, PatientIdentifier } from '@spbogui-openmrs/shared/model';
import {
  useFindConcept,
  useFindFilteredProvider,
  useFindOnePatient,
  useSaveEncounter,
  useSaveOrder,
} from '@spbogui-openmrs/shared/ui';
import { useEffect, useState } from 'react';
import { ENCOUNTER_PROVIDER_DEFAULT, IdentifierType, initFormValues, notification, siteList } from '@spbogui-openmrs/shared/utils';
import { useFindLatestObs } from './use-find-latest-obs/use-find-latest-obs';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { EncounterRole , Concepts} from '@spbogui-openmrs/shared/utils';
import invariant from 'invariant';

/* eslint-disable-next-line */
export interface BiologicalOrderPatientOrderUiOrderFormProps {
  patient?: Patient;
  requestDate?: Date;
  isTransfered?: boolean
  handleUpdateParent: () => void;
}

export function BiologicalOrderPatientOrderUiOrderForm({
  patient,
  requestDate,
  isTransfered,
  handleUpdateParent
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

  const upid  = localStorage.getItem('upid') ? localStorage.getItem('upid'): '';;

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
    antiretroviralPlan,
    hasViralLoad,
    lastViralLoad,
    lastViralLaboratoryLoad,
    lastViralDateLoad,
    hivViralLoadTest,
    accessionNumber,
    accessionNumberDateCreated,
    //lastCd4CountValue,
    //lastCd4PercentValue,
    //lastCd4Date,
    grossHivViralLoadTest,
    initialCD4CountValue,
    initialCD4PercentValue,
    initialCD4DateValue,
    initialCd4AbsoluteObs,
    initialCd4PercentageObs,
    biologicalEncounter,
    lastClotureEncounter,
    lastestHivViralLoad
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

  //const defaultProvider = providerSelect?.find((p) => p.value === ENCOUNTER_PROVIDER_DEFAULT)
  //console.log({defaultProvider: defaultProvider});

  const { concept, isLoading } = useFindConcept(
    Concepts.ARV_REGIMEN,
    'custom:(answers:(display,uuid))'
  );

  const handleSubmit = (values: OrderFormType) => {
    form.values.encounter.patient = patient ?patient.uuid : "";
    console.log(JSON.stringify(values));
    setOrderForm(form.values.encounter);
    setIsSaving(true);
    handleUpdateParent();
  };


  useEffect(() => {
      form.values.requestDate = requestDate;    
      form.values.encounter.encounterDatetime = requestDate;
  }, [form, requestDate]);

  const loadValues = () => {

      if(pregnancyStatus){
        form.values.pregnancyStatus = pregnancyStatus.uuid
      }
      if(currentlyBreastfeedingChild){
        form.values.currentlyBreastfeedingChild = currentlyBreastfeedingChild.uuid
      }
     /* if(initialCd4AbsoluteForm){
        console.log({initialCd4AbsoluteForm: initialCd4AbsoluteForm});
        
        form.values.initialCd4Absolute = initialCd4Absolute
      }
      
      if(initialCd4PercentageForm){
        console.log({initialCd4PercentageForm: initialCd4Percentage});
        
        form.values.initialCd4Percentage = initialCd4Percentage
      }*/
      let countValue = biologicalEncounter?.obs?.find((o) => o.concept.uuid === Concepts.INNITIAL_CD4_COUNT_INIT_FORM);
      if(countValue){
         form.values.latestCd4Absolute =  countValue?.value;
      }else{
         form.values.latestCd4Absolute = undefined
      }

      let percentValue = biologicalEncounter?.obs?.find((o) => o.concept.uuid === Concepts.INNITIAL_CD4_PERCENT_INIT_FORM);
      if(percentValue){
        const convertedValue = parseFloat(percentValue?.value); 
        form.values.latestCd4Percentage = convertedValue.toString();
      }else{
        form.values.latestCd4Percentage = undefined;
      }

      if(biologicalEncounter){ 
        form.values.latestCd4Date = new Date(biologicalEncounter?.encounterDatetime);
       }else{
        form.values.latestCd4Date = undefined
      }

      if(initialCD4PercentValue){
        const convertedValue = parseFloat(initialCD4PercentValue?.value)
        form.values.initialCd4Percentage = Math.floor(convertedValue).toString()
      }else{
        form.values.initialCd4Percentage = undefined;
      }

      if(initialCD4CountValue){
        form.values.initialCd4Absolute = initialCD4CountValue?.value
      }else{
        form.values.initialCd4Absolute = undefined;
      }

      if(initialCD4DateValue){        
        form.values.initialCd4Date = new Date(initialCD4DateValue?.value);
      }else{
        form.values.initialCd4Date = undefined;
      }

      /*if(initialCd4Absolute || lastCd4CountValue){        
        form.values.latestCd4Absolute = lastCd4CountValue === undefined ? initialCd4AbsoluteForm :  lastCd4CountValue  ;
      }
      
      if(initialCd4Percentage || lastCd4PercentValue){
        form.values.latestCd4Percentage = lastCd4PercentValue === undefined ? initialCd4PercentageForm :lastCd4PercentValue   ;
      }*/

      if(initialCd4DateForm){        
        form.values.arvInitialYear = new Date(initialCd4DateForm);
      }else if(arvInitialYear){
        form.values.arvInitialYear = new Date(arvInitialYear);
      }else if(treatmentStartDate){
        form.values.arvInitialYear = new Date(treatmentStartDate);
      }else{
        form.values.arvInitialYear = undefined;
      }

     /* if(initialCd4AbsoluteObs){        
        form.values.latestCd4Date = new Date(initialCd4AbsoluteObs[0]?.encounter?.encounterDatetime);
      }else if(initialCd4PercentageObs){
        form.values.latestCd4Date = new Date(initialCd4PercentageObs[0]?.encounter?.encounterDatetime);
      }else{
        form.values.latestCd4Date = undefined;
      }*/

     

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

      if(antiretroviralPlan){        
        form.values.isOnTreatment = antiretroviralPlan.uuid === Concepts.NONE ? 'false' : 'true' ;
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

    /*  if(providerSelect !== undefined){
        form.values.encounter.encounterProviders[0].provider = defaultProvider?.value ?? '';
      }*/
       
     

      if(grossHivViralLoadTest !== undefined){

        form.values.hasViralLoad = Concepts.YES;
        form.values.latestViralLoad = grossHivViralLoadTest.toString();
        
        if(accessionNumber){          
          const prefix = accessionNumber.replace(/[^a-zA-Z]/g, '');
          form.values.latestViralLoadLaboratory = siteList.find(site => site.code.includes(prefix))?.name || undefined;

          if(accessionNumberDateCreated){
            form.values.latestViralLoadDate =  new Date(accessionNumberDateCreated); //new Date(lastViralDateLoad);
          }
        }
      }else if(lastestHivViralLoad !== undefined){
          let hivViralLoadTestValue = lastestHivViralLoad?.obs?.find((o) => o.concept.uuid === Concepts.HIV_VIRAL_LOAD_TEST)?.value;
          form.values.hasViralLoad = Concepts.YES;
          form.values.latestViralLoad = hivViralLoadTestValue.toString();
          form.values.latestViralLoadDate =  new Date(lastestHivViralLoad?.encounterDatetime); //new Date(lastViralDateLoad);
      }else{
        form.values.hasViralLoad = Concepts.NO;
        form.values.latestViralLoad = undefined;
        form.values.latestViralLoadDate = undefined;
        form.values.latestViralLoadLaboratory = undefined;
      }


      if (localStorage.getItem('location_uuid') === null) {
         form.values.encounter.location = localStorage.getItem('location_uuid') ?? '';
      }else{
        form.values.encounter.location = localStorage.getItem('location_uuid') ?? '';
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
          orderForm.encounterDatetime = form.values.requestDate;
          saveEncounter(orderForm, {
            onSuccess: (data) => {
              console.log('Saved successfully Encounter');
              console.log({data: data});
              if (data && data.uuid) {
                const order = form.values.order;
                order.patient = data.patient.uuid;
                order.encounter = data.uuid;
                const orderer = form.values.encounter.encounterProviders.find(
                  (e) =>
                    e.encounterRole === EncounterRole.CLINICIAN
                );
                order.orderer = orderer ? orderer.provider : '';
                console.log({order_to_send: order});
                
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
      
      <Text></Text>
      { patient && patient.identifiers[1] ?(
         <Text p={'xs'} color={'cyan'} weight={'bold'}>
         UPID : {upid}
       </Text>
      )
       : ""
      }
    </Flex>
          <Divider />
          <Paper ml={'0'} mr={'0'} color={'gray'}>
            <OrderForm
              form={form}
              patient={patient}
              handleSubmit={handleSubmit}
              handleUpdateParent={handleUpdateParent}
              providers={providerSelect}
              regimenList={regimenList}
              isTransfered={isTransfered}
            />
          </Paper>
        </Paper>
        </>
      )}
    </>
  );
}

export default BiologicalOrderPatientOrderUiOrderForm;
