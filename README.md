# Victoria Boiker

Личная галерея. Сайт показывает семь работ и пускает в коллекцию только после входа.

Стек: Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion. Одна страница. Сервера и базы данных нет.

## Запуск

```bash
npm install
npm run dev
```

Сайт открывается на http://localhost:3000. Если этот порт занят:

```bash
npx next dev -p 3001
```

Сборка: `npm run build`.

## Вход

Пока человек не вошёл, виден только экран входа. На нём две вкладки: Sign in и Register.

Аккаунт создаётся в браузере и сохраняется в localStorage:

- `victoria-boiker-accounts` — имя, почта и пароль
- `victoria-boiker-session` — текущая сессия

Пароль не короче 8 символов. После регистрации коллекция открывается сразу. Обновление страницы оставляет сессию. Sign out в меню возвращает на вход. В другом браузере аккаунт нужно создать заново.

## Коллекция

Картины лежат в `public/artworks`.

| Работа | Файл | Форма | Раздел |
| --- | --- | --- | --- |
| Golden Descent | `golden-descent.jpg` | вертикальный холст | Horses |
| Winged Horse | `winged-horse.jpg` | квадрат | Horses |
| Green Eye | `green-eye.jpg` | вертикальный холст | Portraits |
| Horse and Ships | `horse-and-ships.jpg` | горизонтальный холст | Horses |
| Two Faces | `two-faces.png` | круг | Portraits |
| The Profile | `the-profile.png` | овал | Portraits |
| The Walk | `the-walk.png` | круг | Scenes |

Golden Descent стоит в первом экране. У Two Faces, The Profile и The Walk с фотографии снят белый фон: на сайте остаётся только холст. Размеры в сантиметрах и годы на карточках не указаны.

Фильтры коллекции: All Works, Horses, Portraits, Scenes.

Круглые и овальную работу можно заново вырезать скриптом `scripts/prepare-artworks.mjs`. Ему нужен пакет `sharp`, в зависимости проекта он не входит.

## Состав страницы

- Шапка: Victoria Boiker, unique art. private luxury
- Герой, коллекция, происхождение, форма записи на просмотр
- Осмотр работы в окне: свет, масштаб, досье, Escape закрывает окно
- Подвал с краткими Privacy, Terms и Impressum

Исходное задание на сборку лежит в `PROMPT.md`. Внизу того файла записано, чем готовый сайт от него отличается.
