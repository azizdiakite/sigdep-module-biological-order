import { useQuery } from '@tanstack/react-query';
import { ProviderService } from '@spbogui-openmrs/shared/service';
import { useState, useCallback } from 'react';
import { SelectItem } from '@mantine/core';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UseProvider {
  count: number;
  increment: () => void;
}

export function useProvider(): UseProvider {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => setCount((x) => x + 1), []);
  return { count, increment };
}

export default useProvider;

export const useFindFilteredProvider = (
  // identifier: string | undefined,
  params = '',
  view = 'full',
  enabled = false
) => {
  const {
    data: providers,
    refetch: findFilteredPatient,
    isLoading,
  } = useQuery(
    ['patient', params, view],
    async () => await ProviderService.findByQuery(params, view),
    { enabled }
  );

  const providerSelect: SelectItem[] = providers
    ? providers.map((p) => {
        return { value: p.uuid, label: p.display };
      })
    : [];

  // const patient = data && data.length > 0 ? data[0] : undefined;
  return {
    providers,
    findFilteredPatient,
    isLoading,
    providerSelect,
  };
};
