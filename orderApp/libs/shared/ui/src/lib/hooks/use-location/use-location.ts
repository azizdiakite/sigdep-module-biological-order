import { LocationService } from '@spbogui-openmrs/shared/service';
import {
  Location,
  LocationForm,
  LocationTag,
} from '@spbogui-openmrs/shared/model';
import { LocationTags, locationToForm } from '@spbogui-openmrs/shared/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseLocation {
  count: number;
  increment: () => void;
}

export function useLocation(): UseLocation {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount((x) => x + 1), []);
  return { count, increment };
}

export const useFindLocation = (
  uuid: string,
  params = 'default',
  enabled = false
) => {
  // const { data, refetch: getLocation } = useQuery(
  //   ['locations', 'one', uuid, params],
  //   async () => await LocationService.findOne(uuid, params),
  //   { enabled }
  // );

  const { data, refetch: getLocation } = useQuery({
    queryKey: ['locations', { params, uuid }],
    queryFn: async () => await LocationService.findOne(uuid, params),
    enabled,
  });

  const location = data ? data : undefined;
  const locationForm = data ? locationToForm(data) : undefined;
  // const socialCenters =
  //   data && data.childLocations
  //     ? data.childLocations.filter(
  //         (l) =>
  //           l.tags && l.tags.findIndex((t) => t.uuid === LocationTags.SC) !== -1
  //       )
  //     : // reduce((list: Location[], l: Location) => {
  //       //     console.log(l);

  //       //     if (
  //       //       l.tags &&
  //       //       l.tags.findIndex((t) => t.uuid === LocationTags.SC) !== -1
  //       //     ) {
  //       //       list.push(l);
  //       //       console.log('is social center');
  //       //     }
  //       //     return list;
  //       //   }, [])
  //       [];

  return {
    location,
    locationForm,
    // socialCenters,
    getLocation,
  };
};

export const useFindAllLocations = (
  view: string,
  params = '',
  enabled = false
) => {
  const {
    data,
    refetch: findAllLocations,
    isLoading,
  } = useQuery(
    ['locations', 'all', view, params],
    async () => await LocationService.findAll(view, params),
    { enabled }
  );

  const locations = data ? data : [];
  return {
    locations,
    findAllLocations,
    isLoading,
  };
};

export const useFindAllLocationTags = (
  view: string,
  params = '',
  filter = '',
  enabled = false
) => {
  const {
    data,
    refetch: findAllLocationTags,
    isLoading,
  } = useQuery(
    ['locations', 'all-tags', view, params],
    async () => await LocationService.findLocationTags(view, params),
    { enabled }
  );

  const locationTags: LocationTag[] = data
    ? filter !== ''
      ? data.filter((d) => d.uuid.endsWith(filter)).map((d) => d)
      : data
    : [];
  return {
    locationTags,
    findAllLocationTags,
    isLoading,
  };
};

export const useSaveOrUpdateLocation = (uuid: string) => {
  const { mutate: updateSaveOrUpdate, isLoading } = useMutation(
    (location: LocationForm) => LocationService.addOrUpdate(location, uuid)
  );
  return {
    updateSaveOrUpdate,
    isLoading,
  };
};

export const useRemoveLocation = (purge = false) => {
  const { mutate: removeLocation, isLoading } = useMutation((uuid: string) =>
    LocationService.remove(uuid, purge)
  );
  return {
    removeLocation,
    isLoading,
  };
};

export const useFindOneLocation = (
  uuid: string,
  params = 'default',
  view = 'full'
) => {
  const {
    data,
    refetch: findOne,
    isLoading,
  } = useQuery(
    [uuid, params, view],
    async () => await LocationService.findOne(uuid, params),
    { enabled: true }
  );

  const location = data ? data : undefined;
  const locationSecond = data ? data : undefined;
  return { location, locationSecond, findOne, isLoading };
};
