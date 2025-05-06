import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../components/Input';
import '@testing-library/jest-dom';

jest.mock('react-native', () => {
  const React = require('react');
  
  const View = ({ children, style, ...props }: any) => (
    <div style={style} {...props}>
      {children}
    </div>
  );
  
  const Text = ({ children, style, ...props }: any) => (
    <span style={style} {...props}>
      {children}
    </span>
  );
  
  const TextInput = ({
    value,
    onChangeText,
    placeholder,
    style,
    secureTextEntry,
    multiline,
    editable = true,
    keyboardType,
    placeholderTextColor,
    numberOfLines,
    inputAccessoryViewID,
    ...props
  }: any) => {
    const domProps = {
      value,
      onChange: (e: any) => onChangeText?.(e.target.value),
      placeholder,
      style,
      type: secureTextEntry ? 'password' : 'text',
      disabled: !editable,
      'data-testid': 'text-input',
      'data-multiline': multiline,
      'data-keyboard-type': keyboardType,
      'data-placeholder-text-color': placeholderTextColor,
      'data-number-of-lines': numberOfLines,
      'data-input-accessory-view-id': inputAccessoryViewID,
      ...props
    };
    
    return multiline ? <textarea {...domProps} /> : <input {...domProps} />;
  };
  
  const TouchableOpacity = ({ children, onPress, style, ...props }: any) => (
    <button onClick={onPress} style={style} {...props}>
      {children}
    </button>
  );
  
  const Button = ({ title, onPress, ...props }: any) => (
    <button onClick={onPress} {...props}>
      {title}
    </button>
  );
  
  const Modal = ({ children, visible, ...props }: any) => (
    visible ? <div {...props}>{children}</div> : null
  );
  
  const InputAccessoryView = ({ children, ...props }: any) => (
    <div data-input-accessory-view {...props}>
      {children}
    </div>
  );
  
  return {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Button,
    Modal,
    InputAccessoryView,
    StyleSheet: {
      create: (styles: any) => styles,
    },
    Platform: {
      OS: 'ios',
    },
    Keyboard: {
      dismiss: jest.fn(),
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