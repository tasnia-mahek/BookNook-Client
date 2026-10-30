# BookNook client

BookNook is a responsive Next.js App Router frontend for an online library.
This stage intentionally uses a local browser-backed mock store; it does not
connect to MongoDB, Express, JWT, Better Auth, Google OAuth, or a deployment.

## Frontend features

- Forest-green and warm-ivory responsive design with reusable buttons, cards, and layout components.
- Three-slide Swiper hero, latest-six book shelf, borrowing explainer, and reader-focused secondary section.
- Searchable All Books catalog and detailed book pages.
- Local mock registration/login with password validation and a demo account:
  `demo@booknook.test` / `Reader2026`.
- Add, edit, and delete book flows with ownership-aware local state.
- Borrow and return flows with a seven-day return date, available-copy display, and duplicate-borrow prevention.
- My Books, My Borrows, and My Profile views.
- Custom confirmation modal, toast notifications, loading component, and custom 404 page.

## Run locally

```bash
npm install
npm run dev
```

The local store is persisted in browser `localStorage` under `booknook-mock-*`
keys. Future API/auth integration should replace the functions in
`components/app-provider.tsx` without changing the page-level UI contracts.
