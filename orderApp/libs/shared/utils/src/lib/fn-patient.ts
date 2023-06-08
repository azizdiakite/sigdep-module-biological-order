import {
  Patient,
  PatientForm,
  Person,
  PersonForm,
  PERSON_INITIAL_VALUES,
} from '@spbogui-openmrs/shared/model';
import dayjs from 'dayjs';

export const patientToForm = (patient: Patient): PatientForm => {
  return {
    person: personToForm(patient.person),
    identifiers: patient.identifiers.map((i) => {
      return {
        identifier: i.identifier,
        identifierType: i.identifierType.uuid,
        preferred: i.preferred,
        location: i.location.uuid,
        uuid: i.uuid,
      };
    }),
    uuid: patient.uuid,
  };
};

export const personToForm = (person: Person): PersonForm => {
  return {
    birthdate: dayjs(person.birthdate).toDate(),
    gender: person.gender,
    age: person.age ? person.age : undefined,
    names: person.names.map((n) => {
      return {
        familyName: n.familyName,
        givenName: n.givenName,
        preferred: n.preferred,
        uuid: n.uuid,
      };
    }),
    addresses:
      person.addresses.length > 0
        ? person.addresses.map((a) => {
            return {
              preferred: a.preferred,
              address1: a.address1 ? a.address1 : '',
              address2: a.address2 ? a.address2 : '',
              address3: a.address3 ? a.address3 : '',
              address4: a.address4 ? a.address4 : '',
              address5: a.address5 ? a.address5 : '',
              address6: a.address6 ? a.address6 : '',
              cityVillage: a.cityVillage ? a.cityVillage : '',
              stateProvince: a.stateProvince ? a.stateProvince : '',
              country: a.country ? a.country : '',
              postalCode: a.postalCode ? a.country : '',
              countyDistrict: a.countyDistrict ? a.country : '',
              startDate: a.startDate ? a.startDate : undefined,
              endDate: a.endDate ? a.endDate : undefined,
              latitude: a.latitude ? a.country : '',
              longitude: a.longitude ? a.country : '',
              uuid: a.uuid,
            };
          })
        : PERSON_INITIAL_VALUES.addresses,
    uuid: person.uuid,
  };
};
