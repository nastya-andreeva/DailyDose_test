import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/Button';
import '@testing-library/jest-dom';

// Мокаем зависимости
jest.mock('react-native', () => {
  const TouchableOpacity = ({ children, onPress, style, disabled, testID }: any) => (
    <button 
      onClick={!disabled ? onPress : undefined} 
      style={style}
      data-testid={testID}
      data-disabled={disabled}
    >
      {children}
    </button>
  );
  const Text = ({ children, style }: any) => (
    <span style={style}>{children}</span>
  );
  const ActivityIndicator = ({ color }: any) => (
    <span style={{ color }} data-testid="activity-indicator">Loading...</span>
  );
  const View = ({ children, style }: any) => (
    <div style={style}>{children}</div>
  );
  
  return {
    TouchableOpacity,
    Text,
    ActivityIndicator,
    View,
    StyleSheet: {
      create: (styles: any) => styles,
    },
  };
});

jest.mock('@/constants/colors', () => ({
  colors: {
    primary: '#6200EE',
    secondary: '#03DAC6',
    white: '#FFFFFF',
    lightGray: '#F5F5F5',
    darkGray: '#757575',
  },
}));

describe('Button', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('отображает кнопку с текстом', () => {
    render(<Button title="Тестовая кнопка" onPress={mockOnPress} />);
    
    expect(screen.getByText('Тестовая кнопка')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('вызывает onPress при клике', () => {
    render(<Button title="Нажми меня" onPress={mockOnPress} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('не вызывает onPress, когда disabled=true', () => {
    render(<Button title="Неактивная" onPress={mockOnPress} disabled={true} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockOnPress).not.toHaveBeenCalled();
    expect(button).toHaveAttribute('data-disabled', 'true');
  });

  it('отображает индикатор загрузки, когда loading=true', () => {
    render(<Button title="Загрузка" onPress={mockOnPress} loading={true} />);
    
    expect(screen.getByTestId('activity-indicator')).toBeInTheDocument();
    expect(screen.queryByText('Загрузка')).not.toBeInTheDocument();
  });

  it('отображает иконку, когда она передана', () => {
    const icon = <span data-testid="test-icon">Icon</span>;
    render(<Button title="С иконкой" onPress={mockOnPress} icon={icon} />);
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('С иконкой')).toBeInTheDocument();
  });

});