import axios from 'axios';
// import {SECRET_KEY} from "@sigeov-apps/common/utils";
// import { encryptStorage } from '@sigeov-apps/common/utils';

// const sessionBasic = encryptStorage.getItem('auth');

export const api = axios.create({
  baseURL: '/openmrs/ws/rest/v1',
 // baseURL: 'http://35.85.179.171:8080/openmrs/ws/rest/v1',
  headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    // Authorization: 'Basic ' + window.btoa('admin:Dppeis@pnls_16'),
  },
});

export const fhirApi = axios.create({
  baseURL: '/openmrs/ws/fhir2/R4',
 //baseURL: 'http://35.85.179.171:8080/openmrs/ws/fhir2/R4',
  headers: {
    'Content-type': 'application/fhir+json',
    'Access-Control-Allow-Origin': '*',
    // Authorization: 'Basic ' + window.btoa('admin:Dppeis@pnls_16'),
  },
});
