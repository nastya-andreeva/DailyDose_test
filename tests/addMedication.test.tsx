import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddMedicationScreen from '../app/medications/add';
import '@testing-library/jest-dom';


const mockBack = jest.fn();


jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
  Stack: {
    Screen: ({ options }: { options: any }) => null,
  },
}));


const addMedicationMock = jest.fn();

jest.mock('@/store/medication-store', () => ({
  useMedicationStore: () => ({
    addMedication: addMedicationMock,
  }),
}));

jest.mock('@/hooks/useKeyboard', () => ({
  useKeyboard: () => ({
    keyboardShown: false,
  }),
}));

jest.mock('react-native', () => {
  const View = ({ children, style }: any) => <div style={style}>{children}</div>;
  const Text = ({ children, style }: any) => <span style={style}>{children}</span>;
  const TouchableOpacity = ({ children, onPress }: any) => (
    <button onClick={onPress}>{children}</button>
  );
  const Image = ({ source }: any) => <img src={source} alt="mock" />;
  return {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet: { create: (s: any) => s },
    Platform: { OS: 'ios' },
    Animated: {
      View,
      Value: jest.fn(() => ({
        interpolate: jest.fn(() => 1),
      })),
    },
    Dimensions: {
      get: () => ({ window: { height: 800 } }),
    },
  };
});

jest.mock('@react-native-picker/picker', () => {
  const Picker = ({ children, selectedValue, onValueChange }: any) => (
    <select value={selectedValue} onChange={(e) => onValueChange(e.target.value, 0)}>
      {children}
    </select>
  );
  Picker.Item = ({ label, value }: any) => (
    <option value={value}>{label}</option>
  );
  return { Picker };
});

jest.mock('react-native-keyboard-aware-scroll-view', () => ({
  KeyboardAwareScrollView: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/components/Input', () => ({
  Input: ({ label, value, onChangeText, placeholder }: any) => (
    <div>
      {label && <label>{label}</label>}
      <input
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  ),
}));

jest.mock('@/components/Button', () => ({
  Button: ({ title, onPress }: any) => (
    <button onClick={onPress}>{title}</button>
  ),
}));

jest.mock('@/components/IconSelector', () => ({
  IconSelector: () => <div>IconSelector</div>,
}));

jest.mock('lucide-react-native', () => ({
  AlertCircle: () => <span>AlertCircle</span>,
}));

describe('AddMedicationScreen', () => {
  beforeEach(() => {
    mockBack.mockClear();
    addMedicationMock.mockClear();
  });

  it('отображает форму добавления лекарства', () => {
    render(<AddMedicationScreen />);
    expect(screen.getByText('Как называется лекарство?')).toBeInTheDocument();
    expect(screen.getByText('Выберите иконку')).toBeInTheDocument();
    expect(screen.getByText('Форма выпуска')).toBeInTheDocument(); // ← исправлено
  });

  it('позволяет вводить название лекарства', () => {
    render(<AddMedicationScreen />);
    const input = screen.getByPlaceholderText('Парацетамол');
    fireEvent.change(input, { target: { value: 'Аспирин' } });
    expect(input).toHaveValue('Аспирин');
  });


  it('валидирует форму перед сохранением и вызывает addMedication', () => {
    render(<AddMedicationScreen />);

    fireEvent.click(screen.getByText('Да, хочу'));

    fireEvent.click(screen.getByText('Сохранить лекарство'));

    expect(addMedicationMock).not.toHaveBeenCalled();

    fireEvent.change(screen.getByPlaceholderText('Парацетамол'), {
      target: { value: 'Аспирин' },
    });

    fireEvent.change(screen.getByPlaceholderText('30'), {
      target: { value: '10' },
    });

    fireEvent.change(screen.getByPlaceholderText('5'), {
      target: { value: '2' },
    });

    fireEvent.click(screen.getByText('Сохранить лекарство'));

    expect(addMedicationMock).toHaveBeenCalled();
  });

  it('позволяет отменить добавление лекарства', () => {
    render(<AddMedicationScreen />);
    fireEvent.click(screen.getByText('Отмена'));
    expect(mockBack).toHaveBeenCalled();
  });
});
