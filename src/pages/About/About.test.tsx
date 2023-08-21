import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { About } from './About.tsx';

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

describe('render about', () => {
  beforeEach(() => {
    render(<About />);
  });

  test('validates about text', async () => {
    expect(await screen.findByText('About')).toBeInTheDocument();
  });
});
