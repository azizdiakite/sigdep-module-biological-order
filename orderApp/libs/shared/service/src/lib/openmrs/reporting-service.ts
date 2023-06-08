import { api } from '../http-common';

const API_URL = '/reportingrest';

const evaluateDataSet = async (uuid: string, params: unknown) => {
  const response = await api.post<undefined>(
    API_URL +
      `/dataSet/${uuid}?v=custom:(rows,metadata:(column),definition:(name))`,
    params
  );
  return response.data;
};

export const ReportingService = {
  evaluateDataSet,
};
