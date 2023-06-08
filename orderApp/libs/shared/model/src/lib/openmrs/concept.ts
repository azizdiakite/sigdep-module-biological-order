export interface ConceptName {
  name: string;
  locale: string;
  localePreferred: boolean;
  conceptNameType: 'FULLY_SPECIFIED' | 'SHORT_NAME';
  uuid: string;
}

export interface ConceptClass {
  name: string;
  description?: string;
  uuid?: string;
}

export interface ConceptNameSave {
  name: string;
  locale: string;
  localePreferred: boolean;
  conceptNameType: 'FULLY_SPECIFIED' | 'SHORT_NAME';
}

export interface ConceptDatatype {
  name: string;
}

export interface ConceptDescription {
  description: string;
  locale: string;
  uuid: string;
}

export interface ConceptDescriptionSave {
  description: string;
  locale: string;
}

export interface ConceptMappingSave {
  conceptReferenceTerm: string;
  conceptMapType: string;
}

export interface ConceptMapping {
  conceptReferenceTerm: string;
  conceptMapType: string;
  uuid: string;
}

export interface ConceptSave {
  names: ConceptName[];
  datatype: string;
  version: string;
  conceptClass: string;
  mappings: ConceptMappingSave[];
  descriptions: ConceptDescriptionSave[];
  uuid: string;
}

export interface Concept {
  names: ConceptName[];
  datatype: ConceptDatatype;
  version?: string;
  conceptClass?: ConceptClass;
  mappings?: ConceptMapping[];
  descriptions?: ConceptDescription[];
  answers: Concept[];
  uuid: string;
  display: string;
}
