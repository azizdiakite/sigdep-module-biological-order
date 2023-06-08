/* eslint-disable @typescript-eslint/no-explicit-any */
import { Concept } from '@spbogui-openmrs/shared/model';
import { api } from '../http-common';

const API_URL = '/concept';

const findOne = async (uuid: string, params: string): Promise<Concept> => {
  const response = await api.get<Concept>(API_URL + `/${uuid}?v=${params}`);
  return response.data;
};

const filter = async (
  views: string,
  params = '',
  limit = '1'
): Promise<Concept[]> => {
  const parameters = params !== '' ? '&' + params : '';
  const response = await api.get<any>(
    API_URL + `?&v=${views}${parameters}&limit=${limit}`
  );
  return response.data.results;
};

// const save = async (patient: EncounterForm): Promise<Encounter> => {
//   const response = await api.post<Encounter>(API_URL, patient);
//   return response.data;
// };

// const update = async (encounter: unknown, uuid: string): Promise<Encounter> => {
//   const response = await api.post<Encounter>(API_URL + `/${uuid}`, encounter);
//   return response.data;
// };

// const remove = async (uuid: string): Promise<void> => {
//   await api.delete<Encounter>(API_URL + `/${uuid}?`);
// };

export const ConceptService = {
  findOne,
  filter,
};
