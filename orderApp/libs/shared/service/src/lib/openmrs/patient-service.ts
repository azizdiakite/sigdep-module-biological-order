/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Patient,
  PatientForm,
  PatientIdentifierForm,
} from '@spbogui-openmrs/shared/model';
import { api } from '../http-common';

const API_URL = '/patient';

const findOne = async (uuid: string, params = 'full'): Promise<Patient> => {
  const response = await api.get<Patient>(API_URL + `/${uuid}?v=${params}`);
  return response.data;
};

const findOneByIdentifier = async (
  identifier: string,
  view = 'full'
): Promise<Patient[]> => {
  const response = await api.get<any>(
    API_URL + `?v=${view}&identifier=${identifier}`
  );
  return response.data.results;
};

const findByName = async (
  name: string,
  params = 'full'
): Promise<Patient[]> => {
  const response = await api.get<any>(API_URL + `?q=${name}&v=${params}`);
  return response.data.results;
};

const save = async (patient: PatientForm) => {
  const response = await api.post<Patient>(API_URL, patient);
  return response.data;
};

const saveIdentifier = async (
  identifier: PatientIdentifierForm,
  patientUuid: string
): Promise<PatientIdentifierForm> => {
  const response = await api.post<PatientIdentifierForm>(
    `${API_URL}/${patientUuid}/identifier`,
    identifier
  );
  return response.data;
};

const updateIdentifier = async (
  identifier: PatientIdentifierForm,
  patientUuid: string
) => {
  const response = await api.post<PatientIdentifierForm>(
    `${API_URL}/${patientUuid}/identifier/${identifier.uuid}`,
    identifier
  );
  return response.data;
};

const update = async (patient: any, uuid: string) => {
  const response = await api.post<Patient>(API_URL + `/${uuid}`, patient);
  return response.data;
};

const remove = async (uuid: string): Promise<void> => {
  await api.delete(API_URL + `/${uuid}?`);
};

export const PatientService = {
  findOne,
  findOneByIdentifier,
  save,
  findByName,
  update,
  remove,
  saveIdentifier,
  updateIdentifier,
};
