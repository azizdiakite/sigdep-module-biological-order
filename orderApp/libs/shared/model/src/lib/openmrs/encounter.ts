import * as Joi from 'joi';
import { Location } from './location';
import { Provider } from './provider';
import { Patient } from './patient';
import { Obs, ObsEncounterForm } from './obs';
import { Order } from './order';

export interface EncounterRole {
  name: string;
  description: string;
  retired: boolean;
  uuid: string;
}

export interface EncounterRoleForm {
  name: string;
  description?: string;
  uuid?: string;
}

export interface EncounterProvider {
  provider: Provider;
  encounterRole: EncounterRole;
  uuid: string;
}

export interface EncounterProviderForm {
  provider: string;
  encounterRole: string;
  uuid?: string;
}

export interface EncounterType {
  name: string;
  description?: string;
  uuid: string;
}

export interface Encounter {
  encounterDatetime: Date;
  dateCreated: Date;
  obs: Obs[];
  patient: Patient;
  orders: Order[];
  location: Location;
  encounterType: EncounterType;
  encounterProviders: EncounterProvider[];
  uuid: string;
}

export interface EncounterForm {
  encounterDatetime?: Date;
  obs: ObsEncounterForm[];
  patient: string;
  location: string;
  encounterType: string;
  encounterProviders: EncounterProviderForm[];
  uuid?: string;
  form?: string;
  creator: string;
}

export const ENCOUNTER_INITIAL_VALUES: EncounterForm = {
  patient: '',
  encounterProviders: [{ encounterRole: '', provider: '' }],
  location: '',
  creator:'',
  obs: [],
  encounterDatetime: undefined,
  encounterType: '',
  uuid: undefined,
};

export const encounterProviderSchema = Joi.object<EncounterProviderForm>({
  provider: Joi.optional(),
  encounterRole: Joi.string()
    .required()
    .messages({ 'string.empty': 'Ce champ est requis' }),
});

export const encounterSchema = Joi.object<EncounterForm>({
  encounterDatetime: Joi.date()
    .required()
    .messages({ 'any.required': 'Ce champ est requis' }),
  location: Joi.optional(),
  encounterType: Joi.string().required().messages({
    'string.empty': 'Ce champ est requise',
    'string.required': 'Ce champ est requise',
  }),
  patient: Joi.when('uuid', {
    is: Joi.string().exist(),
    then: Joi.string().required().messages({
      'string.empty': 'Le patient est requis',
      'string.required': 'Le patient est requis',
    }),
    otherwise: Joi.optional(),
  }),
  encounterProviders: Joi.array().items(encounterProviderSchema),
  obs: Joi.optional(),
  uuid: Joi.optional(),
});
