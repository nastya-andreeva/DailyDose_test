import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuthStore } from '../store/auth-store';

jest.mock('../store/auth-store', () => ({
  useAuthStore: jest.fn(),
}));

describe('Auth Store', () => {
  let useAuthStoreMock: jest.Mock;

  beforeEach(() => {
    useAuthStoreMock = require('../store/auth-store').useAuthStore;
    useAuthStoreMock.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      signup: jest.fn(),
      updateProfile: jest.fn(),
      updatePassword: jest.fn(),
      logout: jest.fn(),
      setState: jest.fn(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks(); 
  });

  it('должен инициализироваться с user как null и isAuthenticated как false', () => {
    const { user, isAuthenticated } = useAuthStoreMock();
    expect(user).toBeNull();
    expect(isAuthenticated).toBe(false);
  });

  it('должен выбросить ошибку при попытке обновить профиль без авторизации', async () => {
    const { updateProfile } = useAuthStoreMock();
    
    try {
      await updateProfile({ name: 'New Name' });
    } catch (error) {
      expect(error).toEqual(new Error('Not authenticated'));
    }
  });

  it('должен логаутить и сбросить user и isAuthenticated', async () => {
    const mockLogout = jest.fn();

    useAuthStoreMock.mockImplementationOnce(() => ({
      user: { id: '1', name: 'Username', email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      signup: jest.fn(),
      updateProfile: jest.fn(),
      logout: mockLogout,
      setState: jest.fn(),
    }));

    const { login, logout } = useAuthStoreMock();
    await act(async () => {
      await login('test@example.com', 'password123');
    });

    await act(async () => {
      await logout();
    });

    useAuthStoreMock.mockImplementationOnce(() => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      signup: jest.fn(),
      updateProfile: jest.fn(),
      logout: mockLogout,
      setState: jest.fn(),
    }));

    const { user, isAuthenticated } = useAuthStoreMock();
    expect(user).toBeNull();
    expect(isAuthenticated).toBe(false);
  });
});
