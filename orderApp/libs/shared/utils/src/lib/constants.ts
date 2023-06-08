export const ENCOUNTER_PROVIDER_DEFAULT =
  '738185ba-eac9-11e5-8f4d-e06995eac916';

const DEFAULT_ROLE = 'a0b03050-c99b-11e0-9572-0800200c9a66';
const CLINICIAN = 'd67a9eba-2ddd-42b5-814c-b39836536cce';
const COLLECTOR = '3eae50dd-86a4-4b1e-a5de-65a4fd22c28c';

export const EncounterRole = {
  DEFAULT_ROLE,
  CLINICIAN,
  COLLECTOR,
};

const FOLLOWUP_VISIT = '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f';
const BIOLOGICAL_EXAM = 'b2750363-7c00-4ece-bceb-47ab09b8d21b';
const ENROLLMENT = '8d5b27bc-c2cc-11de-8d13-0010c6dffd0f';
const REQUEST_EXAM = '8b51ec84-de51-4090-bcde-b6862dc0e253'

export const EncounterType = {
  FOLLOWUP_VISIT,
  BIOLOGICAL_EXAM,
  ENROLLMENT,
  REQUEST_EXAM
};

const HIV = '6b6e9d94-015b-48f6-ac95-da239512ff91';
const UPI = '66e6b206-e194-4fbd-b1ab-0fd5b5357ffe';

export const IdentifierType = {
  HIV,
  UPI,
};

export const CONCEPT_A38 = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
export const CONCEPT_A36 = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

export const LocationTags = {};

export const personPrivileges: string[] = [
  'Get People',
  'Get Person Attribute Types',
];

export const managePersonPrivileges: string[] = [
  ...personPrivileges,
  'Delete People',
  'Add People',
  'Edit People',
];

export const patientPrivileges: string[] = [
  'Get Patient Identifiers',
  'Get Patients',
  ...personPrivileges,
];

export const managePatientPrivileges: string[] = [
  ...patientPrivileges,
  ...personPrivileges,
  'Add Patients',
  'Edit Patients',
  'Delete Patients',
  // 'Add Patient Programs',
  'Add Patient Identifiers',
  'Edit Patient Identifiers',
  'Delete Patient Identifiers',
  // 'Delete Patient Programs',
  // 'Edit Patient Programs',
];

export const locationPrivileges: string[] = [
  // ...dreamsProgramPrivileges,
  'Get Locations',
  'Get Location Attribute Types',
  // 'View Locations',
];

export const locationTagPrivileges: string[] = [
  ...locationPrivileges,
  'Manage Location Tags',
];

export const manageLocationPrivileges: string[] = [
  ...locationTagPrivileges,
  'Manage Locations',
  'Manage Location Attribute Types',
];
export const obsPrivileges: string[] = [
  // ...dreamsProgramPrivileges,
  'Get Observations',
  'Get Concept Attribute Types',
  'Get Concept Classes',
  'Get Concept Datatypes',
  'Get Concepts',
];

export const manageObsPrivileges: string[] = [
  'Add Observations',
  'Delete Observations',
  'Edit Observations',
  ...obsPrivileges,
];

export const encounterPrivileges: string[] = [
  ...patientPrivileges,
  // ...personPrivileges,
  ...obsPrivileges,
  ...locationPrivileges,
  'Get Encounter Roles',
  'Get Encounter Types',
  'Get Encounters',
  'Get Providers',
  'Get Visits',
];

export const manageEncounterPrivileges: string[] = [
  'Add Encounters',
  'Delete Encounters',
  'Edit Encounters',
  'Add Visits',
  'Delete Visits',
  'Edit Visits',
  ...manageObsPrivileges,
  ...managePersonPrivileges,
  ...managePatientPrivileges,
  ...locationPrivileges,
  'Get Encounter Roles',
  'Get Encounter Types',
  'Get Encounters',
  'Manage Encounter Roles',
  // 'Manage Encounter Types',
  'View Encounter Types',
  'View Encounters',
];

export const userPrivileges: string[] = [
  'Edit User Passwords',
  'Get Users',
  'View Users',
  'Edit Users',
];

