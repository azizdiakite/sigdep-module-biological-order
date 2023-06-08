import { render } from '@testing-library/react';

import PatientOrderListTable from './patient-order-list-table';

describe('PatientOrderListTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PatientOrderListTable orders={[]} />);
    expect(baseElement).toBeTruthy();
  });
});
