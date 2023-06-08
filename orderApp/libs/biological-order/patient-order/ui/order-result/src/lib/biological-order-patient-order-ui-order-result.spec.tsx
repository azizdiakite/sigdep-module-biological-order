import { render } from '@testing-library/react';

import BiologicalOrderPatientOrderUiOrderResult from './biological-order-patient-order-ui-order-result';

describe('BiologicalOrderPatientOrderUiOrderResult', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <BiologicalOrderPatientOrderUiOrderResult />
    );
    expect(baseElement).toBeTruthy();
  });
});
