import * as Joi from 'joi';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LocationAttributeType {
  name: string;
  description?: string;
  datatypeClassName?: string;
  minOccurs?: number;
  maxOccurs?: number;
  datatypeConfig?: string;
  uuid: string;
}

export interface LocationAttribute {
  value: any;
  attributeType: LocationAttributeType;
  voided: boolean;
  uuid: string;
}

export interface LocationTag {
  name: string;
  description?: string;
  uuid: string;
}

export interface Location {
  id: number;
  display: string;
  name: string;
  description?: string;
  parentLocation?: Location;
  tags?: LocationTag[];
  address1?: string;
  address2?: string;
  address3?: string;
  address4?: string;
  address5?: string;
  address6?: string;
  address7?: string;
  address8?: string;
  postalCode?: string;
  childLocations?: Location[];
  attributes?: LocationAttribute[];
  uuid: string;
}

export interface LocationAttributeForm {
  value: any;
  description?: string;
  attributeType: string;
}

export interface LocationForm {
  name: string;
  description?: string;
  parentLocation?: string;
  tags?: string[];
  address1?: string;
  address2?: string;
  address3?: string;
  address4?: string;
  address5?: string;
  address6?: string;
  address7?: string;
  address8?: string;
  postalCode?: string;
  childLocations?: string[];
  attributes?: LocationAttributeForm[];
  uuid?: string;
}

export const LOCATION_INITIAL_VALUES: LocationForm = {
  name: '',
  tags: [],
  description: '',
  parentLocation: '',
  childLocations: [],
  postalCode: '',
  address1: '',
  address2: '',
  address3: '',
  address4: '',
  address5: '',
  address6: '',
  address7: '',
  address8: '',
  attributes: [],
  uuid: undefined,
};

export const locationSchema = Joi.object<LocationForm>({
  name: Joi.string().required().messages({
    'any.required': 'Ce champ est requis',
    'string.empty': "Le nom de l'ONG est requis",
  }),
  parentLocation: Joi.optional(),
  tags: Joi.optional(),
  address1: Joi.optional(),
  address2: Joi.optional(),
  address3: Joi.optional(),
  address4: Joi.optional(),
  address5: Joi.optional(),
  address6: Joi.optional(),
  address7: Joi.optional(),
  address8: Joi.optional(),
  postalCode: Joi.optional(),
  childLocations: Joi.optional(),
  attributes: Joi.optional(),
  description: Joi.optional(),
  uuid: Joi.optional(),
});
