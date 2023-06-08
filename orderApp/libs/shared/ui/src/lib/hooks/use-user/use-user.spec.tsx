import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import { useUser } from './use-user';

describe('useR', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useUser());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
