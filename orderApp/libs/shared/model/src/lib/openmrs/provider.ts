import { Person, PersonForm } from './person';

export interface ProviderAttributeType {
  name: string;
  description: string;
  datatypeClassname: string;
  minOccurs: number;
  maxOccurs: number;
  datatypeConfig: string;
  uuid: string;
}

export interface ProviderAttribute {
  attributeType: ProviderAttributeType;
  display: string;
  value: string;
  uuid: string;
}

export interface ProviderAttributeForm {
  attributeType: string;
  value: string;
}

export interface Provider {
  person: Person;
  identifier: string;
  attributes: ProviderAttribute[];
  retired: boolean;
  display: string;
  uuid: string;
}
export interface ProviderForm {
  person: PersonForm;
  identifier: string;
  attributes: ProviderAttributeForm[];
  retired: boolean;
}
