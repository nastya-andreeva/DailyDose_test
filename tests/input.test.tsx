import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../components/Input';
import '@testing-library/jest-dom';

// Мокаем зависимости
jest.mock('react-native', () => {
  const View = ({ children, style }: any) => <div style={style}>{children}</div>;
  const Text = ({ children, style }: any) => <span style={style}>{children}</span>;
  const TextInput = ({ 
    value, 
    onChangeText, 
    placeholder, 
    style, 
    secureTextEntry,
    multiline,
    ...props 
  }: any) => (
    <input
      type={secureTextEntry ? 'password' : 'text'}
      value={value}
      onChange={(e) => onChangeText(e.target.value)}
      placeholder={placeholder}
      style={style}
      data-multiline={multiline}
      {...props}
    />
  );
  const TouchableOpacity = ({ children, onPress, style }: any) => (
    <button onClick={onPress} style={style}>{children}</button>
  );
  const Button = ({ title, onPress }: any) => (
    <button onClick={onPress}>{title}</button>
  );
  const InputAccessoryView = ({ children }: any) => <div>{children}</div>;
  const Keyboard = {
    dismiss: jest.fn(),
  };
  
  return {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Button,
    InputAccessoryView,
    Keyboard,
    StyleSheet: {
      create: (styles: any) => styles,
    },
    Platform: {
      OS: 'ios',
    },
  };
});

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: any) => <div>{children}</div>,
  SafeAreaView: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('lucide-react-native', () => ({
  Eye: () => <span>EyeIcon</span>,
  EyeOff: () => <span>EyeOffIcon</span>,
}));

jest.mock('react-native-svg', () => ({
  Svg: ({ children }: any) => <svg>{children}</svg>,
  Path: () => <path />,
}));

jest.mock('@/constants/translations', () => ({
  translations: {
    done: 'Готово',
  },
}));

describe('Input', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('отображает базовое поле ввода', () => {
    render(<Input value="" onChangeText={mockOnChange} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('отображает label и placeholder', () => {
    render(
      <Input 
        value="" 
        onChangeText={mockOnChange} 
        label="Тестовая метка" 
        placeholder="Тестовый плейсхолдер" 
      />
    );
    
    expect(screen.getByText('Тестовая метка')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Тестовый плейсхолдер')).toBeInTheDocument();
  });

  it('вызывает onChangeText при вводе текста', () => {
    render(<Input value="" onChangeText={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Тестовый текст' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('Тестовый текст');
  });

  it('отображает ошибку, если она передана', () => {
    render(
      <Input 
        value="" 
        onChangeText={mockOnChange} 
        error="Тестовая ошибка" 
      />
    );
    
    expect(screen.getByText('Тестовая ошибка')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveStyle({ borderColor: 'colors.error' });
  });

  it('отображает иконки слева и справа', () => {
    render(
      <Input 
        value="" 
        onChangeText={mockOnChange} 
        leftIcon={<span>LeftIcon</span>}
        rightIcon={<span>RightIcon</span>}
      />
    );
    
    expect(screen.getByText('LeftIcon')).toBeInTheDocument();
    expect(screen.getByText('RightIcon')).toBeInTheDocument();
  });

  it('отображает многострочное поле ввода', () => {
    render(
      <Input 
        value="" 
        onChangeText={mockOnChange} 
        multiline 
        numberOfLines={3}
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('data-multiline', 'true');
  });

});