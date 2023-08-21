import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Main } from './Main.tsx';

describe('Main component', () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      );
    });
  });
  test('renders the main page', () => {
    const mainElement = screen.getByText(/Main page/i);
    expect(mainElement).toBeInTheDocument();
  });

  test('renders the menu items', () => {
    const homeLink = screen.getByText(/Home/i);
    const catalogLink = screen.getByText(/Catalog/i);
    const aboutLink = screen.getByText(/About/i);
    const signInLink = screen.getByText(/Sign In/i);
    const signUpLink = screen.getByText(/Sign Up/i);
    const profileLink = screen.getByText(/Profile/i);

    expect(homeLink).toBeInTheDocument();
    expect(catalogLink).toBeInTheDocument();
    expect(aboutLink).toBeInTheDocument();
    expect(signInLink).toBeInTheDocument();
    expect(signUpLink).toBeInTheDocument();
    expect(profileLink).toBeInTheDocument();
  });
});
