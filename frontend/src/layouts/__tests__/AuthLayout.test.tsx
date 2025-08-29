import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AuthLayout from '../AuthLayout';

describe('AuthLayout', () => {
  test('should render auth content through outlet', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route path="login" element={<div data-testid="login-content">Login Form</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-content')).toBeInTheDocument();
    expect(screen.getByText('Login Form')).toBeInTheDocument();
  });

  test('should have centered layout styles', () => {
    const { container } = render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<div>Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const layoutDiv = container.querySelector('div[style*="display: flex"]');
    expect(layoutDiv).toBeInTheDocument();
    expect(layoutDiv).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    });
  });

  test('should render different auth pages through outlet', () => {
    render(
      <MemoryRouter initialEntries={['/signup']}>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route path="signup" element={<div data-testid="signup-content">Signup Form</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('signup-content')).toBeInTheDocument();
    expect(screen.getByText('Signup Form')).toBeInTheDocument();
  });

  test('should provide consistent layout for all auth pages', () => {
    const TestComponent = () => (
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<div data-testid="auth-form">Auth Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const { container } = render(<TestComponent />);

    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
    
    const layoutContainer = container.querySelector('div[style*="height: 100vh"]');
    expect(layoutContainer).toBeInTheDocument();
  });
});