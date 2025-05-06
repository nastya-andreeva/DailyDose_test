// **tests**/onboarding-store.test.ts
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  }));
  
  import { useOnboardingStore } from '../store/onboarding-store';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  describe('Onboarding Store', () => {
    beforeEach(() => {
      // Очищаем состояние перед каждым тестом
      useOnboardingStore.setState({ hasCompletedOnboarding: false });
      jest.clearAllMocks();  // Очистить все моки между тестами
    });
  
    it('should initialize with hasCompletedOnboarding as false', () => {
      const { hasCompletedOnboarding } = useOnboardingStore.getState();
      expect(hasCompletedOnboarding).toBe(false);
    });
  
    it('should complete onboarding', () => {
      const { completeOnboarding } = useOnboardingStore.getState();
  
      completeOnboarding();
  
      const { hasCompletedOnboarding } = useOnboardingStore.getState();
      expect(hasCompletedOnboarding).toBe(true); // Теперь проверяем состояние напрямую после вызова
    });
  
    it('should reset onboarding state', () => {
      const { completeOnboarding, resetOnboarding } = useOnboardingStore.getState();
  
      completeOnboarding();
      const { hasCompletedOnboarding: afterComplete } = useOnboardingStore.getState();
      expect(afterComplete).toBe(true);
  
      resetOnboarding();
      const { hasCompletedOnboarding: afterReset } = useOnboardingStore.getState();
      expect(afterReset).toBe(false);
    });
  
    it('should persist onboarding state in AsyncStorage', async () => {
      const { completeOnboarding } = useOnboardingStore.getState();
  
      completeOnboarding();
  
      // Проверяем, что состояние сохранено в AsyncStorage
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'onboarding-storage',
        JSON.stringify({ state: { hasCompletedOnboarding: true }, version: 0 }) // Обновляем ожидаемую структуру
      );
    });
  
    it('should return the initial state after reset', () => {
      const { completeOnboarding, resetOnboarding } = useOnboardingStore.getState();
  
      completeOnboarding();
      resetOnboarding();
  
      const { hasCompletedOnboarding: resetState } = useOnboardingStore.getState();
      expect(resetState).toBe(false);
    });
  });
  