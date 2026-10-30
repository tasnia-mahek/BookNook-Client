# BookNook client

BookNook is a responsive Next.js App Router frontend for an online library.
Authentication now uses Better Auth with the MongoDB adapter. Book catalog and
borrowing data remain local mock state until the business API stage.

## Frontend features

- Forest-green and warm-ivory responsive design with reusable buttons, cards, and layout components.
- Three-slide Swiper hero, latest-six book shelf, borrowing explainer, and reader-focused secondary section.
- Searchable All Books catalog and detailed book pages.
- Better Auth email/password registration and login with password validation.
- Better Auth session persistence, logout, loading state, and protected routes.
- Google sign-in configuration is present but remains disabled until Google Cloud credentials are supplied.
- Add, edit, and delete book flows with ownership-aware local state.
- Borrow and return flows with a seven-day return date, available-copy display, and duplicate-borrow prevention.
- My Books, My Borrows, and My Profile views.
- Custom confirmation modal, toast notifications, loading component, and custom 404 page.

## Run locally

```bash
npm install
npm run dev
```

The temporary book/borrow store is persisted in browser `localStorage` under
`booknook-mock-*` keys. Authentication records and sessions are stored by
Better Auth in MongoDB. Future business API integration should replace the
book/borrow functions in `components/app-provider.tsx` without changing the
page-level UI contracts.

## Authentication environment

Copy `.env.example` to `.env.local` and provide `MONGODB_URI`,
`MONGODB_DB`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL`. Do not commit
`.env.local`. Google requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
