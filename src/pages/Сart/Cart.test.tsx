import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Cart } from './Cart.tsx';

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

describe('render cart', () => {
  beforeEach(() => {
    render(<Cart />);
  });

  test('validates cart text', async () => {
    expect(await screen.findByText('Cart')).toBeInTheDocument();
  });
});
