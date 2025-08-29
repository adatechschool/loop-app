import React from 'react';
import { render, screen } from '@testing-library/react';

// Very simple test to validate Jest setup
test('Jest setup works correctly', () => {
  render(<div data-testid="simple-test">Hello World</div>);
  expect(screen.getByTestId('simple-test')).toBeInTheDocument();
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});
