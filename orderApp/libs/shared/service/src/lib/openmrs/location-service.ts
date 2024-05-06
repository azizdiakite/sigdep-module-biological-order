/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LocationTag,
  Location,
  LocationAttribute,
  LocationAttributeForm,
} from '@spbogui-openmrs/shared/model';
import { api } from '../http-common';

const API_URL = '/location';

const findOne = async (uuid: string, view: string): Promise<Location> => {
 // console.log({location_uuid: uuid});
  const response = await api.get<Location>(API_URL + `/${uuid}?limit=1`);
  return response.data;
};


const findAll = async (view: string, params?: string): Promise<Location[]> => {
  // const tagParams = params ? `&tag=${params}` : '';
  const response = await api.get<any>(API_URL + `?v=${view}&${params}`);
  return response.data.results;
};

const findLocationTags = async (
  view: string,
  params?: string
): Promise<LocationTag[]> => {
  // const tagParams = params ? `&tag=${params}` : '';
  const response = await api.get<any>(API_URL + 'tag' + `?v=${view}&${params}`);
  return response.data.results;
};

const findAttributes = async (
  uuid: string,
  params: string
): Promise<LocationAttribute[]> => {
  const response = await api.get<any>(
    API_URL + `/${uuid}/attribute?v=${params}`
  );
  return response.data.results;
};

const addOrUpdateAttribute = async (
  data: any,
  uuid: string,
  attributeUuid = ''
) => {
  const response = await api.post<LocationAttributeForm>(
    API_URL +
      `/${uuid}/attribute${attributeUuid !== '' ? '/' + attributeUuid : ''}`,
    data
  );
  return response.data;
};

const addOrUpdate = async (data: any, uuid = '') => {
  const response = await api.post<Location>(
    API_URL + `/${uuid !== '' ? '/' + uuid : ''}`,
    data
  );
  return response.data;
};

const remove = async (uuid: string, purge = false) => {
  const response = await api.delete(
    API_URL + `/${uuid}${purge && '?purge=true'}`
  );
  return response.data;
};



export const LocationService = {
  findOne,
  findAll,
  findAttributes,
  addOrUpdate,
  addOrUpdateAttribute,
  findLocationTags,
  remove
};
