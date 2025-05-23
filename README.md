# Тестирование в DailyDose

В этом проекте реализована система модульного и компонентного тестирования с использованием **Jest** и **React Testing Library**. Цель — обеспечить надёжность пользовательского интерфейса, бизнес-логики и сторов.

## Структура

Тесты находятся в директории:

```
/tests
```

Каждый файл тестирует отдельный компонент, экран или store. Названия файлов соответствуют именам тестируемых сущностей.

---

## Что покрыто тестами?

Тесты охватывают:

- **UI-компоненты**: кнопки, инпуты, карточки лекарств, состояния пустых страниц и др.
- **Функциональность**: добавление, редактирование и отображение лекарств.
- **Store-логика**: тестирование хранилищ (`auth-store`, `settings-store`, `notification-store` и др.).
- **Онбординг и расписание**.
- **Ошибки и fallback UI**.

---

## Как запустить тесты?

1. Установите зависимости:

```bash
npm install
```

2. Запустите все тесты:

```bash
npm test
```

Также можно запускать тесты в режиме watch:

```bash
npm run test:watch
```

---