export const manageUserPrivileges: string[] = [
  ...userPrivileges,
  'Add Users',
  'Delete Users',
];

export const reportPrivileges: string[] = [
  'Add Cohorts',
  'Edit Cohorts',
  'Delete Cohorts',
  'Add Reports',
  'Edit Reports',
  'Delete Reports',
  'Run reports',
];

export const manageReportPrivileges: string[] = [
  ...reportPrivileges,
  'Add Report Objects',
  'Edit Report Objects',
  'Delete Report Objects',
  'Add Report Objects',
  'Edit Report Objects',
  'Delete Report Objects',
];



  const PREGNANCY_STATUS = '5272AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
  const CURRENTLY_BREAST_FEEDING = "5632AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const HIV_TYPE = "CI0030001AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const VIH_1 = "CI0030002AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const VIH_2 = "CI0030003AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const VIH_1_2 = "CI0030004AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const STARTED_ARV_TREATMENT = "160533AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const YES = "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const NO = "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
  const ARV_START_DATE = "159599AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const ANTI_RETRO_TREATMENT_LINE = "166073AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const FIRST_TREATMENT_LINE = "166074AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const SECOND_TREATMENT_LINE = "166075AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const THIRD_TREATMENT_LINE = "166076AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const OTHER = "5622AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const ARV_REGIMEN = "162240AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
  const HIV_VIRAL_LOAD_TEST = "856AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const OTHER_REASON = "CI0050001AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const REASON_FOR_VIRAL_LOAD_REQUEST = "CI0050002AAAAAAAAAAAAAAAAAAAAAAAAAAA"
  const CONTROL_VIRAL_LOAD = "CI0050003AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const VIROLOGIC_FAILURE = "160569AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const IMUNOLOGOC_FAILURE = "160566AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const CLINICAL_FAILURE = "163523AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const INNITIAL_CD4_COUNT = "164429AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const INNITIAL_CD4_PERCENT = "164430AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const INNITIAL_CD4_DATE = "159376AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const LATE_CD4_COUNT = "5497AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const LATE_CD4_PERCENT = "730AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const LATE_CD4_DATE = "160103AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
  const HAS_VIRAL_LOAD = "CI0050004AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const LAST_VIRAL_LOAD = "163545AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const LAST_VIRAL_LOAD_DATE = "163281AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const VIRAL_LOAD_REQUEST_DATE = "CI0050005AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const COLLECTION_TYPE = "CI0050007AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const COLLECTION_DATE = "c4389c60-32f5-4390-b7c6-9095ff880df5";
  const DBS = "CI0050009AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const PLASMA = "CI0050008AAAAAAAAAAAAAAAAAAAAAAAAAAA";


  export const Concepts = {
    PREGNANCY_STATUS,
    CURRENTLY_BREAST_FEEDING,
    HIV_TYPE ,
    VIH_1,
    VIH_2,
    VIH_1_2,
    STARTED_ARV_TREATMENT,
    YES,
    NO ,
    ARV_START_DATE,
    ANTI_RETRO_TREATMENT_LINE,
    FIRST_TREATMENT_LINE,
    SECOND_TREATMENT_LINE,
    THIRD_TREATMENT_LINE,
    OTHER,
    ARV_REGIMEN ,
    HIV_VIRAL_LOAD_TEST,
    OTHER_REASON,
    REASON_FOR_VIRAL_LOAD_REQUEST,
    CONTROL_VIRAL_LOAD,
    VIROLOGIC_FAILURE,
    IMUNOLOGOC_FAILURE,
    CLINICAL_FAILURE,
    INNITIAL_CD4_COUNT,
    INNITIAL_CD4_PERCENT,
    INNITIAL_CD4_DATE,
    LATE_CD4_COUNT,
    LATE_CD4_PERCENT,
    LATE_CD4_DATE ,
    HAS_VIRAL_LOAD,
    LAST_VIRAL_LOAD,
    LAST_VIRAL_LOAD_DATE,
    VIRAL_LOAD_REQUEST_DATE,
    COLLECTION_TYPE,
    DBS,
    PLASMA
  }

