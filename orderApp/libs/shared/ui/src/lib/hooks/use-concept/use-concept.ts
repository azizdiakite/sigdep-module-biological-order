import { SelectItem } from '@mantine/core';
import { ConceptService } from '@spbogui-openmrs/shared/service';
import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseConcept {
  count: number;
  increment: () => void;
}

export function useConcept(): UseConcept {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount((x) => x + 1), []);
  return { count, increment };
}

export default useConcept;

export const useFindConcept = (uuid: string, view = 'full') => {
  const {
    data: concept,
    refetch: findConcept,
    isLoading,
  } = useQuery(
    ['concept', uuid, view],
    async () => await ConceptService.findOne(uuid, view),
    { enabled: true }
  );

  return {
    concept,
    isLoading,
    findConcept,
  };
};

export const useFindFilteredConcept = (
  // identifier: string | undefined,
  params = '',
  view = 'full',
  enabled = false
) => {
  const {
    data,
    refetch: findConcepts,
    isLoading,
  } = useQuery(
    ['patient', params, view],
    async () => await ConceptService.filter(params, view),
    { enabled }
  );

  const concepts = data ? data : [];
  return {
    findConcepts,
    isLoading,
    concepts,
  };
};
