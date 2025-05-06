import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MedicationInventoryCard } from '../components/MedicationInventoryCard';
import '@testing-library/jest-dom';
import type { Medication } from '@/types';


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

jest.mock('@/components/MedicationIcon', () => ({
  MedicationIcon: () => <div>MedicationIcon</div>,
}));

jest.mock('lucide-react-native', () => ({
  Edit: () => <span>EditIcon</span>,
  Plus: () => <span>PlusIcon</span>,
  AlertTriangle: () => <span>AlertTriangleIcon</span>,
}));

jest.mock('@/constants/translations', () => ({
  translations: {
    addQuantity: 'Добавить',
    remainingQuantity: 'Осталось',
    outOf: 'из',
    lowStockThreshold: 'Низкий запас',
  },
}));

jest.mock('@/constants/medication', () => ({
  MedicationForms: {
    tablet: 'Таблетка',
    capsule: 'Капсула',
  },
  pluralize: (unit: any, count: number) => `${unit[0]}${count > 1 ? 's' : ''}`,
  UnitsByForm: {
    tablet: [['таблетка', 'таблетки']],
    capsule: [['капсула', 'капсулы']],
  },
}));

describe('MedicationInventoryCard', () => {
    const mockMedication = {
        id: 'med-1',
        name: 'Аспирин',
        form: 'tablet',
        dosagePerUnit: '500 мг',
        unit: 'таблетка',
        instructions: '1 таблетка после еды',
        totalQuantity: 10,
        remainingQuantity: 5,
        lowStockThreshold: 3,
        trackStock: true,
        iconName: 'Pill',
        iconColor: '#0000FF',
        createdAt: 1714820000000,
        updatedAt: 1714820000000,
      } as Medication;
      

  const mockHandlers = {
    onEdit: jest.fn(),
    onRefill: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('отображает предупреждение о низком запасе', () => {
    render(
      <MedicationInventoryCard 
        medication={{ ...mockMedication, remainingQuantity: 2 }} 
        {...mockHandlers} 
      />
    );

    expect(screen.getByText('Низкий запас')).toBeInTheDocument();
    expect(screen.getByText('AlertTriangleIcon')).toBeInTheDocument();
  });

  it('вызывает onEdit при нажатии кнопки редактирования', () => {
    render(
      <MedicationInventoryCard 
        medication={mockMedication} 
        {...mockHandlers} 
      />
    );

    fireEvent.click(screen.getByText('EditIcon'));
    expect(mockHandlers.onEdit).toHaveBeenCalled();
  });

  it('вызывает onRefill при нажатии кнопки добавления', () => {
    render(
      <MedicationInventoryCard 
        medication={mockMedication} 
        {...mockHandlers} 
      />
    );

    fireEvent.click(screen.getByText('Добавить'));
    expect(mockHandlers.onRefill).toHaveBeenCalled();
  });

  it('не отображает информацию о запасе, если trackStock = false', () => {
    render(
      <MedicationInventoryCard 
        medication={{ ...mockMedication, trackStock: false }} 
        {...mockHandlers} 
      />
    );

    expect(screen.queryByText('Осталось')).not.toBeInTheDocument();
    expect(screen.queryByTestId('progress-bar')).not.toBeInTheDocument();
  });

  it('правильно отображает иконку и цвет лекарства', () => {
    render(
      <MedicationInventoryCard 
        medication={mockMedication} 
        {...mockHandlers} 
      />
    );

    expect(screen.getByText('MedicationIcon')).toBeInTheDocument();
  });
});