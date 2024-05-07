import * as Joi from 'joi';
import { Concept, ConceptClass } from './concept';
import { Encounter } from './encounter';
import { Patient } from './patient';
import { Provider } from './provider';

export interface OrderType {
  name: string;
  description: string;
  javaClassName: string;
  parent: OrderType;
  conceptClasses: ConceptClass[];
}

export interface CareSetting {
  name: string;
  description: string;
  careSettingType: string;
  uuid: string;
}

export interface Order {
  display: string;
  orderNumber: string;
  encounter: Encounter;
  orderType: OrderType;
  action: string;
  accessionNumber: string;
  fulfillerStatus?: string,
  fulfillerComment?: string,
  patient: Patient;
  concept: Concept;
  orderer: Provider;
  careSetting: string;
  orderReason: Concept;
  previousNumber: string;
  previousOrder: Order;
  autoExpireDate: Date;
  scheduledDate: Date;
  dateActivated: Date;
  dateStopped: Date;
  instructions: string;
  laterality: string;
  clinicalHistory: string;
  frequency: string;
  urgency: string;
  uuid: string;
}

export interface OrderForm {
  encounter: string;
  type: string;
  action: 'NEW' | 'REVISE' | 'DISCONTINUE' | 'RENEW';
  urgency: string;
  dateActivated?: Date;
  careSetting: string;
  patient: string;
  concept: string;
  orderer: string;
  uuid?: string;
}

export const ORDER_INITIAL_VALUE: OrderForm = {
  encounter: '',
  type: '',
  action: 'NEW',
  urgency: 'ROUTINE',
  dateActivated: undefined,
  careSetting: 'INPATIENT',
  patient: '',
  concept: '',
  orderer: '',
};

export const orderSchema = Joi.object<OrderForm>({
  type: Joi.string().required().messages({
    'string.empty': 'Le type de demande est requise',
    'string.required': 'Le type de demande est requise',
  }),
  action: Joi.string().required().messages({
    'string.empty': 'Ce champ est requise',
    'string.required': 'Ce champ est requise',
  }),
  concept: Joi.string().required().messages({
    'string.empty': 'La raison de la demande est requise',
    'string.required': 'La raison de la demande est requise',
  }),
  encounter: Joi.optional(),
  patient: Joi.optional(),
  urgency: Joi.optional(),
  careSetting: Joi.optional(),
  dateActivated: Joi.optional(),
  orderer: Joi.optional(),
  uuid: Joi.optional(),
});
