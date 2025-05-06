// __tests__/error-store.test.ts
import { useErrorStore } from '../store/error-store';
import { ApiError } from '@/api/api-controller';

const создатьОшибку = (status: number, details: string): ApiError => ({
  status,
  details,
  message: `Ошибка ${status}: ${details}`,
  name: 'ApiError',
  stack: 'stack-trace',
});

describe('Хранилище ошибок', () => {
  beforeEach(() => {
    useErrorStore.setState({ error: null });
  });

  it('должно инициализироваться с пустой ошибкой', () => {
    const { error } = useErrorStore.getState();
    expect(error).toBeNull();
  });

  it('должно сохранять ошибку', () => {
    const { setError } = useErrorStore.getState();
    const тестоваяОшибка = создатьОшибку(404, 'Не найдено');

    setError(тестоваяОшибка);
    
    expect(useErrorStore.getState().error).toEqual(тестоваяОшибка);
  });

  it('должно обновлять ошибку', () => {
    const { setError } = useErrorStore.getState();
    const перваяОшибка = создатьОшибку(400, 'Неверный запрос');
    const втораяОшибка = создатьОшибку(500, 'Ошибка сервера');

    setError(перваяОшибка);
    setError(втораяОшибка);
    
    expect(useErrorStore.getState().error).toEqual(втораяОшибка);
  });

  it('должно очищать ошибку при установке null', () => {
    const { setError } = useErrorStore.getState();
    const тестоваяОшибка = создатьОшибку(403, 'Доступ запрещен');

    setError(тестоваяОшибка);
    setError(null);
    
    expect(useErrorStore.getState().error).toBeNull();
  });

  it('должно сохранять состояние ошибки между операциями', () => {
    const { setError } = useErrorStore.getState();
    const тестоваяОшибка = создатьОшибку(401, 'Не авторизован');

    setError(тестоваяОшибка);
    
    expect(useErrorStore.getState().error).toEqual(тестоваяОшибка);
    
    const { error } = useErrorStore.getState();
    setError(null);
    expect(error).toEqual(тестоваяОшибка);
  });

  it('должно корректно обрабатывать полный объект ошибки', () => {
    const { setError } = useErrorStore.getState();
    const полнаяОшибка: ApiError = {
      status: 418,
      details: 'Я чайник',
      message: 'Ошибка 418: Я чайник',
      name: 'TeapotError',
      stack: 'stack-trace-for-teapot'
    };

    setError(полнаяОшибка);
    
    expect(useErrorStore.getState().error).toMatchObject({
      status: 418,
      details: 'Я чайник',
      name: 'TeapotError'
    });
  });
});