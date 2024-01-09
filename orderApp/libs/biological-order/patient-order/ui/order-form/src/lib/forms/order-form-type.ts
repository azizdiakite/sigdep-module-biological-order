import {
  EncounterForm,
  encounterSchema,
  ENCOUNTER_INITIAL_VALUES,
  OrderForm,
  orderSchema,
  ORDER_INITIAL_VALUE,
} from '@spbogui-openmrs/shared/model';
import { EncounterRole ,EncounterType ,Concepts} from '@spbogui-openmrs/shared/utils';
import Joi from 'joi';

export interface OrderFormType {
  encounter: EncounterForm;
  order: OrderForm;
  pregnancyStatus?: string;
  currentlyBreastfeedingChild?: string;
  providerNumber?: string,
  providerEmail?: string,
  hivType: string;
  isOnTreatment?: string;
  arvInitialYear?: Date;
  regimeLine?: string;
  regime?: string;
  requestReason: string;
  otherCVReason? : string
  initialCd4Absolute?: string;
  initialCd4Percentage?: string;
  initialCd4Date?: Date;
  latestCd4Absolute?: string;
  latestCd4Percentage?: string;
  latestCd4Date?: Date;
  hasViralLoad?: string;
  latestViralLoad?: string;
  latestViralLoadLaboratory?: string;
  latestViralLoadDate?: Date;
  requestDate?: Date;
  encounterTime?: string;
  collectionType: string;
  clinicianPhoneNumber?: string;
  clinicianEmail?:string;
 // otherRegimeLine?: string;
}

export const ENCOUNTER_INITIAL_VALUE_FORM: EncounterForm =  {
  ...ENCOUNTER_INITIAL_VALUES,
  encounterProviders: [
    { encounterRole: EncounterRole.CLINICIAN, provider: '' },
    { encounterRole: EncounterRole.COLLECTOR, provider: '' },
  ],
};

export const orderFormSchema = Joi.object<OrderFormType>({
  encounter: encounterSchema,
  order: orderSchema,
  hivType: Joi.optional(),
  isOnTreatment: Joi.optional(),
  arvInitialYear: Joi.optional(),
  regimeLine: Joi.optional(),
  regime: Joi.optional(),
  requestReason: Joi.optional(),
  providerNumber: Joi.optional(),
  providerEmail: Joi.optional(),
  otherCVReason: Joi.optional(),  
  pregnancyStatus : Joi.optional(),
  currentlyBreastfeedingChild: Joi.optional(),
  initialCd4Absolute: Joi.optional(),
  initialCd4Percentage: Joi.optional(),
  initialCd4Date: Joi.optional(),
  latestCd4Absolute: Joi.number().allow('').optional(),
  latestCd4Percentage: Joi.number().allow('').optional(),
  latestCd4Date: Joi.optional(),
  hasViralLoad: Joi.optional(),
  clinicianPhoneNumber: Joi.optional(),
  clinicianEmail: Joi.optional(),
  
  //hasViralLoad: Joi.string().valid(Concepts.YES, Concepts.NO).required(),
 /* latestViralLoadLaboratory :Joi.optional().when('hasViralLoad', {
    is: Concepts.YES,
    then: Joi.string().required().messages({ 'string.empty': 'Le laboratoire est requis' }),
    otherwise: Joi.optional()
  }),*/

  latestViralLoadLaboratory :Joi.optional(),

  latestViralLoad: Joi.optional().when('hasViralLoad', {
    is: Concepts.YES,
    then: Joi.string()
      .required()
      .messages({'any.required': 'La valeur est requise'}),
    otherwise: Joi.optional()
  }),

  latestViralLoadDate: Joi.optional(),
  requestDate: Joi.date()
    .required()
    .messages({ 'any.required': 'La date de la demande est requise' }),
  collectionType: Joi.string()
    .required()
    .messages({ 'string.empty': 'Le type de prélèvement est requis' }),
 // otherRegimeLine: Joi.optional(),
 encounterTime : Joi.optional()
});


export const ORDER_FORM_INITIAL_VALUE: OrderFormType =  {
  encounter: {
    ...ENCOUNTER_INITIAL_VALUES,
    encounterProviders: [
      { encounterRole: EncounterRole.CLINICIAN, provider: '' },
      { encounterRole: EncounterRole.COLLECTOR, provider: '' },
    ],
    encounterType: EncounterType.REQUEST_EXAM,
  },
  order: {
    ...ORDER_INITIAL_VALUE,
    concept: Concepts.HIV_VIRAL_LOAD_TEST,
    type: 'testorder',
  },
  requestReason: '',
  hivType: '',
  currentlyBreastfeedingChild: '',
  pregnancyStatus : '' ,
  isOnTreatment: '',
  initialCd4Percentage: '',
  initialCd4Absolute: '',
  initialCd4Date: undefined,
  latestCd4Percentage: '',
  latestCd4Absolute: '',
  latestCd4Date: undefined,
  hasViralLoad: '',
  latestViralLoad: '',
  latestViralLoadDate: undefined,
  latestViralLoadLaboratory: '',
  arvInitialYear: undefined,
  requestDate: undefined,
  encounterTime: undefined,
  collectionType: '',
  regimeLine: '',
  //otherRegimeLine: '',
  regime: '',
  otherCVReason : "",
  providerNumber: '',
  providerEmail: '',
  clinicianEmail: '',
  clinicianPhoneNumber: undefined
};

