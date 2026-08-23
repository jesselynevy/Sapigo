This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Connect the frontend to SapiGo backend

Set the backend URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Start the services in separate terminals:

```bash
# backend/
uv run dev

# frontend/
npm run dev
```

The frontend calls these backend routes in order:

1. `POST /api/animals` — create an animal (available as `createAnimal` in `src/lib/api/sapi.ts`).
2. `POST /api/media-assets/upload` for each of three muzzle reference photos: middle, left, and right.
3. `POST /api/animals/{animal_id}/enroll` to build the template.
4. `POST /api/animals/{animal_id}/verify` with a live muzzle photo.

The **Daftar Sapi** flow creates the animal, uploads middle, left, and right reference photos, and enrolls its muzzle template. Quality-gate rejection responses (`422`) identify the rejected angle and show the backend reason so the operator can retake it. The **Verification** flow submits the live photo through `/verify` and shows the decision plus similarity score.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
