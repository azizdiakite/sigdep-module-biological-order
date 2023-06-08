import { render } from '@testing-library/react';

import OrderListTable from './order-list-table';

describe('OrderListTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrderListTable />);
    expect(baseElement).toBeTruthy();
  });
});
