import * as Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = Joi.extend(joiPasswordExtendCore);

import {
  Person,
  personSchema,
  PERSON_INITIAL_VALUES,
  PersonForm,
} from './person';

export interface UserProperty {
  loginAttempts?: string;
  'emrapi.lastViewedPatientIds'?: string;
  defaultLocation?: string;
  program?: string;
}

export interface Role {
  uuid: string;
  name: string;
}

export interface Privilege {
  uuid: string;
  name: string;
}

interface BaseUser {
  username: string;
  systemId: string;
  userProperties?: UserProperty;
}

export interface User extends BaseUser {
  allRoles: Role[];
  display: string;
  person: Person;
  privileges: Privilege[];
  roles: Role[];
  uuid: string;
  retired: boolean;
}

export interface UserForm {
  person: PersonForm;
  roles: string[];
  password?: string;
  username: string;
  systemId: string;
  userProperties?: UserProperty;
  uuid?: string;
}

export const USER_INITIAL_VALUES: UserForm = {
  person: PERSON_INITIAL_VALUES,
  username: '',
  password: '',
  systemId: '',
  roles: [],
  userProperties: { loginAttempts: '', defaultLocation: '' },
};

const userPropertySchema = Joi.object<UserProperty>({
  loginAttempts: Joi.optional(),
  'emrapi.lastViewedPatientIds': Joi.optional(),
  defaultLocation: Joi.string().required().messages({
    'string.required': 'Veuillez sélectionner la structure SVP !',
    'string.empty': 'Veuillez sélectionner la structure SVP !',
  }),
  program: Joi.optional(),
});

export const userValidationSchema = Joi.object<UserForm>({
  person: personSchema,
  username: Joi.string().required().messages({
    'string.required': 'Le nom utilisateur est requis',
    'string.empty': 'Le nom utilisateur est requis',
  }),
  roles: Joi.array()
    .items(
      Joi.string().required().messages({
        'any.required': 'Veuillez sélectionner au moins un role',
        'any.empty': 'Veuillez sélectionner au moins un role',
      })
    )
    .messages({
      'any.required': 'Veuillez sélectionner au moins un role',
      'any.empty': 'Veuillez sélectionner au moins un role',
    }),
  userProperties: userPropertySchema,
  systemId: Joi.optional(),
  password: Joi.when('uuid', {
    is: Joi.any().valid(null, ''),
    then: joiPassword
      .string()
      .label('Le mot de passe')
      // .minOfSpecialCharacters(3)
      .minOfLowercase(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .messages({
        'password.minOfUppercase':
          '{#label} devrait contenir au moins {#min} caractère(s) majuscule',
        'password.minOfSpecialCharacters':
          '{#label} devrait contenir au moins {#min} caractère(s) spécial',
        'password.minOfLowercase':
          '{#label} devrait contenir au moins {#min} caractère(s) minuscule',
        'password.minOfNumeric':
          '{#label} devrait contenir au moins {#min} caractère(s) numérique',
        'password.noWhiteSpaces': "{#label} ne devrait pas contenir d'espace",
      }),
    otherwise: Joi.optional(),
  }),
  uuid: Joi.optional(),
});
