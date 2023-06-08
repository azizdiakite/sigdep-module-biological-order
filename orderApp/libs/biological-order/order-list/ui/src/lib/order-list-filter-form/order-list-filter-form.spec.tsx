import { render } from '@testing-library/react';

import OrderListFilterForm from './order-list-filter-form';

describe('OrderListFilterForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrderListFilterForm />);
    expect(baseElement).toBeTruthy();
  });
});
