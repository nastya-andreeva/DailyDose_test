import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorModal } from '../components/ErrorModal';
import '@testing-library/jest-dom';


type ErrorState = {
  error: {
    status: number;
    details: string;
  } | null;
  setError: (error: ErrorState['error']) => void;
};


const mockUseErrorStore = jest.fn() as jest.Mock & {
  getState: jest.Mock;
  setState: jest.Mock;
  subscribe: jest.Mock;
  destroy: jest.Mock;
};


jest.mock('@/store/error-store', () => ({
  useErrorStore: () => mockUseErrorStore(),
}));


jest.mock('react-native', () => ({
  View: ({ children, style }: any) => <div style={style}>{children}</div>,
  Text: ({ children, style }: any) => <span style={style}>{children}</span>,
  Modal: ({ children, visible }: any) => (visible ? <div>{children}</div> : null),
  Button: ({ title, onPress }: any) => (
    <button onClick={onPress}>{title}</button>
  ),
  StyleSheet: {
    create: (styles: any) => styles,
  },
}));

jest.mock('@/constants/translations', () => ({
  translations: {
    close: 'Закрыть',
  },
}));

jest.mock('@/utils/error-utils', () => ({
  extractErrorMessageString: jest.fn((details) => `Extracted: ${details}`),
}));

describe('ErrorModal', () => {
  const mockSetError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseErrorStore.mockReturnValue({
      error: null,
      setError: mockSetError,
    });
  });

  it('не отображается, когда нет ошибки', () => {
    render(<ErrorModal />);
    expect(screen.queryByText('API Error')).not.toBeInTheDocument();
  });

  it('отображается, когда есть ошибка', () => {
    mockUseErrorStore.mockReturnValueOnce({
      error: {
        status: 404,
        details: 'Not found',
      },
      setError: mockSetError,
    });

    render(<ErrorModal />);
    
    expect(screen.getByText('API Error')).toBeInTheDocument();
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Extracted: Not found')).toBeInTheDocument();
    expect(screen.getByText('Закрыть')).toBeInTheDocument();
  });

  it('вызывает setError(null) при нажатии кнопки закрытия', () => {
    mockUseErrorStore.mockReturnValueOnce({
      error: {
        status: 500,
        details: 'Server error',
      },
      setError: mockSetError,
    });

    render(<ErrorModal />);
    
    const closeButton = screen.getByText('Закрыть');
    fireEvent.click(closeButton);
    
    expect(mockSetError).toHaveBeenCalledWith(null);
  });
});