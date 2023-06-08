/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '../http-common';
import { Settings } from '@spbogui-openmrs/shared/model';

const API_URL = '/systemsetting';

const findAllyByQuery = async (query: string): Promise<Settings[]> => {
  const response = await api.get<any>(
    API_URL + `?v=custom:(property,value)&q=${query}`
  );
  return response.data.results;
};

const SettingService = {
  findAllyByQuery,
};

export default SettingService;
