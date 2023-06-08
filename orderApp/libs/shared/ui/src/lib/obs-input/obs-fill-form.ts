import { UseFormReturnType } from '@mantine/form';
import { Encounter, EncounterForm } from '@spbogui-openmrs/shared/model';
import { getObsValueByObs } from '@spbogui-openmrs/shared/utils';

export const obsFillForm = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturnType<any>,
  record: Record<string, string>,
  encounter: EncounterForm
) => {
  // console.log(encounter.obs);
  for (let i = 0; i < encounter.obs.length; i++) {
    const obs = encounter.obs[i];
    if (!obs.groupMembers) {
      form.setFieldValue(record[obs.concept], obs.value);
    } else {
      obs.groupMembers.forEach((o) => {
        form.setFieldValue(record[`${obs.concept}_${o.concept}`], o.value);
      });
    }
  }
};

export const obsFillFormEncounter = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturnType<any>,
  record: Record<string, string>,
  encounter: Encounter
) => {
  // console.log(encounter.obs);
  for (let i = 0; i < encounter.obs.length; i++) {
    const obs = encounter.obs[i];
    if (!obs.groupMembers) {
      form.setFieldValue(record[obs.concept.uuid], getObsValueByObs(obs));
    } else {
      obs.groupMembers.forEach((o) => {
        form.setFieldValue(
          record[`${obs.concept.uuid}_${o.concept.uuid}`],
          getObsValueByObs(o)
        );
      });
    }
  }
};
