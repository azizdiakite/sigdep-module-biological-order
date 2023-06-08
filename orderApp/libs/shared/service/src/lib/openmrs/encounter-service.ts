/* eslint-disable @typescript-eslint/no-explicit-any */
import { Encounter, EncounterForm } from '@spbogui-openmrs/shared/model';
import { api } from '../http-common';

const API_URL = '/encounter';

const findOne = async (uuid: string, params: string): Promise<Encounter> => {
  const response = await api.get<Encounter>(API_URL + `/${uuid}?v=${params}`);
  return response.data;
};

const filter = async (
  patient: string,
  encounterType: string,
  views: string,
  params: string,
  limit = '1'
): Promise<Encounter[]> => {
  const encounterTypeParam =
    encounterType !== '' ? `&encounterType=${encounterType}` : '';
  const parameters = params !== '' ? '&' + params : '';
  const response = await api.get<any>(
    `/encounter?patient=${patient}${encounterTypeParam}&v=${views}${parameters}&limit=${limit}&sorted=true`
  );
  return response.data.results;
};

const findAll = async (
  encounterType: string,
  startDate: string,
  endDate: string,
  params: string,
  limit = '1'
): Promise<Encounter[]> => {
  const response = await api.get<any>(
    `/encounter?encounterType=${encounterType}&startDate=${startDate}&endDate=${endDate}&v=${params}&limit=${limit}`
  );
  return response.data.results;
};

const save = async (patient: EncounterForm): Promise<Encounter> => {
  const response = await api.post<Encounter>(API_URL, patient);
  return response.data;
};

const update = async (encounter: unknown, uuid: string): Promise<Encounter> => {
  const response = await api.post<Encounter>(API_URL + `/${uuid}`, encounter);
  return response.data;
};

const remove = async (uuid: string): Promise<void> => {
  await api.delete<Encounter>(API_URL + `/${uuid}?`);
};

export const EncounterService = {
  findOne,
  filter,
  save,
  update,
  remove,
  findAll,
};
