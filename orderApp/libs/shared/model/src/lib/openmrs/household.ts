import { Location } from './location';
import { Patient } from './patient';
import { Person, PersonAddress } from './person';

export interface HouseholdIdentifier {
  identifier: string;
  identifierLocation: Location;
  uuid: string;
}

export interface HouseholdIdentifierForm {
  identifier: string;
  identifierLocation: string;
  uuid: string;
}

export interface HouseholdMember {
  patient: Patient;
  joiningDate: Date;
  householdChief: boolean;
  careGiver: boolean;
  vulnerableChild: boolean;
  orderNumber: string;
  takingCareOrderNumber: string;
  location: Location;
  household: Household;
  leavingDate: Date;
  display: string;
  hivStatus: string;
  realNeeds: string;
  memberHouseholdIdentifier: string;
  memberHouseholdUuid: string;
  uuid: string;
}

export interface HouseholdMemberForm {
  patient: string;
  joiningDate: Date;
  householdChief: boolean;
  careGiver: boolean;
  vulnerableChild: boolean;
  orderNumber: string;
  takingCareOrderNumber: string;
  location: string;
  leavingDate?: Date;
  uuid?: string;
}

export interface HouseholdEvaluation {
  evaluationDate: Date;
  firstEvaluation: boolean;
  foodSecurityScore: number;
  nutritionScore: number;
  healthScore: number;
  childrenEducationScore: number;
  incomeScore: number;
  employmentScore: number;
  shelterAndAccommodationScore: number;
  personInChargeScore: number;
  protectionScore: number;
  location: Location;
  evaluator1?: Person;
  evaluator2?: Person;
  houseHold?: Household;
  totalScore?: number;
  uuid: string;
}

export interface HouseholdEvaluationForm {
  evaluationDate: Date;
  firstEvaluation: boolean;
  foodSecurityScore: number;
  nutritionScore: number;
  healthScore: number;
  childrenEducationScore: number;
  incomeScore: number;
  employmentScore: number;
  shelterAndAccommodationScore: number;
  personInChargeScore: number;
  protectionScore: number;
  location: string;
  evaluator1?: string;
  evaluator2?: string;
  uuid: string;
}

export interface HouseholdCharacteristic {
  registrationDate: Date;
  householdSize: number;
  location: Location;
  socialCenter: Location;
  numberOfActivePerson: number;
  numberOfOvc: number;
  numberOfMealPerDay: number;
  entryPoint: number; // ENUM
  otherEntryPoint?: string;
  accommodationType: string; // ENUM
  otherAccommodationType?: string;
  numberOfRoom?: number;
  housingSituation: string; // ENUM
  otherHousingSituation?: string;
  hasWaterCloset: boolean;
  hasLatrine: boolean;
  hasBathroom: boolean;
  hasKitchen: boolean;
  mainWaterSource: string; // ENUM
  otherMainWaterSource?: string;
  mainElectricitySource: string; // ENUM
  otherMainElectricitySource?: string;
  mainCombustible: string; // ENUM
  otherMainCombustible?: string;
  hasTelephone?: boolean;
  hasTelevision?: boolean;
  hasRadio?: boolean;
  hadRefrigerator?: boolean;
  socialCapital?: string;
  incomeFromProfessionalActivity?: boolean;
  incomeFromFamilySupport?: boolean;
  incomeFromExternalSupport?: boolean;
  otherIncomeSource?: string;
  estimatedMonthlyIncome?: string; // ENUM
  estimatedMonthlyExpenses?: number;
  householdClassification?: string; // ENUM
  householdBecoming?: string; // ENUM
  otherHouseholdBecoming?: string;
  transferDestination?: string;
  householdBecomingDate?: Date;
  uuid: string;
}

export interface HouseholdCharacteristicForm {
  registrationDate: Date;
  householdSize?: number;
  location: string;
  socialCenter?: string;
  numberOfActivePerson?: number;
  numberOfOvc?: number;
  numberOfMealPerDay?: number;
  entryPoint?: number; // ENUM
  otherEntryPoint?: string;
  accommodationType?: string; // ENUM
  otherAccommodationType?: string;
  numberOfRoom?: number;
  housingSituation?: string; // ENUM
  otherHousingSituation?: string;
  hasWaterCloset: boolean;
  hasLatrine: boolean;
  hasBathroom: boolean;
  hasKitchen: boolean;
  mainWaterSource?: string; // ENUM
  otherMainWaterSource?: string;
  mainElectricitySource?: string; // ENUM
  otherMainElectricitySource?: string;
  mainCombustible?: string; // ENUM
  otherMainCombustible?: string;
  hasTelephone?: boolean;
  hasTelevision?: boolean;
  hasRadio?: boolean;
  hadRefrigerator?: boolean;
  socialCapital?: string;
  incomeFromProfessionalActivity?: boolean;
  incomeFromFamilySupport?: boolean;
  incomeFromExternalSupport?: boolean;
  otherIncomeSource?: string;
  estimatedMonthlyIncome?: string; // ENUM
  estimatedMonthlyExpenses?: number;
  householdClassification?: string; // ENUM
  householdBecoming?: string; // ENUM
  otherHouseholdBecoming?: string;
  transferDestination?: string;
  householdBecomingDate?: Date;
  uuid: string;
}

