import { api } from './http-common';
import axios from 'axios';

const authenticate = async (username: string, password: string) => {
  const localApi = axios.create({
    baseURL: '/openmrs/ws/rest/v1',
    headers: {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Basic ' + window.btoa(`${username}:${password}`),
      // window.atob(`${username}:${password}`, 'utf8').toString('base64'),
    },
  });

  const response = await localApi.get('/session');

  return response.data;
};

const logout = async () => {
  const response = await api.delete('/session', {});
  return response;
};

export const SessionService = {
  authenticate,
  logout,
};
