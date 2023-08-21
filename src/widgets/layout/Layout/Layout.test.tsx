import { render, screen } from '@testing-library/react';
import { Layout } from './Layout.tsx';
import '@testing-library/jest-dom';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    writable: true,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('render page layout', () => {
  beforeEach(() => {
    render(<Layout />);
  });

  test('validates footer text', async () => {
    expect(await screen.findByText('Footer')).toBeInTheDocument();
  });

  test('renders layout component', () => {
    render(<Layout />);
  });
});
