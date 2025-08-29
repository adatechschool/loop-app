import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock ChakraProvider for testing
const MockChakraProvider = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="chakra-provider">{children}</div>
);

// Test providers wrapper
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <MockChakraProvider>
        {children}
      </MockChakraProvider>
    </BrowserRouter>
  );
};

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: TestWrapper, ...options });

export * from '@testing-library/react';
export { customRender as render };