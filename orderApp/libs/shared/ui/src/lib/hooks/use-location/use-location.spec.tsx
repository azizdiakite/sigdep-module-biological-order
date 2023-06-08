import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import useLocation from './use-location';

describe('useLocation', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useLocation());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
