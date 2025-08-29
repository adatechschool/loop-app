import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../MainLayout';

// Mock Navbar
jest.mock('../../components', () => ({
  Navbar: () => (
    <nav data-testid="navbar">
      <div>Navigation Bar</div>
    </nav>
  ),
}));

describe('MainLayout', () => {
  test('should render navbar and outlet', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<div data-testid="page-content">Page Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText('Navigation Bar')).toBeInTheDocument();
    expect(screen.getByTestId('page-content')).toBeInTheDocument();
    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });

  test('should render different page content through outlet', () => {
    render(
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="test" element={<div data-testid="test-content">Test Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test Page')).toBeInTheDocument();
  });

  test('should always render navbar regardless of route', () => {
    render(
      <MemoryRouter initialEntries={['/any-route']}>
        <Routes>
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });
});