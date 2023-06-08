import { api } from '../http-common';
import { Person, PersonForm } from '@spbogui-openmrs/shared/model';

const API_URL = '/person';

const findOne = async (uuid: string, params = 'default'): Promise<Person> => {
  const response = await api.get<Person>(API_URL + `/${uuid}?v=${params}`);
  return response.data;
};

const save = async (person: PersonForm): Promise<Person> => {
  const response = await api.post<Person>(API_URL, person);
  return response.data;
};

const update = async (person: unknown, uuid: string): Promise<Person> => {
  const response = await api.post<Person>(API_URL + `/${uuid}`, person);
  return response.data;
};

const updateName = async (
  name: unknown,
  personUuid: string,
  uuid: string
): Promise<Person> => {
  const response = await api.post<Person>(
    API_URL + `${personUuid}/name/${uuid}`,
    name
  );
  return response.data;
};

const updateAddress = async (
  address: unknown,
  personUuid: string,
  uuid: string
): Promise<Person> => {
  const response = await api.post<Person>(
    API_URL + `${personUuid}/address/${uuid}`,
    address
  );
  return response.data;
};

export const PersonService = {
  findOne,
  save,
  update,
  updateName,
  updateAddress,
};
