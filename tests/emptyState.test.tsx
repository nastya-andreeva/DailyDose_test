import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from '../components/EmptyState';
import '@testing-library/jest-dom';

// Мокаем зависимости
jest.mock('react-native', () => {
  const View = ({ children, style, testID }: any) => (
    <div style={style} data-testid={testID}>{children}</div>
  );
  const Text = ({ children, style, testID }: any) => (
    <span style={style} data-testid={testID}>{children}</span>
  );
  
  return {
    View,
    Text,
    StyleSheet: {
      create: (styles: any) => styles,
    },
  };
});

jest.mock('@/constants/colors', () => ({
  colors: {
    lightGray: '#F5F5F5',
    text: '#212121',
    textSecondary: '#757575',
  },
}));

jest.mock('@/components/Button', () => ({
  Button: ({ title, onPress, style }: any) => (
    <button 
      onClick={onPress} 
      style={style}
      data-testid="empty-state-button"
    >
      {title}
    </button>
  ),
}));

describe('EmptyState', () => {
  const mockIcon = <span data-testid="test-icon">Icon</span>;
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('отображает иконку, заголовок и описание', () => {
    render(
      <EmptyState
        icon={mockIcon}
        title="Тестовый заголовок"
        description="Тестовое описание"
      />
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('Тестовый заголовок')).toBeInTheDocument();
    expect(screen.getByText('Тестовое описание')).toBeInTheDocument();
  });

  it('не отображает кнопку, когда buttonTitle или onButtonPress не переданы', () => {
    render(
      <EmptyState
        icon={mockIcon}
        title="Тестовый заголовок"
        description="Тестовое описание"
      />
    );

    expect(screen.queryByTestId('empty-state-button')).not.toBeInTheDocument();
  });

  it('отображает кнопку, когда переданы buttonTitle и onButtonPress', () => {
    render(
      <EmptyState
        icon={mockIcon}
        title="Тестовый заголовок"
        description="Тестовое описание"
        buttonTitle="Тестовая кнопка"
        onButtonPress={mockOnPress}
      />
    );

    const button = screen.getByTestId('empty-state-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Тестовая кнопка');
  });

  it('вызывает onButtonPress при нажатии на кнопку', () => {
    render(
      <EmptyState
        icon={mockIcon}
        title="Тестовый заголовок"
        description="Тестовое описание"
        buttonTitle="Тестовая кнопка"
        onButtonPress={mockOnPress}
      />
    );

    fireEvent.click(screen.getByTestId('empty-state-button'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('применяет стили к контейнеру иконки', () => {
    render(
      <EmptyState
        icon={mockIcon}
        title="Тестовый заголовок"
        description="Тестовое описание"
      />
    );

    const iconContainer = screen.getByTestId('test-icon').parentElement;
    expect(iconContainer).toHaveStyle({
      width: '80px',
      height: '80px',
      borderRadius: '40px',
      backgroundColor: '#F5F5F5',
      marginBottom: '24px',
    });
  });

  it('применяет стили к заголовку и описанию', () => {
    render(
      <EmptyState
        icon={mockIcon}
        title="Тестовый заголовок"
        description="Тестовое описание"
      />
    );

    const title = screen.getByText('Тестовый заголовок');
    const description = screen.getByText('Тестовое описание');

    expect(title).toHaveStyle({
      fontSize: '20px',
      fontWeight: '600',
      color: '#212121',
      marginBottom: '8px',
    });

    expect(description).toHaveStyle({
      fontSize: '16px',
      color: '#757575',
      marginBottom: '24px',
    });
  });
});