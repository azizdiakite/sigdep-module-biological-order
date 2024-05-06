import { useFindLastBilanEncounter, useFindLastClotureEncounter, useFindLastEnrollmentEncounter, useFindObs, useFindObsByEncounter, useFindObsByForm } from '@spbogui-openmrs/shared/ui';
import { Concepts, EncounterType, customEncounterParams } from '@spbogui-openmrs/shared/utils';

export const useFindLatestObs = (
  patient: string,
  lastDate: string,
  location: string
) => {
  const view = 'custom:(value,concept,encounter:(form,encounterDatetime),dateCreated:(datatype),location:(uuid,name,description))';
  const FICHE_INITIALE_ADULTE_08 ="fe57267c-cc76-45d5-9a94-a706fd0b9d82";
  const BILAN_BIOLOGIQUE_04 ="2db4f47f-8d19-4740-acea-fc8feb585b7a"
  // Pregnancy Status
    const { obs: pregnancyStatusObs, isLoading: loadingPregnancyStatus } = useFindObs(patient,Concepts.PREGNANCY_STATUS,``,view);
    const pregnancyStatus =pregnancyStatusObs.length === 1 ? pregnancyStatusObs[0].value : undefined;

    // Currently Breastfeeding Child
    const {obs: currentlyBreastfeedingChildObs,isLoading: loadingCurrentlyBreastfeedingChild,} = useFindObs(patient,Concepts.BREAST_FEEDING_CHILD,``,view);
    const currentlyBreastfeedingChild = currentlyBreastfeedingChildObs.length === 1 ? currentlyBreastfeedingChildObs[0].value : undefined;
  // console.log({currentlyBreastfeedingChild: currentlyBreastfeedingChild});

    // Initial Cd4 Absolute
    const { obs: initialCd4AbsoluteObs, isLoading: loadingInitialCd4Absolute } = useFindObs(patient,Concepts.INNITIAL_CD4_COUNT, ``, view);
    const initialCd4Absolute = initialCd4AbsoluteObs.length === 1 ? initialCd4AbsoluteObs[0].value: undefined;
    //console.log({initialCd4AbsoluteObs: initialCd4AbsoluteObs});
    

    // initial Cd4 Percentage
    const {obs: initialCd4PercentageObs,isLoading: loadingInitialCd4Percentage,} = useFindObs(patient,Concepts.INNITIAL_CD4_PERCENT,``,view);
    const initialCd4Percentage = initialCd4PercentageObs.length === 1 ? initialCd4PercentageObs[0].value : undefined;
   // console.log({initialCd4PercentageObs: initialCd4PercentageObs});
    
  // Initial Hiv value  
    const { obs: initialHivObs, isLoading: loadingInitialHiv } = useFindObs(patient,Concepts.HIV_TYPE, ``, view);
    const initialHiv = initialHivObs.length === 1 ? initialHivObs[0].value: undefined;

    // ARV arvInitialYear 
    const { obs: arvInitialYearObs, isLoading: loadingArvInitialYear } = useFindObs(patient,Concepts.ARV_START_DATE_INIT_FORM, ``, view);
    const arvInitialYear = arvInitialYearObs.length === 1 ? arvInitialYearObs[0].value: undefined;    
    //console.log({arvInitialYear : arvInitialYear});

    // ARV Line treatment 
    const { obs: arvLineTreatmentObs, isLoading: loadingArvLineTreatmentObs} = useFindObs(patient,Concepts.ANTI_RETRO_TREATMENT_LINE, ``, view);
    const arvLineTreatment = arvLineTreatmentObs.length === 1 ? arvLineTreatmentObs[0].value: undefined;

    // ARV Line Regime 
    const { obs: arvRegimeObs, isLoading: loadingArvRegimeObs} = useFindObs(patient,Concepts.ARV_REGIMEN, ``, view);
    const arvRegime = arvRegimeObs.length === 1 ? arvRegimeObs[0].value: undefined;    

    // Patient has viral load
    const { obs: hasViralLoadObs, isLoading: loadingHasViralLoadObs} = useFindObs(patient,Concepts.HAS_VIRAL_LOAD, ``, view);
    const hasViralLoad = hasViralLoadObs.length === 1 ? hasViralLoadObs[0].value: undefined;
    
    // Last viral load
    const { obs: lastViralLoadObs, isLoading: loadingLastViralLoadObs} = useFindObs(patient,Concepts.LAST_VIRAL_LOAD, ``, view);
    const lastViralLoad = lastViralLoadObs.length === 1 ? lastViralLoadObs[0].value: undefined;

    // Last viral load Lab
    const { obs: lastViralLaboratoryLoadObs, isLoading: loadingLastViralLaboratoryLoadObs} = useFindObs(patient,Concepts.LAST_VIRAL_LOAD_LABORATORY, ``, view);
    const lastViralLaboratoryLoad = lastViralLaboratoryLoadObs.length === 1 ? lastViralLaboratoryLoadObs[0].value: undefined;

    // Last viral load date
    const { obs: lastViralDateLoadObs, isLoading: loadingLastViralDateLoadObs} = useFindObs(patient,Concepts.LAST_VIRAL_LOAD_DATE, ``, view);
    const lastViralDateLoad = lastViralDateLoadObs.length === 1 ? lastViralDateLoadObs[0].value: undefined;
    //console.log({lastViralDateLoad: lastViralDateLoadObs});

    // Hiv type
    const { obs: hivTypeFormObs, isLoading: loadingHivTypeFormObs} = useFindObs(patient,Concepts.HIV_TYPE_INIT_FORM, ``, view);
    const hivTypeForm = hivTypeFormObs.length === 1 ? hivTypeFormObs[0].value: undefined;

    // Is on treatment
    const { obs: isOntreatmentFormObs, isLoading: loadingIsOntreatmentFormObs} = useFindObs(patient, Concepts.STARTED_ARV_TREATMENT_INIT_FORM, ``, view);
    const isOntreatmentForm = isOntreatmentFormObs.length === 1 ? isOntreatmentFormObs[0].value: undefined;  

    // Treatemnt start date
     const { obs: treatmentStartDateObs, isLoading: loadingTreatmentStartDateObs} = useFindObs(patient, Concepts.ARV_START_DATE_INIT_FORM , ``, view);
     const treatmentStartDate = treatmentStartDateObs.length === 1 ? treatmentStartDateObs[0].value: undefined;  


     const { obs: initialCd4AbsoluteFormObs, isLoading: loadingInitialCd4AbsoluteFormObs} = useFindObs(patient, Concepts.INNITIAL_CD4_COUNT_INIT_FORM, ``, view);
     const initialCd4AbsoluteForm = initialCd4AbsoluteFormObs.length === 1 ? initialCd4AbsoluteFormObs[0].value: undefined;

     // initial C4 percent
     const { obs: initialCd4PercentageFormObs, isLoading: loadingInitialCd4PercentageFormObs} = useFindObs(patient, Concepts.INNITIAL_CD4_PERCENT_INIT_FORM, ``, view);
     const initialCd4PercentageForm = initialCd4PercentageFormObs.length === 1 ? initialCd4PercentageFormObs[0].value: undefined;
    // console.log({initialCd4PercentageForm: initialCd4PercentageForm});
     

    // initial C4 Date
    const { obs: initialCd4DateFormObs, isLoading: loadingInitialCd4DateFormObs} = useFindObs(patient, Concepts.INNITIAL_CD4_DATE_INIT_FORM, ``, view);
    const initialCd4DateForm = initialCd4DateFormObs.length === 1 ? initialCd4DateFormObs[0].value: undefined;  
     
     // Treatment Line
     const { obs: treatmentLineObs, isLoading: loadingTreatmentLineObs} = useFindObs(patient, Concepts.TREATMENT_LINE_INIT_FORM, ``, view);
     const treatmentLine = treatmentLineObs.length === 1 ? treatmentLineObs[0].value: undefined;
     
      // Arv regimen
     const { obs: arvRegimenObs, isLoading: loadingArvRegimenObs} = useFindObs(patient,Concepts.ARV_REGIMEN_INIT_FORM, ``, view);
     const arvRegimen = arvRegimenObs.length === 1 ? arvRegimenObs[0].value: undefined;
    // console.log({arvRegimen : arvRegimen});

    const { obs: transferedObs, isLoading: loadingTransferedObs} = useFindObs(patient,Concepts.TRANSFERERD,``, view);
    const transfered = transferedObs.length === 1 ? transferedObs[0]: undefined; 

    const { obs: selfStopTreatmentObs, isLoading: loadingSelfStopTreatmentObs} = useFindObs(patient,Concepts.SELF_STOP_TREATMENT,``, view);
    const selfStopTreatment = selfStopTreatmentObs.length === 1 ? selfStopTreatmentObs[0].value: undefined; 
    //console.log({selfStopTreatment : selfStopTreatment});


    const { obs: negatifVihObs, isLoading: loadingSNegatifVihObs} = useFindObs(patient,Concepts.NEGATIF_VIH,``, view);
    const negatifVih = negatifVihObs.length === 1 ? negatifVihObs[0].value: undefined; 
   // console.log({negatifVih : negatifVih});


    const { obs: antiretroviralPlanObs, isLoading: loadingAntiretroviralPlanObs} = useFindObs(patient, Concepts.ANTIRETROVIRAL_PLAN, ``, view);
    const antiretroviralPlan = antiretroviralPlanObs.length === 1 ? antiretroviralPlanObs[0].value: undefined; 
   // console.log({antiretroviralPlan : antiretroviralPlan});
  
   const { obs: hivViralLoadTestObs, isLoading: loadingHivViralLoadTestObs} = useFindObs(patient, Concepts.HIV_VIRAL_LOAD_TEST, ``, view);
   const hivViralLoadTest = hivViralLoadTestObs.length === 1 ? hivViralLoadTestObs[0].value: undefined; 

  const { obs: grossHivViralLoadTestObs, isLoading: loadingGrossHivViralLoadTestObs} = useFindObs(patient, Concepts.GROSS_HIV_VIRAL_LOAD, ``, view);
  const grossHivViralLoadTest = grossHivViralLoadTestObs.length === 1 ? grossHivViralLoadTestObs[0].value: undefined; 
  //console.log({grossHivViralLoadTest: hivViralLoadTestObs});

  const { obs: accessionNumberObs, isLoading: loadingAccessionNumberObs} = useFindObs(patient, Concepts.ACCESSION_NUMBER, ``, view);
  const accessionNumber = accessionNumberObs.length === 1 ? accessionNumberObs[0].value: undefined; 
  const accessionNumberDateCreated = accessionNumberObs.length === 1 ? accessionNumberObs[0].dateCreated: undefined; 
  //console.log({accessionNumber: accessionNumberDateCreated});
    

  /****   INFOS FICHE INITIAL */
  let { lastEnrollmentEncounter } = useFindLastEnrollmentEncounter(patient ,customEncounterParams ,'' ,'' ,true);
  let { encounterBilan } = useFindLastBilanEncounter(patient ,customEncounterParams ,'' ,'' ,true);
  let { lastClotureEncounter } = useFindLastClotureEncounter(patient ,customEncounterParams ,'' ,'' ,true);


  const lastestEnrollemntEcounter = lastEnrollmentEncounter?.length > 1 ? lastEnrollmentEncounter[0] : lastEnrollmentEncounter[lastEnrollmentEncounter?.length -1];




  //console.log({lastestEnrollemntEcounter: lastestEnrollemntEcounter});

  const biologicalEncounter = encounterBilan.find((encounter) => {
    // Vérifie s'il y a une observation avec uuid === '856'
    const obs856 = encounter.obs.find((obs) => obs.concept.uuid === Concepts.INNITIAL_CD4_COUNT_INIT_FORM);
  
    // Vérifie s'il y a une observation avec uuid === '650'
    const obs650 = encounter.obs.find((obs) => obs.concept.uuid === Concepts.INNITIAL_CD4_PERCENT_INIT_FORM );
  
    // Retourne vrai si les deux observations existent
    return obs856 !== undefined || obs650 !== undefined;
  });

  const lastestHivViralLoad = encounterBilan.find((encounter) => {
    const obs856 = encounter.obs.find((obs) => obs.concept.uuid === Concepts.HIV_VIRAL_LOAD_TEST);
    return obs856 !== undefined 
  });

  let initialCD4CountValue = lastestEnrollemntEcounter?.obs?.find((o) => o.concept.uuid === Concepts.INNITIAL_CD4_COUNT_INIT_FORM);
  let initialCD4PercentValue = lastestEnrollemntEcounter?.obs?.find((o) => o.concept.uuid === Concepts.INNITIAL_CD4_PERCENT_INIT_FORM);
  let initialCD4DateValue = lastestEnrollemntEcounter?.obs?.find((o) => o.concept.uuid === Concepts.INITIAL_CD4_DATE_INIT_FORM);


  const { obs: initialFormCD4PercentObs, isLoading: loadingInitialFormCD4PercentObs} = useFindObsByEncounter(patient,lastEnrollmentEncounter[0]?.uuid, '5497AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', ``, view);
  const initialFormCD4Percent = initialFormCD4PercentObs.length === 1 ? initialFormCD4PercentObs[0].value: undefined; 
  //console.log({initialFormCD4Percent: initialFormCD4PercentObs});


  const loading =
    loadingPregnancyStatus &&
    loadingCurrentlyBreastfeedingChild &&
    loadingInitialCd4Absolute &&
    loadingInitialCd4Percentage &&
    loadingInitialHiv &&
    loadingArvInitialYear &&
    loadingArvLineTreatmentObs &&
    loadingArvRegimeObs &&
    loadingHasViralLoadObs &&
    loadingLastViralLoadObs &&
    loadingHivTypeFormObs &&
    loadingIsOntreatmentFormObs &&
    loadingTreatmentStartDateObs &&
    loadingInitialCd4AbsoluteFormObs &&
    loadingInitialCd4PercentageFormObs &&
    loadingTreatmentLineObs &&
    loadingInitialCd4DateFormObs && 
    loadingArvRegimenObs && 
    loadingTransferedObs && 
    loadingAntiretroviralPlanObs && 
    loadingLastViralLaboratoryLoadObs && 
    loadingLastViralDateLoadObs &&
    loadingHivViralLoadTestObs &&
    loadingAccessionNumberObs && 
   // loadingLatestCd4AbsoluteFormObs && 
    loadingSelfStopTreatmentObs && 
    loadingSNegatifVihObs && 
    loadingGrossHivViralLoadTestObs

  return {
    pregnancyStatus,
    currentlyBreastfeedingChild,
    initialCd4Absolute,
    initialCd4Percentage,
    initialHiv,
    arvInitialYear,
    arvLineTreatment,
    arvRegime,
    hasViralLoad,
    lastViralLoad,
    hivTypeForm,
    isOntreatmentForm,
    treatmentStartDate,
    initialCd4AbsoluteForm,
    initialCd4PercentageForm, 
    treatmentLine,
    initialCd4DateForm,
    arvRegimen,
    loading,
    transfered,
    antiretroviralPlan,
    lastViralLaboratoryLoad,
    lastViralDateLoad,
    hivViralLoadTest,
    accessionNumber,
    accessionNumberDateCreated,
    selfStopTreatment,
    negatifVih,
    grossHivViralLoadTest,
    initialCD4CountValue,
    initialCD4PercentValue,
    initialCD4DateValue,
    initialCd4AbsoluteObs,
    initialCd4PercentageObs,
    biologicalEncounter,
    lastClotureEncounter,
    lastestHivViralLoad
    };
};
