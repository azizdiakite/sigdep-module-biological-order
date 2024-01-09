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
const HIV_1 = 'VIH1';
const HIV_2 = 'VIH2';
const HIV_1_2 = 'VIH 1+2';
const TREATMENT_YES = 'Oui';
const FIRST_LINE_DESCRIPTION = 'Ligne 1 du régime ARV';
const SECOND_LINE_DESCRIPTION = 'Ligne 2 du régime ARV';
const THIRD_LINE_DESCRIPTION = 'Ligne 3 du régime ARV';


export const IdentifierType = {
  HIV,
  UPI,
};

export const initFormValues = {
  HIV_1_2,
  HIV_1,
  HIV_2,
  TREATMENT_YES,
  FIRST_LINE_DESCRIPTION,
  SECOND_LINE_DESCRIPTION,
  THIRD_LINE_DESCRIPTION
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
  const HIV_TYPE_INIT_FORM = "163623AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
  const VIH_1 = "CI0030002AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const VIH_2 = "CI0030003AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const VIH_1_2 = "CI0030004AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const STARTED_ARV_TREATMENT = "160533AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const STARTED_ARV_TREATMENT_INIT_FORM = "164540AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  //const STARTED_ARV_TREATMENT_INIT_FORM = "1255AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"; 
  const YES = "1065AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const NO = "1066AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
  const ARV_START_DATE = "159599AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const ARV_START_DATE_INIT_FORM = "165032AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const ANTI_RETRO_TREATMENT_LINE = "166073AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const FIRST_TREATMENT_LINE = "166074AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const SECOND_TREATMENT_LINE = "166075AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const THIRD_TREATMENT_LINE = "166076AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const TREATMENT_LINE_INIT_FORM = "164767AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const SECOND_TREATMENT_LINE_INIT_FORM = "164581AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const THIRD_TREATMENT_LINE_INIT_FORM = "164584AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const OTHER = "5622AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const ARV_REGIMEN = "162240AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
  const ARV_REGIMEN_INIT_FORM = "162240AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
  const HIV_VIRAL_LOAD_TEST = "856AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const OTHER_REASON = "CI0050001AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const REASON_FOR_VIRAL_LOAD_REQUEST = "CI0050002AAAAAAAAAAAAAAAAAAAAAAAAAAA"
  const CONTROL_VIRAL_LOAD = "CI0050003AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const VIROLOGIC_FAILURE = "160569AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const IMUNOLOGOC_FAILURE = "160566AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const CLINICAL_FAILURE = "163523AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const INNITIAL_CD4_COUNT = "164429AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const INNITIAL_CD4_COUNT_INIT_FORM = "5497AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const INNITIAL_CD4_PERCENT = "164792AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const INNITIAL_CD4_PERCENT_INIT_FORM = "730AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const INNITIAL_CD4_DATE_INIT_FORM = "164588AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const INNITIAL_CD4_DATE = "159376AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const LATE_CD4_COUNT = "5497AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const LATE_CD4_PERCENT = "730AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const LATE_CD4_DATE = "160103AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
  const HAS_VIRAL_LOAD = "CI0050004AAAAAAAAAAAAAAAAAAAAAAAAAAA";
 // const LAST_VIRAL_LOAD = "163545AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  //const LAST_VIRAL_LOAD = "165271AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"; 
  const LAST_VIRAL_LOAD = "CI0050030AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const LAST_VIRAL_LOAD_DATE = "163281AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  //const LAST_VIRAL_LOAD_LABORATORY = "164489AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const LAST_VIRAL_LOAD_LABORATORY = "CI0050020AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const VIRAL_LOAD_REQUEST_DATE = "CI0050005AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const VIRAL_LOAD_REQUEST_TIME = "CI0050006AAAAAAAAAAAAAAAAAAAAAAAAAAA"
  const COLLECTION_TYPE = "CI0050007AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const COLLECTION_DATE = "c4389c60-32f5-4390-b7c6-9095ff880df5";
  const DBS = "CI0050009AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const PLASMA = "CI0050008AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const PSC = "CI0050010AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const TRANSFERERD = "164665AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const CLINICIAN_PHONE_NUMBER = "CI0050040AAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const CLINICAL_EMAIL = "CI0050050AAAAAAAAAAAAAAAAAAAAAAAAAAA"
// f4503ae0-c285-4f69-b1f6-f61f942dd655  CI.005-0004

  const ANTIRETROVIRAL_PLAN = "1255AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"; //  1107,1256,1257,1259
  const NONE = "1107AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";


  const TYPE_VIH ='CI0030001AAAAAAAAAAAAAAAAAAAAAAAAAAA' ;//'163623AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';


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
    ARV_REGIMEN_INIT_FORM,
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
    LAST_VIRAL_LOAD_LABORATORY,
    LAST_VIRAL_LOAD_DATE,
    VIRAL_LOAD_REQUEST_DATE,
    VIRAL_LOAD_REQUEST_TIME,
    COLLECTION_TYPE,
    DBS,
    PLASMA,
    PSC,
    HIV_TYPE_INIT_FORM,
    STARTED_ARV_TREATMENT_INIT_FORM,
    ARV_START_DATE_INIT_FORM,
    INNITIAL_CD4_COUNT_INIT_FORM,
    INNITIAL_CD4_PERCENT_INIT_FORM,
    INNITIAL_CD4_DATE_INIT_FORM,
    TREATMENT_LINE_INIT_FORM,
    TYPE_VIH,
    TRANSFERERD,
    CLINICAL_EMAIL,
    CLINICIAN_PHONE_NUMBER,
    ANTIRETROVIRAL_PLAN,
    NONE
  }

