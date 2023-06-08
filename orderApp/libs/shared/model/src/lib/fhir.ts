export interface Coding {
  system: string; // Identity of the terminology system
  version: string; // Version of the system - if relevant
  code: string; // Symbol in syntax defined by the system
  display: string; // Representation defined by the system
  userSelected: string; // If this coding was chosen directly by the user
}

export interface CodeableConcept {
  coding: Coding;
  text: string; // Plain text representation of the concept
}

export interface Reference {
  uuid: string;
}

export interface Task {
  id: string;
  resourceType: string;
  status: string;
  code: {
    text: string;
  };
  focus: {
    reference: string;
  };
  requester: {
    reference: string;
  };
  intent: string;
  lastModified: string;
}

export interface Name {
  given: string;
  family: string;
}

export interface Patient {
  id: string;
  resourceType: 'Patient';
  name: Name[];
  birthDate: Date;
  gender: string;
}

export interface Observation {
  id: string;
  resourceType: 'Observation';
  code: string;
}
