import { render } from '@testing-library/react';

import PatientSearchForm from './patient-search-form';

describe('PatientSearchForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PatientSearchForm />);
    expect(baseElement).toBeTruthy();
  });
});
