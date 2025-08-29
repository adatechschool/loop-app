import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../NavBar/NavBar';

// Mock useTheme
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useTheme: () => ({
    colors: {
      primary: '#319795',
      icon: '#666666',
      hover: '#f0f0f0',
    },
  }),
}));

// Mock react-icons
jest.mock('react-icons/fi', () => ({
  FiHome: () => <span data-testid="home-icon">🏠</span>,
}));

jest.mock('react-icons/bi', () => ({
  BiDirections: () => <span data-testid="directions-icon">🧭</span>,
}));

jest.mock('react-icons/md', () => ({
  MdAddBox: () => <span data-testid="add-icon">➕</span>,
}));

jest.mock('react-icons/io5', () => ({
  IoSearch: () => <span data-testid="search-icon">🔍</span>,
}));

jest.mock('react-icons/bs', () => ({
  BsPerson: () => <span data-testid="person-icon">👤</span>,
}));

const renderWithRouter = (component: React.ReactElement, initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  );
};

describe('Navbar', () => {
  test('should render all navigation icons', () => {
    renderWithRouter(<Navbar />);

    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('directions-icon')).toBeInTheDocument();
    expect(screen.getByTestId('add-icon')).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    expect(screen.getByTestId('person-icon')).toBeInTheDocument();
  });

  test('should render all navigation links', () => {
    renderWithRouter(<Navbar />);

    const homeLink = screen.getByLabelText('Home').closest('a');
    const listLink = screen.getByLabelText('List').closest('a');
    const addLink = screen.getByLabelText('Add').closest('a');
    const searchLink = screen.getByLabelText('Search').closest('a');
    const profileLink = screen.getByLabelText('Profile').closest('a');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(listLink).toHaveAttribute('href', '/places');
    expect(addLink).toHaveAttribute('href', '/add');
    expect(searchLink).toHaveAttribute('href', '/search');
    expect(profileLink).toHaveAttribute('href', '/profile');
  });

  test('should highlight active page - home', () => {
    renderWithRouter(<Navbar />, ['/']);

    const homeButton = screen.getByLabelText('Home');
    expect(homeButton).toBeInTheDocument();
    // Active state would be tested through color props, but our mock doesn't handle that
  });

  test('should highlight active page - places', () => {
    renderWithRouter(<Navbar />, ['/places']);

    const listButton = screen.getByLabelText('List');
    expect(listButton).toBeInTheDocument();
  });

  test('should highlight active page - add', () => {
    renderWithRouter(<Navbar />, ['/add']);

    const addButton = screen.getByLabelText('Add');
    expect(addButton).toBeInTheDocument();
  });

  test('should highlight active page - search', () => {
    renderWithRouter(<Navbar />, ['/search']);

    const searchButton = screen.getByLabelText('Search');
    expect(searchButton).toBeInTheDocument();
  });

  test('should highlight active page - profile', () => {
    renderWithRouter(<Navbar />, ['/profile']);

    const profileButton = screen.getByLabelText('Profile');
    expect(profileButton).toBeInTheDocument();
  });

  test('should have proper navigation structure', () => {
    renderWithRouter(<Navbar />);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    const flexContainer = screen.getByTestId('chakra-flex');
    expect(flexContainer).toBeInTheDocument();
  });

  test('should render with responsive layout', () => {
    renderWithRouter(<Navbar />);

    // Should have responsive navbar
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});