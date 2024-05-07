import { CONCEPT_A36, LocationTags } from './constants';
import { Location, LocationListItem } from '@spbogui-openmrs/shared/model';

export function sharedUtils(): string {
  return 'shared-utils';
}

export const between = (value: number, a: number, b: number): boolean => {
  return value >= a && value <= b;
};

export const customEncounterParams =
  'custom:(encounterDatetime,uuid,location:(uuid,name),encounterType:(uuid),obs:(display,value:(uuid),groupMembers:(value:(uuid),concept:(datatype:(name),uuid),uuid),concept:(datatype:(name),uuid),uuid),patient:(uuid,identifiers:(identifier),person:(names:(givenName,familyName))),encounterProviders:(uuid,encounterRole:(uuid),provider:(uuid,person:(names:(givenName,familyName)))),orders:(orderNumber,accessionNumber,fulfillerStatus,fulfillerComment,dateActivated))';

export const customPatientParams =
  'custom:(person:(gender,birthdate,age,names:(familyName,givenName,uuid,preferred),' +
  'addresses:(address1,address2,address3,address4,address5,address6,country,countyDistrict,' +
  'stateProvince,cityVillage,postalCode,startDate,endDate,latitude,longitude,uuid)),' +
  'identifiers:(identifier,location:(uuid),identifierType:(uuid),preferred,uuid),uuid)';

export const concept = (code: string): string => {
  if (code.toLowerCase() === 'oui') {
    return 'd57ee217-fabe-4577-bf8f-285fb6120e21';
  } else if (code.toLowerCase() === 'non') {
    return '9e43bcca-66e7-4ecb-b1b6-75d2d5cc271c';
  } else {
    return `${CONCEPT_A36}${code}`.slice(code.length);
  }
};

export const locationHierarchyToSelectItems = (
  location?: Location
): LocationListItem[] => {
  const locationList: LocationListItem[] = [];
  // locationList.push({
  //   value: location.uuid,
  //   label: `(${location.postalCode}) ${location.name}`,
  // });
  if (location && location.childLocations) {
    location.childLocations.forEach((l) => {
      const element: LocationListItem = {
        item: { value: l.uuid, label: `(${l.postalCode}) ${l.name}` },
        itemChildren: [],
      };

      if (l.childLocations) {
        element.itemChildren.push(...locationHierarchyToSelectItems(l));
      }
      locationList.push(element);
    });
  }
  return locationList;
};

// export const createListFromTree = (location: Location): Location[] => {
//   const locations: Location[] = [...[location]];
//   if (
//     location.childLocations &&
//     (!location.tags ||
//       location.tags.some((l) => l.uuid === LocationTags.SAFE_SPACE))
//   ) {
//     locations.push(
//       ...location.childLocations.map((l) => {
//         if (l.childLocations) {
//           locations.push(...createListFromTree(l));
//         }
//         return l;
//       })
//     );
//   }

//   return locations;
// };
