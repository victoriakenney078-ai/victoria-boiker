You are a principal frontend engineer. Build a complete, production-grade marketing site for Maison Valmont, an ultra-exclusive fine-art gallery (Geneva and London). Aesthetic: Old Money / Quiet Luxury — a private European salon, mahogany paneling, velvet, archival paper. No startup gloss, no gold gradients, no rounded cards, no Lorem Ipsum.

Stack (do not add 3D libraries yet):
- Next.js 14+ App Router, React 18+, strict TypeScript
- Tailwind CSS with semantic tokens as CSS variables
- next/font/google only
- Framer Motion for reveals. Easing for every entrance and hover: cubic-bezier(0.22, 1, 0.36, 1). Duration 0.7–1.1s. No bounce, no spring overshoot.

3D readiness (architecture only):
- Do NOT install @react-three/fiber, drei, or three.
- Every painting lives in one client component, components/ArtworkCanvasSlot.tsx ('use client').
- Props: id, title, artist, year, dimensions, medium, textureUrl, frameStyle ('mahogany' | 'brass' | 'ebonized'), aspectRatio, interactiveMode?: boolean.
- Default mode: a 2D museum shadow-box (next/image, fill, object-cover) inside a recessed mat. interactiveMode: same slot, plus a darkroom stage chrome (zoom in/out, light angle labels) that is visual only — no WebGL. Parent layouts must not know whether the slot is 2D or a future <Canvas>.
- Clicking “Inspect Artwork (3D)” or “3D Salon View” sets selectedArtworkId and opens the inspection modal. Esc closes it and returns focus to the trigger. Body scroll locks while open.

Color (use these exact values as CSS variables on :root, then Tailwind theme colors):
- --navy: #0B1320 (60%, page background)
- --navy-elevated: #111D30 (raised surfaces)
- --parchment: #EAE0D0 (headings on dark, light sections)
- --parchment-deep: #D5C7B2 (secondary light surfaces)
- --ink: rgba(234, 224, 208, 0.78) (body on dark)
- --mahogany: #2C1E16 and --mahogany-mid: #3B281E (mats, shadow-boxes, leather accents, hovers)
- --brass: #9A8464 (1px hairlines, active indicators, frame trim only)
- Hairline grid: 1px solid rgba(234, 224, 208, 0.14)
- radius: 0 everywhere
- Fixed full-viewport film grain at opacity 0.03, pointer-events: none, above the page, under modals. CSS only (SVG noise or repeating gradient). No image asset required.

Type:
- Cormorant Garamond 300, 400, 500, italic — display. Headlines tracking -0.025em.
- Plus Jakarta Sans 300, 400, 500 — UI, nav, catalog tags. Uppercase labels: 11–12px, tracking 0.22em.

Pages and sections (single route app/page.tsx, plus the modal):
1. Header — sticky, backdrop-blur-md, bg navy/85, bottom hairline. Wordmark “MAISON VALMONT — FINE ART” in serif, subline “GENÈVE • LONDON”. Nav: The Collection, Exhibitions, Provenance, Advisory (anchor links). CTA “Private Viewing”: 1px brass border, no fill. Mobile: a full-height navy drawer, same links, Esc and overlay click close it.
2. Hero “The Grand Salon” — min-h-screen. Navy field with a soft radial spotlight (parchment at very low alpha) behind the frame. 12-column split, stack on small screens: left 5 — headline “Timeless Mastery, Curated for Generations”, a 3–4 sentence curatorial manifesto in real prose, button “Explore the Vault” scrolling to #collection. Right 7 — recessed mahogany mat, 1px brass trim, soft drop shadow, flagship ArtworkCanvasSlot, corner badge “3D Salon View”.
3. Collection #collection — filter: All Works, Old Masters, 19th Century, Sculpture & Objects. Animated brass underline on the active item (layoutId). Asymmetric editorial grid, not a uniform card row: alternate plinths between navy and parchment so type and mats invert correctly (navy type on parchment). Each card: ArtworkCanvasSlot, placard (artist, italic title, year, medium, dimensions in cm and in), hover actions “Inspect Artwork (3D)” and “Request Dossier” (dossier scrolls to the form and pre-selects that work). Stagger the card reveal on scroll, once.
4. Exhibition #exhibitions — full-bleed mahogany, parchment type. One seasonal show with a real title, dates, and a two-column curator’s essay. Small archival “stamp” labels (house, city, year) in tracked sans, not clipart.
5. Inspection modal — on artwork open. Desktop: 65/35 split. Left: ArtworkCanvasSlot interactiveMode on a near-black stage. Right: provenance timeline, condition note, “Request this dossier” (closes modal, focuses the form, sets artwork). Mobile: stack, stage first, dossier below, sticky close.
6. Concierge #advisory — parchment section, navy and mahogany type. Fields: Full Name, Email, Preferred Salon (Geneva / London / Either), Artwork of Interest (select fed by the artworks data, respects dossier preselect), Private Note. Inputs are bottom-border only: border-b border-mahogany/40, focus border-mahogany, no boxes, radius 0. Client-side required + email check. Submit does not call a network: show a quiet confirmation (“The house will reply by private correspondence.”) and a way to send another note.
7. Provenance #provenance — a short house statement (three paragraphs) on how works are researched, plus two discreet lines: viewing by appointment, no public prices.
8. Footer — navy. Geneva and London salon addresses (plausible private-gallery addresses you invent once and keep consistent), “Viewing by appointment”, links: Privacy, Terms, Impressum as buttons or anchors that do not 404 (a small on-page disclosure is enough). Year in the colophon.

