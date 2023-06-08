import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import { useFindEncounter } from './use-encounter';

describe('useFindEncounter', () => {
  it('should render successfully', () => {
    const uuid = '';

    const { result } = renderHook(() => useFindEncounter(uuid));

    expect(result.current.encounter?.uuid).toBe(undefined);

    act(() => {
      result.current.findOneEncounter();
    });

    expect(result.current.encounter?.uuid).toBe(uuid);
  });
});
