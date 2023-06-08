import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import useConcept from './use-concept';

describe('useConcept', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useConcept());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
