import { render } from '@testing-library/react';

import RedirectNoAuthority from './redirect-no-authority';

describe('RedirectNoAuthority', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RedirectNoAuthority />);
    expect(baseElement).toBeTruthy();
  });
});
