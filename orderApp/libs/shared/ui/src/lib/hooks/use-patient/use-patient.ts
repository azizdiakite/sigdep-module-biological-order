/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PatientForm,
  PatientIdentifierForm,
} from '@spbogui-openmrs/shared/model';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PatientService } from '@spbogui-openmrs/shared/service';
import { patientToForm } from '@spbogui-openmrs/shared/utils';

export function useFindOnePatient(
  uuid: string,
  params = 'full',
  enabled = true
) {
  const {
    data,
    refetch: findOnePatient,
    isLoading,
  } = useQuery(
    ['patient', uuid, params],
    async () => await PatientService.findOne(uuid, params),
    { enabled }
  );

  const patient = data ? data : undefined;
  const patientForm = data ? patientToForm(data) : undefined;
  return {
    patient,
    patientForm,
    findOnePatient,
    isLoading,
  };
}

export const useFindPatientByIdentifier = (
  identifier: string,
  views = 'full',
  enabled = false
) => {
  const {
    data,
    refetch: getPatient,
    isLoading,
    isSuccess,
  } = useQuery(
    ['patient', identifier, views],
    async () => await PatientService.findOneByIdentifier(identifier, views),
    { enabled }
  );

  const patient = data && data.length > 0 ? data[0] : undefined;

  return { patient, getPatient, isLoading, isSuccess };
};

export const useFindFilteredPatient = (
  // identifier: string | undefined,
  params = '',
  view = 'full',
  enabled = false
) => {
  const {
    data: patients,
    refetch: findFilteredPatient,
    isLoading,
  } = useQuery(
    ['patient', params, view],
    async () => await PatientService.findOneByIdentifier(params, view),
    { enabled }
  );

  // const patient = data && data.length > 0 ? data[0] : undefined;
  return {
    patients,
    findFilteredPatient,
    isLoading,
  };
};

export const useFindPatientByName = (
  name: string | undefined,
  params = 'v=full',
  enabled = false
) => {
  const {
    data,
    refetch: findPatientByName,
    isLoading,
  } = useQuery(
    ['patient', name, params],
    async () => await PatientService.findByName(name ? name : '', params),
    { enabled }
  );

  const patients = data && data.length > 0 ? data : [];
  return {
    patients,
    findPatientByName,
    isLoading,
  };
};

export const useSavePatient = () => {
  const { mutate: savePatient, isLoading } = useMutation(
    (patient: PatientForm) => PatientService.save(patient)
  );

  const { mutate: savePatientIdentifier, isLoading: isLoadingIdentifierSave } =
    useMutation(
      async (data: {
        identifier: PatientIdentifierForm;
        patientUuid: string;
      }) =>
        await PatientService.saveIdentifier(data.identifier, data.patientUuid)
    );

  return {
    savePatient,
    savePatientIdentifier,
    isLoading,
    isLoadingIdentifierSave,
  };
};

export const useUpdatePatient = (uuid: string) => {
  const { mutate: updatePatient, isLoading } = useMutation(
    async (patient: any) => await PatientService.update(patient, uuid)
  );

  const {
    mutate: updatePatientIdentifier,
    isLoading: isLoadingIdentifierUpdate,
  } = useMutation(
    async (identifier: PatientIdentifierForm) =>
      await PatientService.saveIdentifier(identifier, uuid)
  );

  return {
    updatePatient,
    updatePatientIdentifier,
    isLoading,
    isLoadingIdentifierUpdate,
  };
};

export const useRemovePatient = () => {
  const { mutate: removePatient, isLoading } = useMutation((uuid: string) =>
    PatientService.remove(uuid)
  );
  return {
    removePatient,
    isLoading,
  };
};
