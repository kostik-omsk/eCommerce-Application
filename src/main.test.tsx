import { render } from '@testing-library/react';
import App from './app/App.tsx';
import '@testing-library/jest-dom';
import './main.tsx';

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

describe('render app', () => {
  test('renders App component', () => {
    render(<App />);
  });
});
