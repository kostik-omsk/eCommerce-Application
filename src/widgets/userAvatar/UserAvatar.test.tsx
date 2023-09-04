import { render, screen } from '@testing-library/react';
import { UserAvatar } from './UserAvatar.tsx';
import '@testing-library/jest-dom/extend-expect';

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

test('renders UserAvatar component', () => {
  const username = 'test';
  const isopen = false;
  render(<UserAvatar username={username} isopen={isopen} />);
  const userAvatarElement = screen.getByText(username);
  expect(userAvatarElement).toBeInTheDocument();
});

test('renders UserAvatar component with correct size', () => {
  const shortUsername = 'short';
  const isOpen = false;

  render(<UserAvatar username={shortUsername} isopen={isOpen} />);
  const shortAvatarElement = screen.getByText(shortUsername);
  expect(shortAvatarElement).toHaveClass('ant-avatar-string');
});
