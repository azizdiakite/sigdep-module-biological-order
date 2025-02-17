import { api } from '../http-common';
import { Obs, ObsForm } from '@spbogui-openmrs/shared/model';

const API_URL = '/obs';
const API_URL_FULL = '/observation-in';

const filter = async (
  patient: string,
  concept: string,
  params = '',
  view = 'default',
  limit = '1'
): Promise<Obs[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await api.get<any>(
    API_URL +
      `?patient=${patient}&concept=${concept}${params}&v=${view}&limit=${limit}`
  );
  return response.data.results;
};


const filterObsEncounter = async (
  patient: string,
  encounter: string,
  concept: string,
  params = '',
  view = 'default',
  limit = '1'
): Promise<Obs[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await api.get<any>(
    API_URL +
      `?patient=${patient}&encounter=${encounter}&concept=${concept}${params}&v=${view}&limit=${limit}`
  );
  return response.data.results;
};

const filterByForm = async (
  patient: string,
  concept: string,
  encounterType: string,
  params = '',
  view = 'default',
  limit = '1'
): Promise<Obs[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await api.get<any>(
    API_URL +
      `?patient=${patient}&encounter=${encounterType}&concept=${concept}${params}&v=${view}&limit=${limit}`
  );
  return response.data.results;
};

const saveObs = async (obs: ObsForm): Promise<Obs> => {
  const response = await api.post<Obs>(API_URL, obs);
  return response.data;
};

export const ObsService = {
  filter,
  saveObs,
  filterByForm,
  filterObsEncounter
};
