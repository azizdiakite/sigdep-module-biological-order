/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order, OrderForm } from '@spbogui-openmrs/shared/model';
import { api } from '../http-common';

const API_URL = '/order';

const findOne = async (uuid: string, views: string): Promise<Order> => {
  const response = await api.get<Order>(API_URL + `/${uuid}?v=${views}`);
  return response.data;
};

const filter = async (
  patient: string,
  orderType: string,
  views: string,
  params = '',
  limit = '1'
): Promise<Order[]> => {
  const orderTypeParam = orderType !== '' ? `&orderType=${orderType}` : '';
  const response = await api.get<any>(
    `${API_URL}?patient=${patient}${orderTypeParam}&v=${views}&limit=${limit}${
      params !== '' && params
    }`
  );
  return response.data.results;
};

const findAll = async (
  orderType: string,
  startDate: string,
  endDate: string,
  views: string,
  params = '',
  limit = '10'
): Promise<Order[]> => {
  const response = await api.get<any>(
    `${API_URL}/?&type=${orderType}&startDate=${startDate}&endDate=${endDate}&v=${views}&limit=${limit}${
      params !== '' && params
    }`
  );
  return response.data.results;
};

const save = async (order: OrderForm): Promise<Order> => {
  const response = await api.post<Order>(API_URL, order);
  return response.data;
};

const update = async (order: unknown, uuid: string): Promise<Order> => {
  const response = await api.post<Order>(API_URL + `/${uuid}`, order);
  return response.data;
};

const remove = async (uuid: string): Promise<void> => {
  await api.delete<Order>(API_URL + `/${uuid}?`);
};

export const OrderService = {
  findOne,
  filter,
  save,
  update,
  remove,
  findAll,
};
