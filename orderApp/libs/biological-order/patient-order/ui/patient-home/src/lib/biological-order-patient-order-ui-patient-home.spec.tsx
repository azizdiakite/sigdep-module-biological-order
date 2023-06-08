import { render } from '@testing-library/react';

import BiologicalOrderPatientOrderUiPatientHome from './biological-order-patient-order-ui-patient-home';

describe('BiologicalOrderPatientOrderUiPatientHome', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BiologicalOrderPatientOrderUiPatientHome />
    );
    expect(baseElement).toBeTruthy();
  });
});