export interface HouseholdGraduation {
  graduationDate: Date;
  memberHivStatusKnown: string; // ENUM
  memberViralLoadSuppressed: string; // ENUM
  hivPatientSharedStatus: string; // ENUM
  childrenOverTenInAnnouncingStatus: string; // ENUM
  householdEconomicallyStable: string; // ENUM
  noViolenceLastSixMonths: string; // ENUM
  appropriateServiceViolenceIssues: string; // ENUM
  homeSafeForChildren: string; // ENUM
  adultInHouseholdSinceSixMonth: string; // ENUM
  childrenAttendingRegularlySchool: string; // ENUM
  nonSchoolInApprenticeshipForSixMonth: string; // ENUM
  schoolFeesCovered: string; // ENUM
  totalYes: number;
  totalNo: number;
  totalNotApplicable: number;
  location: Location;
  uuid: string;
  intervention1?: string;
  intervention1Date?: Date;
  intervention2?: string;
  intervention2Date?: Date;
  intervention3?: string;
  intervention3Date?: Date;
  intervention4?: string;
  intervention4Date?: Date;
  intervention5?: string;
  intervention5Date?: Date;
  intervention6?: string;
  intervention6Date?: Date;
  intervention7?: string;
  intervention7Date?: Date;
  intervention8?: string;
  intervention8Date?: Date;
  intervention9?: string;
  intervention9Date?: Date;
  intervention10?: string;
  intervention10Date?: Date;
  voided: boolean;
}

export interface HouseholdGraduationForm {
  graduationDate: Date;
  memberHivStatusKnown: string; // ENUM
  memberViralLoadSuppressed: string; // ENUM
  hivPatientSharedStatus: string; // ENUM
  childrenOverTenInAnnouncingStatus: string; // ENUM
  householdEconomicallyStable: string; // ENUM
  noViolenceLastSixMonths: string; // ENUM
  appropriateServiceViolenceIssues: string; // ENUM
  homeSafeForChildren: string; // ENUM
  adultInHouseholdSinceSixMonth: string; // ENUM
  childrenAttendingRegularlySchool: string; // ENUM
  nonSchoolInApprenticeshipForSixMonth: string; // ENUM
  schoolFeesCovered: string; // ENUM
  totalNotApplicable: number;
  location: string;
  intervention1?: string;
  intervention1Date?: Date;
  intervention2?: string;
  intervention2Date?: Date;
  intervention3?: string;
  intervention3Date?: Date;
  intervention4?: string;
  intervention4Date?: Date;
  intervention5?: string;
  intervention5Date?: Date;
  intervention6?: string;
  intervention6Date?: Date;
  intervention7?: string;
  intervention7Date?: Date;
  intervention8?: string;
  intervention8Date?: Date;
  intervention9?: string;
  intervention9Date?: Date;
  intervention10?: string;
  intervention10Date?: Date;
  uuid?: string;
}

export interface HouseholdAddress {
  startDate: Date;
  address: PersonAddress;
  endDate: Date;
  uuid: string;
  voided: boolean;
}

export interface HouseholdStructure {
  startDate: Date;
  endDate?: Date;
  structure: Location;
  uuid: string;
  voided: boolean;
}

export interface HouseholdStructureForm {
  startDate?: Date;
  endDate?: Date;
  structure?: string;
  uuid?: string;
}

export interface Household {
  location: Location;
  identifiers: HouseholdIdentifier[];
  socialCenter: Location;
  characteristics: HouseholdCharacteristic[];
  currentCharacteristics: HouseholdCharacteristic;
  members: HouseholdMember[];
  householdAddress?: PersonAddress;
  evaluations?: HouseholdEvaluation[];
  graduations?: HouseholdGraduation[];
  householdChief?: HouseholdMember;
  householdCardGivers?: HouseholdMember[];
  currentIdentifier: HouseholdIdentifier;
  householdGraduationResult?: string;
  structures?: HouseholdStructure[];
  currentStructures?: HouseholdStructure;
  addresses?: HouseholdAddress[];
  currentAddresses?: HouseholdAddress;
  uuid?: string;
}

export interface HouseholdForm {
  location: string;
  identifiers: HouseholdIdentifierForm[];
  characteristics: HouseholdCharacteristicForm[];
  members: HouseholdMemberForm[];
  householdAddress?: PersonAddress;
  evaluations?: HouseholdEvaluationForm[];
  graduations?: HouseholdGraduationForm[];
  structures?: HouseholdStructureForm[];
  addresses?: HouseholdAddress[];
  uuid?: string;
}
