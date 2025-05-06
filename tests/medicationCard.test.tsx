import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MedicationCard } from '../components/MedicationCard';
import '@testing-library/jest-dom';
import type { DailyMedicationWithStatus } from '@/types';

// Мокаем зависимости
jest.mock('react-native', () => {
  const View = ({ children, style }: any) => <div style={style}>{children}</div>;
  const Text = ({ children, style }: any) => <span style={style}>{children}</span>;
  const TouchableOpacity = ({ children, onPress, style }: any) => (
    <button onClick={onPress} style={style}>{children}</button>
  );
  const Modal = ({ children, visible }: any) => (
    visible ? <div data-testid="modal">{children}</div> : null
  );
  
  return {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet: {
      create: (styles: any) => styles,
    },
  };
});

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/components/MedicationIcon', () => ({
  MedicationIcon: () => <div>MedicationIcon</div>,
}));

jest.mock('@/components/Button', () => ({
  Button: ({ title, onPress, disabled }: any) => (
    <button onClick={onPress} disabled={disabled}>{title}</button>
  ),
}));

jest.mock('lucide-react-native', () => ({
  Check: () => <span>CheckIcon</span>,
  X: () => <span>XIcon</span>,
  Clock: () => <span>ClockIcon</span>,
  AlertCircle: () => <span>AlertCircleIcon</span>,
}));

jest.mock('@/utils/date-utils', () => ({
  formatTime: (time: string) => `Formatted: ${time}`,
  getMealRelationText: (relation: string) => `Meal: ${relation}`,
}));

jest.mock('@/constants/medication', () => ({
  getUnitDisplayFromRaw: (unit: string, count: number) => `${unit}${count > 1 ? 's' : ''}`,
}));

jest.mock('@/constants/translations', () => ({
  translations: {
    take: 'Принять',
    skip: 'Пропустить',
    close: 'Закрыть',
    instructions: 'Инструкции',
  },
}));

describe('MedicationCard', () => {
    const mockMedication: DailyMedicationWithStatus = {
        id: 'med1', // Уникальный идентификатор
        scheduleId: 'schedule1', // Идентификатор расписания
        medicationId: 'medication1', // Идентификатор лекарства
        name: 'Аспирин',
        dosagePerUnit: '1', // Дозировка на единицу
        dosageByTime: '1', // Дозировка на время
        unit: 'таблетка',
        instructions: 'Принимать с водой',
        time: '08:00', // Время, когда нужно принять лекарство
        mealRelation: 'before_meal', // Связь с приемом пищи
        status: 'pending', // Статус лекарства
        iconName: 'Pill', // Иконка лекарства
        iconColor: '#0000FF', // Цвет иконки
        takenAt: undefined, // Если еще не принято, то можно оставить undefined
      };
      
      

  const mockHandlers = {
    onMarkTaken: jest.fn(),
    onMarkMissed: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('отображает карточку лекарства с основной информацией', () => {
    render(
      <MedicationCard 
        selectedDate={new Date()} 
        medication={mockMedication} 
        status="pending"
        {...mockHandlers} 
      />
    );

    expect(screen.getByText('Аспирин')).toBeInTheDocument();
    expect(screen.getByText('Meal: before_meal, 1 таблетка')).toBeInTheDocument();
    expect(screen.getByText('MedicationIcon')).toBeInTheDocument();
  });

  it('открывает модальное окно при нажатии на карточку', () => {
    render(
      <MedicationCard 
        selectedDate={new Date()} 
        medication={mockMedication} 
        status="pending"
        {...mockHandlers} 
      />
    );

    fireEvent.click(screen.getByText('Аспирин'));
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('отображает инструкции в модальном окне', () => {
    render(
      <MedicationCard 
        selectedDate={new Date()} 
        medication={mockMedication} 
        status="pending"
        {...mockHandlers} 
      />
    );

    fireEvent.click(screen.getByText('Аспирин'));
    expect(screen.getByText('Инструкции')).toBeInTheDocument();
    expect(screen.getByText('Принимать с водой')).toBeInTheDocument();
  });

  it('вызывает onMarkTaken при нажатии кнопки "Принять"', () => {
    render(
      <MedicationCard 
        selectedDate={new Date()} 
        medication={mockMedication} 
        status="pending"
        {...mockHandlers} 
      />
    );

    fireEvent.click(screen.getByText('Аспирин'));
    fireEvent.click(screen.getByText('Принять'));
    expect(mockHandlers.onMarkTaken).toHaveBeenCalledWith('08:00', '1', 'таблетка');
  });

  it('вызывает onMarkMissed при нажатии кнопки "Пропустить"', () => {
    render(
      <MedicationCard 
        selectedDate={new Date()} 
        medication={mockMedication} 
        status="pending"
        {...mockHandlers} 
      />
    );

    fireEvent.click(screen.getByText('Аспирин'));
    fireEvent.click(screen.getByText('Пропустить'));
    expect(mockHandlers.onMarkMissed).toHaveBeenCalledWith('08:00', '1', 'таблетка');
  });

  it('отображает отформатированное время в модальном окне', () => {
    render(
      <MedicationCard 
        selectedDate={new Date()} 
        medication={mockMedication} 
        status="pending"
        {...mockHandlers} 
      />
    );

    fireEvent.click(screen.getByText('Аспирин'));
    expect(screen.getByText('Formatted: 08:00')).toBeInTheDocument();
  });

  it('блокирует кнопки действий, если время приема еще не наступило', () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1);
    
    render(
      <MedicationCard 
        selectedDate={futureDate} 
        medication={{...mockMedication, time: '23:59'}} 
        status="pending"
        {...mockHandlers} 
      />
    );

    fireEvent.click(screen.getByText('Аспирин'));
    expect(screen.getByText('Принять')).toBeDisabled();
    expect(screen.getByText('Пропустить')).toBeDisabled();
  });
});