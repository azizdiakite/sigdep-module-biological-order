import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import useProvider from './use-provider';

describe('useProvider', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useProvider());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
