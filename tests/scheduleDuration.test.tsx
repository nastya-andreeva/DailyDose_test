import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScheduleDuration } from '../components/ScheduleDuration';
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

jest.mock('@/components/Input', () => ({
  Input: ({ value, onChangeText, placeholder }: any) => (
    <input
      value={value}
      onChange={(e) => onChangeText(e.target.value)}
      placeholder={placeholder}
      data-testid="duration-input"
    />
  ),
}));

jest.mock('@/components/DatePicker', () => ({
  DatePicker: ({ onSelect, onCancel }: any) => (
    <div data-testid="date-picker">
      <button onClick={() => onSelect('2023-01-01')}>Select Date</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

jest.mock('lucide-react-native', () => ({
  Calendar: () => <span>CalendarIcon</span>,
}));

jest.mock('@/constants/translations', () => ({
  translations: {
    specifyDuration: 'Указать длительность',
    specifyEndDate: 'Указать дату окончания',
    startDate: 'Дата начала',
    endDate: 'Дата окончания',
    durationDays: 'Длительность (дни)',
    selectDate: 'Выбрать дату',
    enterDays: 'Введите дни',
  },
}));

describe('ScheduleDuration', () => {
  const mockHandlers = {
    onStartDateChange: jest.fn(),
    onEndDateChange: jest.fn(),
    onDurationDaysChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('отображает компонент с вариантами выбора длительности', () => {
    render(
      <ScheduleDuration
        startDate="2023-01-01"
        durationDays={7}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Указать длительность')).toBeInTheDocument();
    expect(screen.getByText('Указать дату окончания')).toBeInTheDocument();
    expect(screen.getByText('Дата начала')).toBeInTheDocument();
    expect(screen.getByDisplayValue('7')).toBeInTheDocument();
  });

  it('переключается между режимами длительности и даты окончания', () => {
    render(
      <ScheduleDuration
        startDate="2023-01-01"
        durationDays={7}
        {...mockHandlers}
      />
    );


    expect(screen.getByDisplayValue('7')).toBeInTheDocument();


    fireEvent.click(screen.getByText('Указать дату окончания'));
    expect(screen.queryByDisplayValue('7')).not.toBeInTheDocument();
    expect(screen.getByText('Выбрать дату')).toBeInTheDocument();
  });

  it('открывает DatePicker при нажатии на кнопку выбора даты', () => {
    render(
      <ScheduleDuration
        startDate="2023-01-01"
        durationDays={7}
        {...mockHandlers}
      />
    );

    fireEvent.click(screen.getByText('2023-01-01'));
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
  });

  it('обрабатывает изменение длительности через Input', () => {
    render(
      <ScheduleDuration
        startDate="2023-01-01"
        durationDays={7}
        {...mockHandlers}
      />
    );

    const input = screen.getByTestId('duration-input');
    fireEvent.change(input, { target: { value: '14' } });
    expect(mockHandlers.onDurationDaysChange).toHaveBeenCalledWith(14);
  });

  it('синхронизирует дату окончания при изменении длительности', () => {
    render(
      <ScheduleDuration
        startDate="2023-01-01"
        durationDays={7}
        {...mockHandlers}
      />
    );

    const input = screen.getByTestId('duration-input');
    fireEvent.change(input, { target: { value: '14' } });
    
    expect(mockHandlers.onDurationDaysChange).toHaveBeenCalledWith(14);
    expect(mockHandlers.onEndDateChange).toHaveBeenCalledWith('2023-01-14');
  });

  it('синхронизирует длительность при изменении даты окончания', () => {
    render(
      <ScheduleDuration
        startDate="2023-01-01"
        endDate="2023-01-07"
        durationDays={7}
        {...mockHandlers}
      />
    );


    fireEvent.click(screen.getByText('Указать дату окончания'));
    

    fireEvent.click(screen.getByText('2023-01-07'));
    fireEvent.click(screen.getByText('Select Date'));
    
    expect(mockHandlers.onEndDateChange).toHaveBeenCalledWith('2023-01-01');
    expect(mockHandlers.onDurationDaysChange).toHaveBeenCalledWith(1);
  });
});