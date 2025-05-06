import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFoundScreen from '../app/+not-found';
import '@testing-library/jest-dom';
import { Link } from 'expo-router';


jest.mock('react-native', () => {
  const View = ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <div style={style}>{children}</div>
  );
  const Text = ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <span style={style}>{children}</span>
  );
  
  return {
    View,
    Text,
    StyleSheet: {
      create: (styles: any) => styles,
    },
  };
});


jest.mock('expo-router', () => ({
  Link: ({ children, href, style }: { 
    children: React.ReactNode; 
    href: string;
    style?: any;
  }) => (
    <a href={href} style={style}>{children}</a>
  ),
  Stack: {
    Screen: ({ options }: { options: any }) => (
      <div data-testid="stack-screen">{JSON.stringify(options)}</div>
    ),
  },
}));

describe('NotFoundScreen', () => {
  it('отображает заголовок "Oops!" в Stack.Screen', () => {
    render(<NotFoundScreen />);
    const stackScreen = screen.getByTestId('stack-screen');
    expect(stackScreen).toHaveTextContent('"title":"Oops!"');
  });

  it('отображает основное сообщение об ошибке', () => {
    render(<NotFoundScreen />);
    expect(screen.getByText('This screen doesn\'t exist.')).toBeInTheDocument();
  });

  it('отображает ссылку для перехода на главный экран', () => {
    render(<NotFoundScreen />);
    const link = screen.getByText('Go to home screen!');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/');
  });

  it('применяет стили из StyleSheet', () => {
    render(<NotFoundScreen />);
    
    const container = screen.getByText('This screen doesn\'t exist.').parentElement;
    expect(container).toHaveStyle({
      flex: '1',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    });

    const title = screen.getByText('This screen doesn\'t exist.');
    expect(title).toHaveStyle({
      fontSize: '20px',
      fontWeight: 'bold',
    });

    const linkText = screen.getByText('Go to home screen!');
    expect(linkText).toHaveStyle({
      fontSize: '14px',
      color: '#2e78b7',
    });
  });
});