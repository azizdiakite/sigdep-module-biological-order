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

  const loading =
    loadingPregnancyStatus &&
    loadingCurrentlyBreastfeedingChild &&
    loadingInitialCd4Absolute &&
    loadingInitialCd4Percentage;

  return {
    pregnancyStatus,
    currentlyBreastfeedingChild,
    initialCd4Absolute,
    initialCd4Percentage,
    loading,
  };
};
