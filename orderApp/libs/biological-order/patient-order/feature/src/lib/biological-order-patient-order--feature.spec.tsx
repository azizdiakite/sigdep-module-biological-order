import { render } from '@testing-library/react';

import BiologicalOrderPatientOrderFeature from './biological-order-patient-order--feature';

describe('BiologicalOrderPatientOrderFeature', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BiologicalOrderPatientOrderFeature />);
    expect(baseElement).toBeTruthy();
  });
});
