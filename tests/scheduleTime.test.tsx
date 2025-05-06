import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScheduleTimes } from '../components/ScheduleTime';
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
    Platform: {
      OS: 'android',
    },
    ActionSheetIOS: {
      showActionSheetWithOptions: jest.fn(),
    },
  };
});

jest.mock('@react-native-picker/picker', () => {
    const React = require('react');
    const Picker = ({ children, selectedValue, onValueChange }: any) => (
      <select value={selectedValue} onChange={(e) => onValueChange(e.target.value)}>
        {children}
      </select>
    );
    Picker.Item = ({ label, value }: any) => <option value={value}>{label}</option>;
  
    return { Picker };
  });

jest.mock('lucide-react-native', () => ({
  Clock: () => <span>ClockIcon</span>,
  Trash2: () => <span>TrashIcon</span>,
  Plus: () => <span>PlusIcon</span>,
  ChevronDown: () => <span>ChevronDownIcon</span>,
}));

jest.mock('@/components/Input', () => ({
  Input: ({ value, onChangeText, placeholder }: any) => (
    <input
      value={value}
      onChange={(e) => onChangeText(e.target.value)}
      placeholder={placeholder}
    />
  ),
}));

describe('ScheduleTimes', () => {
  const mockTimes = [
    { time: '08:00', dosage: '1', unit: 'таблетка' },
    { time: '20:00', dosage: '2', unit: 'таблетки' },
  ];

  const mockHandlers = {
    onTimeChange: jest.fn(),
    onDosageChange: jest.fn(),
    onUnitChange: jest.fn(),
    onAddTime: jest.fn(),
    onRemoveTime: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('отображает список времени приема', () => {
    render(
      <ScheduleTimes
        times={mockTimes}
        medicationForm="tablet"
        isRemovable
        {...mockHandlers}
      />
    );

    expect(screen.getAllByDisplayValue(/^\d{2}:\d{2}$/)).toHaveLength(2);
    expect(screen.getByText('Прием 1:')).toBeInTheDocument();
    expect(screen.getByText('Прием 2:')).toBeInTheDocument();
  });

  it('позволяет изменять время приема и передает отформатированное значение', () => {
    render(
      <ScheduleTimes
        times={mockTimes}
        medicationForm="tablet"
        isRemovable
        {...mockHandlers}
      />
    );

    const input = screen.getByDisplayValue('08:00');
    fireEvent.change(input, { target: { value: '0915' } });
    expect(mockHandlers.onTimeChange).toHaveBeenCalledWith(0, '09:15');
  });

  it('позволяет изменять дозировку и передает новое значение', () => {
    render(
      <ScheduleTimes
        times={mockTimes}
        medicationForm="tablet"
        isRemovable
        {...mockHandlers}
      />
    );

    const dosageInput = screen.getByDisplayValue('1');
    fireEvent.change(dosageInput, { target: { value: '2.5' } });
    expect(mockHandlers.onDosageChange).toHaveBeenCalledWith(0, '2.5');
  });

  it('позволяет изменять единицы измерения (Android)', () => {
    render(
      <ScheduleTimes
        times={mockTimes}
        medicationForm="tablet"
        isRemovable
        {...mockHandlers}
      />
    );

    const picker = screen.getAllByRole('combobox')[0];
    fireEvent.change(picker, { target: { value: 'мг' } });
    expect(mockHandlers.onUnitChange).toHaveBeenCalledWith(0, 'мг');
  });

  it('позволяет изменять единицы измерения (iOS)', () => {
    require('react-native').Platform.OS = 'ios';
    const { ActionSheetIOS } = require('react-native');

    render(
      <ScheduleTimes
        times={mockTimes}
        medicationForm="tablet"
        isRemovable
        {...mockHandlers}
      />
    );

    const iosPickerButton = screen.getAllByText('таблетка')[0];
    fireEvent.click(iosPickerButton);

    const callback = ActionSheetIOS.showActionSheetWithOptions.mock.calls[0][1];
    callback(1); 

    expect(mockHandlers.onUnitChange).toHaveBeenCalledWith(0, 'мг');
  });

  it('позволяет удалять время приема по индексу', () => {
    render(
      <ScheduleTimes
        times={mockTimes}
        medicationForm="tablet"
        isRemovable
        {...mockHandlers}
      />
    );

    const deleteButtons = screen.getAllByText('TrashIcon');
    expect(deleteButtons).toHaveLength(2);

    fireEvent.click(deleteButtons[1]);
    expect(mockHandlers.onRemoveTime).toHaveBeenCalledWith(1);
  });

  it('позволяет добавлять новое время приема', () => {
    render(
      <ScheduleTimes
        times={mockTimes}
        medicationForm="tablet"
        isRemovable
        {...mockHandlers}
      />
    );

    const addBtn = screen.getByText('Добавить прием');
    fireEvent.click(addBtn);
    expect(mockHandlers.onAddTime).toHaveBeenCalledTimes(1);
  });

  it('отображает ошибки валидации корректно', () => {
    const errors = {
      time: ['Неверное время', ''],
    };

    render(
      <ScheduleTimes
        times={mockTimes}
        medicationForm="tablet"
        isRemovable
        errors={errors}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Неверное время')).toBeInTheDocument();
  });
});
