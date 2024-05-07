/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '../http-common';
import { User } from '@spbogui-openmrs/shared/model';

const API_URL = '/user';
const API_SESSION ='/location'

const findOne = async (uuid: string, params: string) => {
  const response = await api.get<User>(API_URL + `/${uuid}?v=${params}`);
  return response.data;
};

const findAll = async (view: string, params?: string): Promise<User[]> => {
  const response = await api.get<any>(API_URL + `?v=${view}&${params}`);
  return response.data.results;
};

const addOrUpdate = async (data: any, uuid = ''): Promise<User> => {
  const response = await api.post<User>(
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

const session = async (): Promise<any> => {
  const response = await api.get<any>(API_SESSION);
  return response.data;
};

export const UserService = {
  findOne,
  findAll,
  addOrUpdate,
  remove,
  session
};
