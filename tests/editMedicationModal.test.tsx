import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditMedicationModal } from '../components/EditMedicationModal';
import '@testing-library/jest-dom';

// Мокаем зависимости
jest.mock('react-native', () => {
  const View = ({ children, style, testID }: any) => (
    <div style={style} data-testid={testID}>{children}</div>
  );
  const Text = ({ children, style, testID }: any) => (
    <span style={style} data-testid={testID}>{children}</span>
  );
  const Modal = ({ children, visible }: any) => (
    visible ? <div data-testid="modal">{children}</div> : null
  );
  
  return {
    View,
    Text,
    Modal,
    StyleSheet: {
      create: (styles: any) => styles,
    },
  };
});

const mockUpdateMedication = jest.fn();
jest.mock('@/store/medication-store', () => ({
  useMedicationStore: () => ({
    updateMedication: mockUpdateMedication,
  }),
}));

jest.mock('@/constants/colors', () => ({
  colors: {
    background: '#FFFFFF',
    darkGray: '#757575',
    border: '#E0E0E0',
  },
}));

jest.mock('@/constants/translations', () => ({
  translations: {
    addStock: 'Добавить запас',
    enterNumber: 'Введите количество',
    cancel: 'Отмена',
    addQuantity: 'Добавить количество',
  },
}));

jest.mock('@/components/Input', () => ({
  Input: ({ value, onChangeText, placeholder, rightIcon }: any) => (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder={placeholder}
        data-testid="quantity-input"
      />
      {rightIcon}
    </div>
  ),
}));

jest.mock('@/components/Button', () => ({
  Button: ({ title, onPress, variant }: any) => (
    <button 
      onClick={onPress} 
      data-testid={`button-${variant || 'primary'}`}
    >
      {title}
    </button>
  ),
}));

describe('EditMedicationModal', () => {
  const mockOnClose = jest.fn();
  const mockMedication = {
    id: '1',
    name: 'Аспирин',
    unit: 'таблетки',
    remainingQuantity: 10,
    totalQuantity: 20,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('не отображается, когда visible=false', () => {
    render(
      <EditMedicationModal
        visible={false}
        onClose={mockOnClose}
        medication={mockMedication}
      />
    );

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('отображается с правильным содержимым, когда visible=true', () => {
    render(
      <EditMedicationModal
        visible={true}
        onClose={mockOnClose}
        medication={mockMedication}
      />
    );

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Добавить запас')).toBeInTheDocument();
    expect(screen.getByText('Введите количество')).toBeInTheDocument();
    expect(screen.getByTestId('quantity-input')).toBeInTheDocument();
    expect(screen.getByText('таблетки')).toBeInTheDocument();
    expect(screen.getByTestId('button-text')).toHaveTextContent('Отмена');
    expect(screen.getByTestId('button-primary')).toHaveTextContent('Добавить количество');
  });

  it('вызывает onClose при нажатии кнопки Отмена', () => {
    render(
      <EditMedicationModal
        visible={true}
        onClose={mockOnClose}
        medication={mockMedication}
      />
    );

    fireEvent.click(screen.getByTestId('button-text'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('обновляет количество и вызывает onClose при нажатии кнопки Добавить', () => {
    render(
      <EditMedicationModal
        visible={true}
        onClose={mockOnClose}
        medication={mockMedication}
      />
    );

    fireEvent.change(screen.getByTestId('quantity-input'), { 
      target: { value: '5' } 
    });

    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockUpdateMedication).toHaveBeenCalledWith('1', {
      remainingQuantity: 15,
      totalQuantity: 15,
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('не вызывает updateMedication при вводе нечислового значения', () => {
    render(
      <EditMedicationModal
        visible={true}
        onClose={mockOnClose}
        medication={mockMedication}
      />
    );

    fireEvent.change(screen.getByTestId('quantity-input'), { 
      target: { value: 'abc' } 
    });

    fireEvent.click(screen.getByTestId('button-primary'));

    expect(mockUpdateMedication).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('применяет правильные стили к модальному окну', () => {
    render(
      <EditMedicationModal
        visible={true}
        onClose={mockOnClose}
        medication={mockMedication}
      />
    );

    const modalContent = screen.getByText('Добавить запас').parentElement;
    
    // Проверяем только основные стили, которые не зависят от преобразования React Native
    expect(modalContent).toHaveStyle({
      backgroundColor: '#FFFFFF',
      padding: '24px',
      borderRadius: '16px',
    });
  });
});