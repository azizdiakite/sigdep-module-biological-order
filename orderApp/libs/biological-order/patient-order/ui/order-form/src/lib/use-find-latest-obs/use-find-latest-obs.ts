import { useFindObs } from '@spbogui-openmrs/shared/ui';
import { Concepts } from '@spbogui-openmrs/shared/utils';

export const useFindLatestObs = (
  patient: string,
  lastDate: string,
  location: string
) => {
  const view = 'custom:(value,concept:(datatype))';
  // Pregnancy Status
  const { obs: pregnancyStatusObs, isLoading: loadingPregnancyStatus } =
    useFindObs(
      patient,
      Concepts.PREGNANCY_STATUS,
      ``,
      view
    );
  const pregnancyStatus =
    pregnancyStatusObs.length === 1 ? pregnancyStatusObs[0].value : undefined;
  // Currently Breastfeeding Child
  const {
    obs: currentlyBreastfeedingChildObs,
    isLoading: loadingCurrentlyBreastfeedingChild,
  } = useFindObs(
    patient,
    Concepts.CURRENTLY_BREAST_FEEDING,
    ``,
    view
  );
  const currentlyBreastfeedingChild =
    currentlyBreastfeedingChildObs.length === 1
      ? currentlyBreastfeedingChildObs[0].value
      : undefined;

  // Initial Cd4 Absolute
  const { obs: initialCd4AbsoluteObs, isLoading: loadingInitialCd4Absolute } =
    useFindObs(
      patient,
      Concepts.INNITIAL_CD4_COUNT,
      ``,
      view
    );
  const initialCd4Absolute =
    initialCd4AbsoluteObs.length === 1
      ? initialCd4AbsoluteObs[0].value
      : undefined;
   // console.log({initialCd4Absolute: initialCd4Absolute});
  // initial Cd4 Percentage
  const {
    obs: initialCd4PercentageObs,
    isLoading: loadingInitialCd4Percentage,
  } = useFindObs(
    patient,
    Concepts.INNITIAL_CD4_PERCENT,
    ``,
    view
  );

  const initialCd4Percentage =
  initialCd4PercentageObs.length === 1
    ? initialCd4PercentageObs[0].value
    : undefined;

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

    // Hiv type
    const { obs: hivTypeFormObs, isLoading: loadingHivTypeFormObs} = useFindObs(patient,Concepts.HIV_TYPE_INIT_FORM, ``, view);
    const hivTypeForm = hivTypeFormObs.length === 1 ? hivTypeFormObs[0].value: undefined;

    // Is on treatment
    const { obs: isOntreatmentFormObs, isLoading: loadingIsOntreatmentFormObs} = useFindObs(patient, Concepts.STARTED_ARV_TREATMENT_INIT_FORM, ``, view);
    const isOntreatmentForm = isOntreatmentFormObs.length === 1 ? isOntreatmentFormObs[0].value: undefined;  

    // Treatemnt start date
     const { obs: treatmentStartDateObs, isLoading: loadingTreatmentStartDateObs} = useFindObs(patient, Concepts.ARV_START_DATE_INIT_FORM , ``, view);
     const treatmentStartDate = treatmentStartDateObs.length === 1 ? treatmentStartDateObs[0].value: undefined;  

     // initial C4 absolute
     const { obs: initialCd4AbsoluteFormObs, isLoading: loadingInitialCd4AbsoluteFormObs} = useFindObs(patient, Concepts.INNITIAL_CD4_COUNT_INIT_FORM, ``, view);
     const initialCd4AbsoluteForm = initialCd4AbsoluteFormObs.length === 1 ? initialCd4AbsoluteFormObs[0].value: undefined;

     // initial C4 percent
     const { obs: initialCd4PercentageFormObs, isLoading: loadingInitialCd4PercentageFormObs} = useFindObs(patient, Concepts.INNITIAL_CD4_PERCENT_INIT_FORM, ``, view);
     const initialCd4PercentageForm = initialCd4PercentageFormObs.length === 1 ? initialCd4PercentageFormObs[0].value: undefined;

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

    const { obs: transferedObs, isLoading: loadingTransferedObs} = useFindObs(patient,Concepts.TRANSFERERD, ``, view);
    const transfered = transferedObs.length === 1 ? transferedObs[0].value: undefined; 

 


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
    loadingTransferedObs

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
    transfered
  };
};
