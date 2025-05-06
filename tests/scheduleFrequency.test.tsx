import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScheduleFrequency } from '../components/ScheduleFrequency'; 
import '@testing-library/jest-dom';

jest.mock('react-native', () => {
    const View = ({ children, style }: any) => <div style={style}>{children}</div>;
    const Text = ({ children, style }: any) => <span style={style}>{children}</span>;
    const TouchableOpacity = ({ children, onPress, style }: any) => (
      <button onClick={onPress} style={style}>{children}</button>
    );

    const ScrollView = ({ children }: any) => <div>{children}</div>;
  
    return {
      View,
      Text,
      TouchableOpacity,
      ScrollView,
      StyleSheet: {
        create: (styles: any) => styles,
      },
    };
});
  

jest.mock('lucide-react-native', () => ({
  Calendar: () => <div>Mocked Calendar</div>,
}));

jest.mock('@/constants/translations', () => ({
  translations: {
    daily: 'Ежедневно',
    everyOtherDay: 'Каждые два дня',
    specificDays: 'Конкретные дни',
    specificDates: 'Конкретные даты',
    addDate: 'Добавить дату',
    mon: 'Пон',
    tue: 'Втор',
    wed: 'Ср',
    thu: 'Чет',
    fri: 'Пят',
    sat: 'Суб',
    sun: 'Вос',
  },
}));

describe('ScheduleFrequency', () => {
  const mockOnFrequencyChange = jest.fn();
  const mockOnDaysChange = jest.fn();
  const mockOnDatesChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('отображает все варианты частоты', () => {
    render(
      <ScheduleFrequency
        frequency="daily"
        days={[]}
        dates={[]}
        onFrequencyChange={mockOnFrequencyChange}
        onDaysChange={mockOnDaysChange}
        onDatesChange={mockOnDatesChange}
      />
    );

    expect(screen.getByText('Ежедневно')).toBeInTheDocument();
    expect(screen.getByText('Каждые два дня')).toBeInTheDocument();
    expect(screen.getByText('Конкретные дни')).toBeInTheDocument();
    expect(screen.getByText('Конкретные даты')).toBeInTheDocument();
  });

  it('выделяет выбранный вариант частоты', () => {
    render(
      <ScheduleFrequency
        frequency="specific_days"
        days={[]}
        dates={[]}
        onFrequencyChange={mockOnFrequencyChange}
        onDaysChange={mockOnDaysChange}
        onDatesChange={mockOnDatesChange}
      />
    );

    const selectedButton = screen.getByText('Конкретные дни').closest('button');
    expect(selectedButton).toHaveStyle({
      backgroundColor: 'colors.primary', 
      borderColor: 'colors.primary',
    });
  });

  it('вызывает onFrequencyChange при выборе варианта частоты', () => {
    render(
      <ScheduleFrequency
        frequency="daily"
        days={[]}
        dates={[]}
        onFrequencyChange={mockOnFrequencyChange}
        onDaysChange={mockOnDaysChange}
        onDatesChange={mockOnDatesChange}
      />
    );

    fireEvent.click(screen.getByText('Ежедневно'));
    expect(mockOnFrequencyChange).toHaveBeenCalledWith('daily');

    fireEvent.click(screen.getByText('Каждые два дня'));
    expect(mockOnFrequencyChange).toHaveBeenCalledWith('every_other_day');

    fireEvent.click(screen.getByText('Конкретные дни'));
    expect(mockOnFrequencyChange).toHaveBeenCalledWith('specific_days');

    fireEvent.click(screen.getByText('Конкретные даты'));
    expect(mockOnFrequencyChange).toHaveBeenCalledWith('specific_dates');
  });

  it('отображает кнопки дней при выбранной частоте "Конкретные дни"', () => {
    render(
      <ScheduleFrequency
        frequency="specific_days"
        days={[1, 3, 5]}
        dates={[]}
        onFrequencyChange={mockOnFrequencyChange}
        onDaysChange={mockOnDaysChange}
        onDatesChange={mockOnDatesChange}
      />
    );

    expect(screen.getByText('Пон')).toHaveStyle({ backgroundColor: 'colors.primary' });
    expect(screen.getByText('Ср')).toHaveStyle({ backgroundColor: 'colors.primary' });
    expect(screen.getByText('Пят')).toHaveStyle({ backgroundColor: 'colors.primary' });
  });

});
