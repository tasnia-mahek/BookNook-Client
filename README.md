# BookNook client

BookNook is a responsive Next.js App Router frontend for an online library.
Authentication uses Better Auth with the MongoDB adapter, while books and
borrowing data use the Express API.

## Frontend features

- Forest-green and warm-ivory responsive design with reusable buttons, cards, and layout components.
- Three-slide Swiper hero, latest-six book shelf, borrowing explainer, and reader-focused secondary section.
- Searchable All Books catalog and detailed book pages.
- Better Auth email/password registration and login with password validation.
- Better Auth session persistence, logout, loading state, and protected routes.
- Google sign-in configuration with environment-provided Google Cloud credentials.
- Add, edit, and delete book flows with server-side ownership enforcement.
- ImgBB image upload for Add Book and optional replacement image on edit.
- Borrow and return flows with server-side seven-day dates, available-copy management, and duplicate-borrow prevention.
- My Books, My Borrows, and My Profile views.
- Custom confirmation modal, toast notifications, loading component, and custom 404 page.

## Run locally

```bash
npm install
npm run dev
```

Books and borrowing records are stored in MongoDB through the Express server.
Authentication records and sessions are stored by Better Auth in MongoDB.

## Authentication environment

Copy `.env.example` to `.env.local` and provide `MONGODB_URI`, `MONGODB_DB`,
`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `NEXT_PUBLIC_IMGBB_API_KEY`.
Do not commit `.env.local`. Google requires `GOOGLE_CLIENT_ID` and
`GOOGLE_CLIENT_SECRET`.

## Deployment

No live deployment has been completed yet. Add the deployed client URL here
after deployment.
