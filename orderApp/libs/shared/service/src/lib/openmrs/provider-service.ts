/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '../http-common';
import { Provider } from '@spbogui-openmrs/shared/model';

const API_URL = '/provider';

const findOne = async (uuid: string, params = 'full'): Promise<Provider> => {
  const response = await api.get<Provider>(API_URL + `/${uuid}?v=${params}`);
  return response.data;
};

const save = async (provider: any) => {
  const response = await api.post<any>(API_URL, provider);
  return response.data.results;
};

const findByQuery = async (
  query: string,
  params = 'v=full'
): Promise<Provider[]> => {
  const response = await api.get<any>(API_URL + `?q=${query}&v=${params}`);
  return response.data.results;
};

export const ProviderService = {
  findOne,
  save,
  findByQuery,
};

// export default ProviderService;
