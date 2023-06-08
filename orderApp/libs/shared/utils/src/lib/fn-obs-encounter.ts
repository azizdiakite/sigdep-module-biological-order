/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Obs,
  ObsForm,
  Encounter,
  EncounterForm,
  ObsEncounterForm,
} from '@spbogui-openmrs/shared/model';
import dayjs from 'dayjs';

export const getObsValueByObs = (obs: Obs): unknown => {
  // console.log('Concept datatype ', obs.concept.datatype.name);

  if (obs.concept.datatype.name === 'Boolean') {
    return true;
  } else if (obs.concept.datatype.name === 'Date') {
    return dayjs(obs.value).toDate();
  } else if (obs.concept.datatype.name === 'Coded') {
    if (obs.value instanceof Object) {
      return obs.value.uuid;
    }
    return obs.value;
  } else if (obs.concept.datatype.name === 'Numeric') {
    // const value: string = obs.value;
    return obs.value.toString().replace('.', ',');
  } else if (obs.concept.datatype.name === 'Time') {
    return dayjs(obs.value as Date).toDate();
  } else {
    return obs.value;
  }
};

export const obsToForm = (obs: Obs): ObsForm => {
  return {
    value: getObsValueByObs(obs),
    obsDatetime: obs.obsDatetime,
    concept: obs.concept.uuid,
    person: obs.person?.uuid,
    location: obs?.location.uuid,
    groupMembers: obs.groupMembers?.map((o: Obs) => obsToForm(o)),
    uuid: obs.uuid,
  };
};

export const obsEncounterToForm = (obs: Obs): ObsForm => {
  return {
    value: !obs.groupMembers ? getObsValueByObs(obs) : undefined,
    concept: obs.concept.uuid,
    groupMembers: obs.groupMembers?.map((o: Obs) => obsEncounterToForm(o)),
    uuid: obs.uuid,
  };
};

export const encounterToForm = (e: Encounter): EncounterForm => {
  return {
    encounterDatetime: dayjs(e.encounterDatetime).toDate(),
    patient: e.patient.uuid,
    encounterType: e.encounterType.uuid,
    encounterProviders: e.encounterProviders?.map((ep) => {
      return {
        encounterRole: ep.encounterRole.uuid,
        provider: ep.provider.uuid,
        uuid: ep.uuid,
      };
    }),
    location: e.location?.uuid,
    obs: e.obs?.map((o) => obsEncounterToForm(o)),
    uuid: e.uuid,
  };
};

export const removeFromGroup = (obsGroup: ObsForm, obs: ObsForm): ObsForm => {
  const index = obsGroup.groupMembers.findIndex(
    (o: ObsForm) => (o.uuid && o.uuid === obs.uuid) || o.concept === obs.concept
  );
  if (index !== undefined && index !== -1) {
    obsGroup.groupMembers.splice(index, 1);
  }
  return obsGroup;
};

export const removeFromList = (obs: ObsForm, obsList: ObsForm[]): ObsForm[] => {
  const index = obsList?.findIndex((o: ObsForm) => obs.concept === o.concept);
  // console.log(index);

  if (index !== -1) {
    obsList?.splice(index, 1);
  }
  return obsList;
};

export const addObsToList = (obs: ObsForm, obsList: ObsForm[]): ObsForm[] => {
  obsList = removeFromList(obs, obsList);
  obsList?.push(obs);
  return obsList;
};

export const setObsValue = (
  value: any,
  concept: string,
  encounter: EncounterForm,
  obsGroupUuid?: string,
  uuid?: string,
  type?: string
): ObsEncounterForm[] => {
  let obsList: ObsEncounterForm[] = encounter.obs;
  // console.log(value);

  let obs: ObsEncounterForm = findObs(concept, obsList, encounter, uuid);

  const groupObs: ObsEncounterForm | undefined = obsGroupUuid
    ? findObs(obsGroupUuid, obsList, encounter, uuid)
    : undefined;

  if (type === 'checkbox') {
    if (value) {
      obs.value = value;
    } else {
      obs.voided = true;
    }
  } else {
    const tmpValue = value as string;
    if (tmpValue && tmpValue.length !== 0) {
      obs.value = value;
    } else {
      obs.voided = true;
    }
  }
  if (!obs.uuid && obs.voided) {
    removeFromList(obs, obsList);
  }

  if (groupObs) {
    if (obs.voided) {
      if (!obs.uuid) {
        obs = removeFromGroup(groupObs, obs);
        if (groupObs.groupMembers.length === 0) {
          obsList = removeFromList(groupObs, obsList);
        }
      } else {
        const idx = groupObs.groupMembers?.findIndex((o: ObsForm) => !o.voided);
        groupObs.voided = idx === -1;
        obsList = addObsToList(addToGroup(groupObs, obs), obsList);
      }
    } else {
      obsList = addObsToList(addToGroup(groupObs, obs), obsList);
    }
  } else {
    if ((obs.voided && obs.uuid === null) || obs.uuid === '') {
      obsList = removeFromList(obs, obsList);
    } else {
      obsList = addObsToList(obs, obsList);
    }
  }

  return obsList;
};

export const setEncounterObsValue = (
  value: any,
  concept: string,
  obsList: ObsForm[],
  obsGroupUuid?: string,
  uuid?: string,
  type?: string
): ObsEncounterForm[] => {
  // let obsList: ObsSave[] = encounter.obs;
  const obs: ObsForm = findEncounterObs(concept, obsList, uuid);

  const groupObs: ObsEncounterForm | undefined = obsGroupUuid
    ? findEncounterObs(obsGroupUuid, obsList, uuid)
    : undefined;
  const realValue = value instanceof String ? value.replace('_', '') : value;
  return updateObs(obs, groupObs, realValue, obsList, type);
};

