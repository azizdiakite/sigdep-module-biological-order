import { render } from '@testing-library/react';

import BiologicalOrderOrderListFeature from './biological-order-order-list-feature';

describe('BiologicalOrderOrderListFeature', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BiologicalOrderOrderListFeature />);
    expect(baseElement).toBeTruthy();
  });
});
