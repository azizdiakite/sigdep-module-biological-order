import * as Joi from 'joi';

export interface PersonName {
  givenName: string;
  familyName: string;
  preferred: boolean;
  prefix?: string;
  uuid?: string;
}

export interface PersonAddress {
  preferred: boolean;
  address1: string;
  address2?: string;
  address3?: string;
  address4?: string;
  address5?: string;
  address6?: string;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  postalCode?: string;
  countyDistrict?: string;
  startDate?: Date;
  endDate?: Date;
  latitude?: string;
  longitude?: string;
  uuid?: string;
}

export interface PersonAttributeType {
  uuid: string;
  display: string;
  name: string;
  description?: string;
  format?: string;
  foreignKey?: number;
  sortWeight?: number;
  searchable?: boolean;
  editPrivilege?: string;
}

export interface PersonAttribute {
  attributeType: PersonAttributeType;
  value: string;
  uuid?: string;
}

export interface PersonAttributeForm {
  attributeType: string;
  value: string;
  uuid?: string;
}

export interface Person {
  gender: string;
  display: string;
  birthdate: Date;
  birthdateEstimated?: boolean;
  age: number;
  names: PersonName[];
  preferredName?: PersonName;
  addresses: PersonAddress[];
  preferredAddress?: PersonAddress;
  attributes: PersonAttribute[];
  uuid?: string;
}

export interface PersonForm {
  gender: string;
  birthdate?: Date;
  age?: number;
  names: PersonName[];
  addresses: PersonAddress[];
  attributes?: PersonAttributeForm[];
  uuid?: string;
}

export const PERSON_INITIAL_VALUES = {
  gender: 'M',
  birthdate: undefined,
  age: undefined,
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
};

export const ADDRESS_INITIAL_VALUES: PersonAddress[] = [
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
];

export const PERSON_NAME_INITIAL_VALUES: PersonName[] = [
  { familyName: '', givenName: '', preferred: true, uuid: undefined },
];

export const personAddressValidationSchema = Joi.object<PersonAddress>({
  preferred: Joi.optional(),
  address1: Joi.string().required().messages({
    'string.required': 'Ce champ est requis',
    'string.empty': 'Ce champ est requis',
  }),
  address2: Joi.optional(),
  address3: Joi.optional(),
  address4: Joi.optional(),
  address5: Joi.optional(),
  address6: Joi.optional(),
  postalCode: Joi.optional(),
  country: Joi.optional(),
  countyDistrict: Joi.optional(),
  stateProvince: Joi.optional(),
  cityVillage: Joi.optional(),
  startDate: Joi.optional(),
  endDate: Joi.optional(),
  longitude: Joi.optional(),
  latitude: Joi.optional(),
  uuid: Joi.optional(),
});

export const personNameSchema = Joi.object<PersonName>({
  preferred: Joi.optional(),
  familyName: Joi.string().required().min(3).messages({
    'string.required': 'Le nom est requis',
    'string.empty': 'Le nom est requis',
    'string.min': 'Le nom doit avoir au moins 3 caracteres',
  }),
  givenName: Joi.string().required().min(3).messages({
    'string.required': 'Le prénom est requis',
    'string.empty': 'Le prénom est requis',
    'string.min': 'Le prénom doit avoir au moins 3 caracteres',
  }),
  uuid: Joi.optional(),
});

export const personSchema = Joi.object<PersonForm>({
  birthdate: Joi.date()
    .required()
    .messages({ 'any.required': 'La date de naissance est requise' }),
  gender: Joi.string()
    .valid('M', 'F')
    .required()
    .messages({ 'any.required': 'Vous avez renseigné un sexe incorret' }),
  names: Joi.array().items(personNameSchema),
  addresses: Joi.array().items(personAddressValidationSchema),
  age: Joi.optional(),
  uuid: Joi.optional(),
});