const updateObs = (
  obs: ObsEncounterForm,
  groupObs: ObsEncounterForm | undefined,
  value: any,
  obsList: ObsEncounterForm[],
  type?: string
) => {
  if (type === 'checkbox') {
    obs.value = value;
    obs.voided = !value;
    // if (value) {
    // } else {
    //   obs.voided = true;
    // }
  } else {
    // const tmpValue = value as string;
    if (value && (value as string).length !== 0) {
      obs.value = value;
    } else {
      obs.voided = true;
    }
  }
  if (!obs.uuid && obs.voided) {
    removeFromList(obs, obsList);
  }

  if (groupObs) {
    if (obs.voided) {
      if (!obs.uuid) {
        obs = removeFromGroup(groupObs, obs);
        if (groupObs.groupMembers.length === 0 && !groupObs.uuid) {
          obsList = removeFromList(groupObs, obsList);
        }
      } else {
        console.log('group to delete', groupObs.concept);

        const idx = groupObs.groupMembers?.findIndex((o: ObsForm) => !o.voided);
        groupObs.voided = idx === -1;
        obsList = addObsToList(addToGroup(groupObs, obs), obsList);
      }
    } else {
      obsList = addObsToList(addToGroup(groupObs, obs), obsList);
    }
  } else {
    if (obs.voided && !obs.uuid) {
      obsList = removeFromList(obs, obsList);
    } else {
      obsList = addObsToList(obs, obsList);
    }
  }
  return obsList?.filter(
    (o) => !(!o.uuid && o.voided && o.groupMembers.length === 0)
  );
};

export function addToGroup(groupObs: ObsForm, obs: ObsForm): ObsForm {
  groupObs = removeFromGroup(groupObs, obs);
  if (groupObs) {
    groupObs?.groupMembers.push(obs);
  }

  return groupObs;
}

export function findObs(
  conceptUuid: string,
  obs: ObsForm[],
  e: EncounterForm,
  uuid?: string
): ObsForm {
  return (
    obs?.find(
      (o) => (uuid && o.uuid === uuid) || (!uuid && o.concept === conceptUuid)
    ) || {
      obsDatetime: e.encounterDatetime,
      person: e.patient,
      location: e.location,
      concept: conceptUuid,
      groupMembers: [],
    }
  );
}

export function findEncounterObs(
  concept: string,
  obs: ObsForm[],
  uuid?: string
): ObsForm {
  return (
    obs?.find(
      (o) => (uuid && o.uuid === uuid) || (!uuid && o.concept === concept)
    ) || {
      concept,
      groupMembers: [],
    }
  );
}

export const createObs = (
  concept: string,
  obsList: ObsEncounterForm[]
): { obs: ObsEncounterForm } => {
  const obs = obsList.find((o) => o.uuid && o.concept === concept) || {
    concept,
    groupMembers: [],
  };

  return {
    obs,
  };
};

export const addInGroup = (
  obs: ObsEncounterForm,
  groupObs: ObsEncounterForm
) => {
  groupObs = removeFromGroup(groupObs, obs);
  if (groupObs) {
    groupObs.groupMembers.push(obs);
  }

  return groupObs;
};

export const setObs = (
  value: any,
  obsList: ObsEncounterForm[],
  conceptUuid: string,
  type?: string,
  groupConceptUuid?: string
): ObsEncounterForm[] => {
  let observation: ObsEncounterForm | null = null;
  if (groupConceptUuid) {
    const { obs: groupObs } = createObs(groupConceptUuid, obsList);
    const { obs } = createObs(conceptUuid, groupObs.groupMembers);

    const newObs = setValue(value, obs, type);
    groupObs.groupMembers = addObsToList(newObs, groupObs.groupMembers);
    observation = groupObs;

    if (observation.groupMembers.every((o) => o.voided === true || !o.value)) {
      observation.voided = true;
    }
  } else {
    const { obs: obsCreated } = createObs(conceptUuid, obsList);
    observation = setValue(value, obsCreated, type);
  }

  if (observation.uuid) {
    return addObsToList(observation, obsList);
  } else {
    if (observation.voided) {
      return removeFromList(observation, obsList);
    } else {
      return addObsToList(observation, obsList);
    }
  }
};

export const setGroupObs = (
  value: any,
  obsGroup: ObsEncounterForm,
  conceptUuid: string,
  type?: string
): ObsEncounterForm => {
  const members = obsGroup.groupMembers;
  const { obs } = createObs(conceptUuid, members);

  const returnedObs = setValue(value, obs, type);
  obsGroup.groupMembers = addObsToList(returnedObs, members);

  if (obsGroup.groupMembers.every((o) => o.voided === true)) {
    obsGroup.voided = true;
  }
  return addInGroup(returnedObs, obsGroup);
};

const setValue = (
  value: any,
  obs: ObsEncounterForm,
  type?: string
): ObsEncounterForm => {
  // console.log(value);

  if (type === 'checkbox') {
    if (obs.uuid) {
      obs.value = value;
      obs.voided = !value;
    } else {
      obs.value = value;
    }
  } else {
    if (value) {
      obs.value = value;
      obs.voided = false;
    } else {
      obs.voided = true;
    }
  }
  return obs;
};
