import { render } from '@testing-library/react';

import BiologicalOrderPatientOrderUiOrderPrint from './biological-order-patient-order-ui-order-print';

describe('BiologicalOrderPatientOrderUiOrderPrint', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BiologicalOrderPatientOrderUiOrderPrint />);
    expect(baseElement).toBeTruthy();
  });
});