Data — data/artworks.ts, typed, 8 works:
- Mix of Old Masters and 19th century, plus 2 sculpture/objects so the filter is real.
- Fields: id, title, artist, year, medium, dimensionsCm, dimensionsIn, category ('old-masters' | 'nineteenth' | 'sculpture'), textureUrl, frameStyle, aspectRatio, provenance (3–5 dated lines), condition (2 sentences), blurb (1 sentence).
- Images: direct Wikimedia Commons / museum open-access URLs of real paintings (e.g. public-domain works by Rembrandt, Vermeer, Turner, Sargent, or equivalent). next.config must allow those remote hosts. Every textureUrl must be a working image URL, not a placeholder service.
- Flagship hero work is the first old master. Copy is specific: name the sitter or subject, the collection fiction (“from a Genevan private cabinet”), never generic “beautiful artwork”.

Files:
- app/layout.tsx — fonts, metadata title “Maison Valmont — Fine Art”, description, grain wrapper
- app/page.tsx — composes sections
- app/globals.css — tokens, grain, base type
- tailwind.config.ts — colors, font families, no rounded scale
- components/Navbar.tsx
- components/Hero.tsx
- components/Collection.tsx
- components/Exhibition.tsx
- components/Provenance.tsx
- components/Concierge.tsx
- components/Footer.tsx
- components/ArtworkCanvasSlot.tsx
- components/InspectionModal.tsx
- components/Grain.tsx
- data/artworks.ts
- next.config.ts / .mjs — images.remotePatterns

Motion and quality:
- Respect prefers-reduced-motion: cut transitions to opacity only, ~150ms.
- Keyboard: visible focus ring in brass, logical tab order, modal focus trap, Esc closes modal and mobile nav.
- Responsive: 375, 768, 1280, 1600. No horizontal scroll. Hero stacks image under text on small screens. Grid becomes 1 col, then 2, then the asymmetric 12-col composition.
- Semantic header, main, section, footer. Images have real alt text (artist, title, year).
- next/image for every work. Sizes attribute set so mobile does not download the hero width.

Do not:
- Invent a second page router or a CMS
- Add prices, cart, auth, or a backend
- Use Inter, serif-on-sans body, drop shadows in pure black, or border-radius
- Put brass on large fills — hairlines and the active filter only
- Leave TODO copy or broken images

Done when `npm run build` succeeds and the page can be clicked through: filter changes the set, inspect opens the matching dossier, Esc closes it, dossier request lands in the form with that work selected, and the form confirms without a reload.

## Текущая сборка

Исходный бриф выше оставлен как задание. Сайт собран иначе.

Галерея называется Victoria Boiker. Подзаголовок: unique art. private luxury. Надписи Maison Valmont, Genève и London убраны. Секция выставки удалена. Заголовок героя остаётся: Timeless Mastery, Curated for Generations.

В каталоге семь работ Виктории Бойкер, файлы в `public/artworks`:

| Работа | Файл | Форма | Раздел |
| --- | --- | --- | --- |
| Golden Descent | golden-descent.jpg | вертикальный холст | Horses |
| Winged Horse | winged-horse.jpg | квадрат | Horses |
| Green Eye | green-eye.jpg | вертикальный холст | Portraits |
| Horse and Ships | horse-and-ships.jpg | горизонтальный холст | Horses |
| Two Faces | two-faces.png | круг | Portraits |
| The Profile | the-profile.png | овал | Portraits |
| The Walk | the-walk.png | круг | Scenes |

На первом экране портрет Victoria Boiker с подписью founder and author. Golden Descent остаётся в коллекции. У кругов и овала с фото снят белый фон, остаётся только холст. Годы и размеры в сантиметрах не выдуманы: на карточке указана форма холста. Фильтры: All Works, Horses, Portraits, Scenes. Старых фильтров Old Masters, 19th Century и Sculpture & Objects нет.

Вход и регистрация только в браузере. Кнопки Sign in стоят в шапке, в мобильном меню и на первом экране. Коллекцию можно смотреть без входа. Заказ требует сессии. Аккаунты лежат в localStorage (`victoria-boiker-accounts`, `victoria-boiker-session`).

На главной есть живой чат. Клиент хранит переписку и при каждом вопросе отправляет её целиком, вместе с более ранними репликами. Корзина принимает работы по указанной цене и оформляет заказ в этом браузере.

Локальный запуск: `npm install`, затем `npm run dev`. Если порт 3000 занят, `npx next dev -p 3001`.
