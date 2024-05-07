import * as Joi from 'joi';
import { Location } from './location';
import { Person, PersonForm, personSchema } from './person';

export interface PatientIdentifierType {
  name: string;
  description?: string;
  display: string;
  uuid: string;
}

export interface PatientIdentifier {
  identifier: string;
  location: Location;
  preferred: boolean;
  identifierType: PatientIdentifierType;
  uuid: string;
}

export interface PatientIdentifierForm {
  identifier: string;
  location: string;
  preferred: boolean;
  identifierType: string;
  uuid?: string;
}

export interface Patient {
  person: Person;
  identifiers: PatientIdentifier[];
  patientIdentifier?: PatientIdentifier;
  transfered?: string;
  uuid: string;
}

export interface PatientForm {
  person: PersonForm;
  identifiers: PatientIdentifierForm[];
  uuid?: string;
}

export const PATIENT_PERSON_INITIAL_VALUES: PatientForm = {
  person: {
    gender: 'M',
    birthdate: undefined,
    names: [{ familyName: '', givenName: '', preferred: true }],
    addresses: [
      {
        preferred: true,
        address1: '',
        address2: '',
        address3: '',
        address4: '',
        address5: '',
        address6: '',
        cityVillage: '',
        stateProvince: '',
        country: '',
        postalCode: '',
        countyDistrict: '',
        startDate: undefined,
        endDate: undefined,
        latitude: '',
        longitude: '',
        uuid: undefined,
      },
    ],
  },
  identifiers: [
    {
      identifier: '',
      identifierType: '',
      preferred: true,
      location: '',
      uuid: undefined,
    },
  ],
};

export const patientIdentifierSchema = Joi.object<PatientIdentifierForm>({
  identifier: Joi.string().required().messages({
    'string.empty': 'Le numero est requis',
    'string.required': 'Le numero est requis',
  }),
  location: Joi.string()
    .required()
    .messages({ 'string.empty': 'La structure est necessaire' }),
  preferred: Joi.optional(),
  identifierType: Joi.string().required(),
  uuid: Joi.optional(),
});

export const patientSchema = Joi.object<PatientForm>({
  person: personSchema,
  identifiers: Joi.array().items(patientIdentifierSchema),
  uuid: Joi.optional(),
});
