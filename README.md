# Victoria Boiker

Личная галерея. Сайт показывает семь работ. Вход и заказы идут через Supabase. Корзина и чат остаются в браузере.

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

## Переменные окружения

Скопируйте [`env.example`](env.example) в `.env.local` и заполните значения. Файл `.env.local` в git не попадает.

- `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY` — проект Supabase (в браузере).
- `XAI_API_KEY` или `OPENAI_API_KEY` — необязательно, только на сервере, для ответов Live chat.

## Деплой (Cloudflare Pages)

Проект: **Workers & Pages** → `victoria-boiker` (см. [`wrangler.toml`](wrangler.toml)). Next.js собирается через [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages); маршрут `/api/chat` на `runtime = edge`.

**Сборка в Cloudflare (рекомендуется):** подключите репозиторий `victoriakenney078-ai/victoria-boiker` → Build command `npm run build:cf`, output directory `.vercel/output/static`, compatibility flag `nodejs_compat`. Задайте переменные как в [`.dev.vars.example`](.dev.vars.example) (`XAI_API_KEY` — encrypted). Каталог сборки и переменные задаются в проекте Pages. В `wrangler.toml` нет `pages_build_output_dir`: с этой строкой файл заменяет настройки проекта и `next build` не видит переменные Supabase.

**Локально:** `npm run dev` без изменений. Полная сборка `build:cf` на Windows требует WSL/bash; иначе пуш в git и сборка на Cloudflare.

**CLI:** `npx wrangler login`, затем `powershell -File scripts/deploy-cloudflare.ps1` (из WSL/Linux или после успешного `npm run build:cf`).

**Supabase Auth:** Site URL — ваш `*.pages.dev` или `localhost:3000`; Redirect URLs: `http://localhost:3000/**`, `https://*.pages.dev/**`, `https://*.workers.dev/**`. Скрипт: `scripts/update-supabase-auth-urls.ps1` при наличии `SUPABASE_ACCESS_TOKEN`.

## Вход

Кнопки Sign in стоят в шапке, в меню телефона и на первом экране. Они открывают вход и регистрацию поверх страницы. Коллекция при этом остаётся доступной.

Вход идёт через Supabase Auth. Имя хранится в `gallery_profiles`, заказ — в `gallery_orders`. Заявка на просмотр пишется в `gallery_viewings`. Владелец галереи видит все заказы и заявки на странице `/desk`. Остальные читают только свой заказ. Пароль не короче 8 символов. Если проект требует подтверждение почты, письмо приходит до входа. Sign out снимает сессию Supabase.

## Чат

Кнопка Live chat внизу справа открывает переписку. Каждое сообщение уходит вместе со всей историей и с заметкой о более ранних репликах, поэтому следующий ответ видит уже сказанное. Переписка лежит в localStorage (`victoria-boiker-chat`) и не сбрасывается при обновлении страницы.

Если в окружении сервера есть `XAI_API_KEY` или `OPENAI_API_KEY`, отвечает эта модель. Без ключа отвечает консьерж галереи по тем же сообщениям.

## Корзина

У каждой работы есть цена и кнопка Add to cart. Корзина открывается из шапки. Заказ записывается в Supabase и получает номер. Оплата на сайте не списывается: галерея подтверждает её отдельно.

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

На первом экране портрет основателя и автора, Victoria Boiker. Надпись с фотографии снята. Golden Descent остаётся в коллекции. У Two Faces, The Profile и The Walk с фотографии снят белый фон: на сайте остаётся только холст. Размеры в сантиметрах и годы на карточках не указаны.

Фильтры коллекции: All Works, Horses, Portraits, Scenes. Кнопка View in a Room вешает выбранную работу на стену: три комнаты и три размера. Это только просмотр.

Круглые и овальную работу можно заново вырезать скриптом `scripts/prepare-artworks.mjs`. Ему нужен пакет `sharp`, в зависимости проекта он не входит.

## Состав страницы

- Шапка: Victoria Boiker, unique art. private luxury
- Герой, коллекция, происхождение, форма записи на просмотр
- Осмотр работы в окне: свет, масштаб, досье, Escape закрывает окно
- Подвал с краткими Privacy, Terms и Impressum

Исходное задание на сборку лежит в `PROMPT.md`. Внизу того файла записано, чем готовый сайт от него отличается.
