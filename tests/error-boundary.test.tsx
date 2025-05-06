import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../app/error-boundary';
import '@testing-library/jest-dom';


jest.mock('react-native', () => {
  const View = ({ children, style, testID }: { 
    children: React.ReactNode; 
    style?: any;
    testID?: string;
  }) => (
    <div style={style} data-testid={testID}>{children}</div>
  );
  
  const Text = ({ children, style }: { 
    children: React.ReactNode; 
    style?: any;
  }) => (
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

describe('ErrorBoundary', () => {
  const originalConsoleError = console.error;
  
  beforeEach(() => {
    console.error = jest.fn(); 
  });
  
  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('рендерит детей, когда нет ошибок', () => {
    const { container } = render(
      <ErrorBoundary>
        <div>Дочерний компонент</div>
      </ErrorBoundary>
    );
    
    expect(container).toContainHTML('<div>Дочерний компонент</div>');
  });

  it('отображает fallback UI при возникновении ошибки', () => {
    const ErrorComponent = () => {
      throw new Error('Тестовая ошибка');
    };
    
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Что-то пошло не так')).toBeInTheDocument();
    expect(screen.getByText('Тестовая ошибка')).toBeInTheDocument();
  });

  it('вызывает onError при возникновении ошибки', () => {
    const mockOnError = jest.fn();
    const ErrorComponent = () => {
      throw new Error('Тестовая ошибка');
    };
    
    render(
      <ErrorBoundary onError={mockOnError}>
        <ErrorComponent />
      </ErrorBoundary>
    );
    
    expect(mockOnError).toHaveBeenCalled();
    expect(mockOnError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(mockOnError.mock.calls[0][0].message).toBe('Тестовая ошибка');
  });

  it('применяет корректные стили при ошибке', () => {
    const ErrorComponent = () => {
      throw new Error('Тестовая ошибка');
    };
    
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );
    
    const title = screen.getByText('Что-то пошло не так');
    expect(title).toHaveStyle({
      fontSize: '36px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '8px',
    });
    
    const subtitle = screen.getByText('Тестовая ошибка');
    expect(subtitle).toHaveStyle({
      fontSize: '14px',
      color: '#666',
      textAlign: 'center',
      marginBottom: '12px',
    });
  });
});