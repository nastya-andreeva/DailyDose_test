import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScheduleMealRelation } from '../components/ScheduleMealRelation';
import '@testing-library/jest-dom';


jest.mock('react-native', () => {
  const View = ({ children, style }: any) => <div style={style}>{children}</div>;
  const Text = ({ children, style }: any) => <span style={style}>{children}</span>;
  const TouchableOpacity = ({ children, onPress, style }: any) => (
    <button onClick={onPress} style={style}>{children}</button>
  );
  
  return {
    View,
    Text,
    TouchableOpacity,
    StyleSheet: {
      create: (styles: any) => styles,
    },
  };
});


jest.mock('@/constants/translations', () => ({
  translations: {
    beforeMeal: 'До еды',
    withMeal: 'Во время еды',
    afterMeal: 'После еды',
    noMealRelation: 'Не связано с едой',
  },
}));

describe('ScheduleMealRelation', () => {
  const mockOnMealRelationChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('отображает все варианты связи с приемом пищи', () => {
    render(
      <ScheduleMealRelation
        mealRelation="no_relation"
        onMealRelationChange={mockOnMealRelationChange}
      />
    );

    expect(screen.getByText('До еды')).toBeInTheDocument();
    expect(screen.getByText('Во время еды')).toBeInTheDocument();
    expect(screen.getByText('После еды')).toBeInTheDocument();
    expect(screen.getByText('Не связано с едой')).toBeInTheDocument();
  });

  it('выделяет выбранный вариант', () => {
    render(
      <ScheduleMealRelation
        mealRelation="with_meal"
        onMealRelationChange={mockOnMealRelationChange}
      />
    );

    const selectedButton = screen.getByText('Во время еды').closest('button');
    expect(selectedButton).toHaveStyle({
      backgroundColor: 'colors.primary', 
      borderColor: 'colors.primary',
    });
  });

  it('вызывает onMealRelationChange при выборе варианта', () => {
    render(
      <ScheduleMealRelation
        mealRelation="no_relation"
        onMealRelationChange={mockOnMealRelationChange}
      />
    );

    fireEvent.click(screen.getByText('До еды'));
    expect(mockOnMealRelationChange).toHaveBeenCalledWith('before_meal');

    fireEvent.click(screen.getByText('Во время еды'));
    expect(mockOnMealRelationChange).toHaveBeenCalledWith('with_meal');

    fireEvent.click(screen.getByText('После еды'));
    expect(mockOnMealRelationChange).toHaveBeenCalledWith('after_meal');

    fireEvent.click(screen.getByText('Не связано с едой'));
    expect(mockOnMealRelationChange).toHaveBeenCalledWith('no_relation');
  });

  it('применяет правильные стили к кнопкам', () => {
    render(
      <ScheduleMealRelation
        mealRelation="after_meal"
        onMealRelationChange={mockOnMealRelationChange}
      />
    );

    const selectedButton = screen.getByText('После еды').closest('button');
    const unselectedButton = screen.getByText('До еды').closest('button');

    expect(selectedButton).toHaveStyle({
      backgroundColor: 'colors.primary',
      borderColor: 'colors.primary',
    });
    expect(selectedButton?.querySelector('span')).toHaveStyle({
      color: 'colors.white',
    });

    expect(unselectedButton).toHaveStyle({
      backgroundColor: 'colors.white',
      borderColor: 'colors.border',
    });
    expect(unselectedButton?.querySelector('span')).toHaveStyle({
      color: 'colors.text',
    });
  });
});