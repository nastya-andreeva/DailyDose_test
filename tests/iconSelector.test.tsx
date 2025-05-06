import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IconSelector } from '../components/IconSelector';
import '@testing-library/jest-dom';

// Упрощенный мок для react-native
jest.mock('react-native', () => {
  return {
    View: ({ children, style }: any) => <div style={style}>{children}</div>,
    Text: ({ children, style }: any) => <span style={style}>{children}</span>,
    TouchableOpacity: ({ children, onPress, style }: any) => (
      <button onClick={onPress} style={style}>{children}</button>
    ),
    StyleSheet: {
      create: (styles: any) => styles,
    },
  };
});

jest.mock('@/constants/colors', () => ({
  colors: {
    iconGreen: '#4CAF50',
    iconBlue: '#2196F3',
    iconRed: '#F44336',
    iconPurple: '#9C27B0',
    iconOrange: '#FF9800',
    iconPink: '#E91E63',
    iconTeal: '#009688',
    white: '#FFFFFF',
    lightGray: '#F5F5F5',
    text: '#212121',
  },
}));

jest.mock('@/constants/translations', () => ({
  translations: {
    selectIcon: 'Выберите иконку',
    andColor: 'и цвет',
    iconColor: 'Цвет иконки',
  },
}));

jest.mock('@/components/MedicationIcon', () => ({
  MedicationIcon: ({ iconName }: any) => <span>{iconName}Icon</span>,
}));

describe('IconSelector', () => {
  const mockOnSelectIcon = jest.fn();
  const mockOnSelectColor = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('отображает компонент с вариантом "add"', () => {
    render(
      <IconSelector
        selectedIcon="Pill"
        selectedColor="#4CAF50"
        onSelectIcon={mockOnSelectIcon}
        onSelectColor={mockOnSelectColor}
        variant="add"
      />
    );

    expect(screen.getByText('и цвет')).toBeInTheDocument();
    expect(screen.getByText('PillIcon')).toBeInTheDocument();
  });

  it('отображает компонент с вариантом "edit"', () => {
    render(
      <IconSelector
        selectedIcon="Heart"
        selectedColor="#2196F3"
        onSelectIcon={mockOnSelectIcon}
        onSelectColor={mockOnSelectColor}
        variant="edit"
      />
    );

    expect(screen.getByText('Выберите иконку')).toBeInTheDocument();
    expect(screen.getByText('Цвет иконки')).toBeInTheDocument();
  });

  it('вызывает onSelectIcon при выборе иконки', () => {
    render(
      <IconSelector
        selectedIcon="Pill"
        selectedColor="#4CAF50"
        onSelectIcon={mockOnSelectIcon}
        onSelectColor={mockOnSelectColor}
        variant="add"
      />
    );

    const iconButtons = screen.getAllByRole('button')
      .filter(button => button.textContent?.includes('Icon'));
    
    fireEvent.click(iconButtons[1]);
    expect(mockOnSelectIcon).toHaveBeenCalledWith('Heart');
  });

  it('вызывает onSelectColor при выборе цвета', () => {
    render(
      <IconSelector
        selectedIcon="Pill"
        selectedColor="#4CAF50"
        onSelectIcon={mockOnSelectIcon}
        onSelectColor={mockOnSelectColor}
        variant="add"
      />
    );

    const colorButtons = screen.getAllByRole('button')
      .filter(button => !button.textContent);
    
    fireEvent.click(colorButtons[1]);
    expect(mockOnSelectColor).toHaveBeenCalled();
  });

  it('отображает выбранную иконку', () => {
    render(
      <IconSelector
        selectedIcon="Pill"
        selectedColor="#4CAF50"
        onSelectIcon={mockOnSelectIcon}
        onSelectColor={mockOnSelectColor}
        variant="add"
      />
    );

    expect(screen.getByText('PillIcon')).toBeInTheDocument();
  });

  it('отображает кнопки выбора цвета', () => {
    render(
      <IconSelector
        selectedIcon="Pill"
        selectedColor="#4CAF50"
        onSelectIcon={mockOnSelectIcon}
        onSelectColor={mockOnSelectColor}
        variant="add"
      />
    );

    const colorButtons = screen.getAllByRole('button')
      .filter(button => !button.textContent);
    expect(colorButtons.length).toBeGreaterThan(0);
  });
});