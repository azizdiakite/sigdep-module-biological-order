import { render } from '@testing-library/react';

import BiologicalOrderPatientOrderUiOrderForm from './biological-order-patient-order-ui-order-form';

describe('BiologicalOrderPatientOrderUiOrderForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BiologicalOrderPatientOrderUiOrderForm />);
    expect(baseElement).toBeTruthy();
  });
});
