import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OnboardingScreen from '../app/onboarding';
import '@testing-library/jest-dom';
import { router } from 'expo-router';


jest.mock('react-native', () => {
  const View = ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <div style={style}>{children}</div>
  );
  const Text = ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <span style={style}>{children}</span>
  );
  const TouchableOpacity = ({ children, onPress, style }: { 
    children: React.ReactNode; 
    onPress: () => void;
    style?: any;
  }) => (
    <button onClick={onPress} style={style}>{children}</button>
  );
  
  return {
    View,
    Text,
    StyleSheet: {
      create: (styles: any) => styles,
    },
    TouchableOpacity,
  };
});


jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <div style={style}>{children}</div>
  ),
  useSafeAreaInsets: () => ({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }),
}));


jest.mock('@/constants/translations', () => ({
  translations: {
    welcomeToDailyDose: 'Welcome to DailyDose',
    onboardingWelcomeDesc: 'Manage your medications easily',
    trackYourMedications: 'Track your medications',
    onboardingTrackDesc: 'Never forget to take your pills',
    neverMissADose: 'Never miss a dose',
    onboardingRemindersDesc: 'Get reminders for your medications',
    monitorYourProgress: 'Monitor your progress',
    onboardingProgressDesc: 'Track your medication history',
    skip: 'Skip',
    next: 'Next',
    getStarted: 'Get Started',
  },
}));


jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
  Stack: {
    Screen: ({ options }: { options: any }) => null,
  },
}));


jest.mock('lucide-react-native', () => ({
  Pill: () => 'PillIcon',
  Calendar: () => 'CalendarIcon',
  Bell: () => 'BellIcon',
  PieChart: () => 'PieChartIcon',
  ChevronRight: () => 'ChevronRightIcon',
}));


const mockCompleteOnboarding = jest.fn();
jest.mock('@/store/onboarding-store', () => ({
  useOnboardingStore: () => ({
    completeOnboarding: mockCompleteOnboarding,
  }),
}));


jest.mock('@/components/Button', () => ({
  Button: ({ title, onPress }: { title: string; onPress: () => void }) => (
    <button onClick={onPress}>{title}</button>
  ),
}));

describe('OnboardingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('отображает первый шаг онбординга', () => {
    render(<OnboardingScreen />);
    
    expect(screen.getByText('PillIcon')).toBeInTheDocument();
    expect(screen.getByText('Welcome to DailyDose')).toBeInTheDocument();
    expect(screen.getByText('Manage your medications easily')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Skip')).toBeInTheDocument();
  });

  it('переключается на следующий шаг при нажатии кнопки "Next"', () => {
    render(<OnboardingScreen />);
    
    fireEvent.click(screen.getByText('Next'));
    
    expect(screen.getByText('CalendarIcon')).toBeInTheDocument();
    expect(screen.getByText('Track your medications')).toBeInTheDocument();
  });

  it('завершает онбординг при нажатии "Get Started"', () => {
    render(<OnboardingScreen />);
    

    fireEvent.click(screen.getByText('Next')); 
    fireEvent.click(screen.getByText('Next'));
    fireEvent.click(screen.getByText('Next'));
    
    fireEvent.click(screen.getByText('Get Started'));
    
    expect(mockCompleteOnboarding).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith('/(tabs)/calendar');
  });

  it('завершает онбординг при нажатии "Skip"', () => {
    render(<OnboardingScreen />);
    
    fireEvent.click(screen.getByText('Skip'));
    
    expect(mockCompleteOnboarding).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith('/(tabs)/calendar');
  });
});