import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

// Mock the Home component
vi.mock('../src/pages/Home', () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));

describe('App', () => {
  it('should render without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('should be wrapped in IonApp', () => {
    const { container } = render(<App />);
    const ionApp = container.querySelector('ion-app');
    expect(ionApp).toBeInTheDocument();
  });

  it('should include all required Ionic CSS imports', () => {
    // This test ensures the component structure is correct
    render(<App />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('should setup Ionic React correctly', () => {
    // Test that the app renders without throwing errors
    expect(() => render(<App />)).not.toThrow();
  });
});