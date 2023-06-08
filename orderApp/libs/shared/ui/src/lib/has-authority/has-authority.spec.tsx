import { render } from '@testing-library/react';

import HasAuthority from './has-authority';

describe('HasAuthority', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HasAuthority />);
    expect(baseElement).toBeTruthy();
  });
});
