import { LocationForm, Location } from '@spbogui-openmrs/shared/model';

export const locationToForm = (location: Location): LocationForm => {
  return {
    name: location.name ? location.name : '',
    description: location.description ? location.description : '',
    address1: location.address1 ? location.address1 : '',
    address2: location.address2 ? location.address2 : '',
    address3: location.address3,
    address4: location.address4,
    address5: location.address5,
    address6: location.address6,
    address7: location.address7,
    address8: location.address8,
    postalCode: location.postalCode ? location.postalCode : '',
    tags: location.tags ? location.tags.map((t) => t.uuid) : [],
    childLocations: location.childLocations
      ? location.childLocations.map((c) => c.uuid)
      : [],
    parentLocation: location.parentLocation ? location.parentLocation.uuid : '',
    attributes: location.attributes
      ? location.attributes.map((a) => {
          return { attributeType: a.attributeType.uuid, value: a.value };
        })
      : [],
    uuid: location.uuid,
  };
};
