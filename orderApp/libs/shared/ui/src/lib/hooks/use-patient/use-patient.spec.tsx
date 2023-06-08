import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import { useFindOnePatient } from './use-patient';

describe('usePatient', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useFindOnePatient(''));

    expect(result.current.patient).toBe(undefined);

    act(() => {
      result.current.findOnePatient();
    });

    expect(result.current.findOnePatient).toBe(1);
  });
});
