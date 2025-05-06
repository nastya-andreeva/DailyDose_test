import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProfilePhoto } from "../components/ProfilePhoto";
import '@testing-library/jest-dom';


jest.mock('react-native', () => ({
  View: ({ children }: any) => <div>{children}</div>,
  Text: ({ children }: any) => <span>{children}</span>,
  StyleSheet: {
    create: (styles: any) => styles,
  },
  TouchableOpacity: ({ children, onPress }: any) => (
    <button onClick={onPress}>{children}</button>
  ),
  Image: ({ source }: any) => <img data-testid="profile-photo" src={source.uri} alt="" />,
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{ uri: 'test-photo-uri' }],
  }),
  MediaTypeOptions: {
    Images: 'image',
  },
}));


jest.mock('lucide-react-native', () => ({
  User: ({ size }: any) => <div data-testid="user-icon" style={{ width: size, height: size, backgroundColor: 'gray' }} />,
  Camera: ({ size, color }: any) => <div style={{ width: size, height: size, backgroundColor: color }} />,
}));


jest.mock('@/constants/translations', () => ({
  translations: {
    changePhoto: 'Изменить фото',
  },
}));

describe('ProfilePhoto', () => {
  const mockOnPhotoSelected = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('отображает изображение профиля, если URL фото предоставлен', () => {
    render(
      <ProfilePhoto
        photoUrl="https://example.com/photo.jpg"
        onPhotoSelected={mockOnPhotoSelected}
      />
    );


    expect(screen.getByTestId('profile-photo')).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('отображает иконку пользователя, если фото не указано', () => {
    render(
      <ProfilePhoto
        onPhotoSelected={mockOnPhotoSelected}
      />
    );


    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });

  it('вызывает функцию onPhotoSelected при выборе фото', async () => {
    render(
      <ProfilePhoto
        onPhotoSelected={mockOnPhotoSelected}
      />
    );


    fireEvent.click(screen.getByText('Изменить фото'));
    

    await waitFor(() => {
      expect(mockOnPhotoSelected).toHaveBeenCalledWith('test-photo-uri');
    });
  });

  it('не отображает кнопку выбора фото, если prop editable=false', () => {
    render(
      <ProfilePhoto
        photoUrl="https://example.com/photo.jpg"
        onPhotoSelected={mockOnPhotoSelected}
        editable={false}
      />
    );


    expect(screen.queryByText('Изменить фото')).toBeNull();
  });

  it('отображает кнопку выбора фото, если prop editable=true', () => {
    render(
      <ProfilePhoto
        onPhotoSelected={mockOnPhotoSelected}
        editable={true}
      />
    );


    expect(screen.getByText('Изменить фото')).toBeInTheDocument();
  });
});
