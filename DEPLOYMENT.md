# Deploy Algo-Rush to Vercel

## Prerequisites

- GitHub repo pushed (e.g. `https://github.com/harshith-murali/AlgoRush`)
- [Neon](https://neon.tech) PostgreSQL database (you already use one)
- [Clerk](https://clerk.com) application
- [Judge0 on RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce) (optional, for Run/Submit)

## 1. Apply database migrations (once)

From your machine, with `DATABASE_URL` set to your production Neon URL:

```bash
npx prisma migrate deploy
```

Optional seed (dev/demo data only):

```bash
npm run db:seed
```

## 2. Import project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the **AlgoRush** GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. Build command: `npm run build` (default)
5. Install command: `npm install` (default)
6. Output directory: leave default

## 3. Environment variables

In **Vercel → Project → Settings → Environment Variables**, add:

| Variable | Required | Notes |
|----------|----------|--------|
| `DATABASE_URL` | Yes | Neon pooled connection string (`?sslmode=require`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | From Clerk dashboard |
| `CLERK_SECRET_KEY` | Yes | From Clerk dashboard |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Yes | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Yes | `/sign-up` |
| `JUDGE0_BASE_URL` | For Run/Submit | RapidAPI base URL |
| `JUDGE0_API_KEY` | For Run/Submit | RapidAPI key |
| `JUDGE0_HOST` | For Run/Submit | RapidAPI host header |

Copy values from your local `.env` (never commit `.env` to git).

Apply to **Production**, **Preview**, and **Development** as needed.

## 4. Configure Clerk for production

After the first deploy, note your Vercel URL (e.g. `https://algo-rush.vercel.app`).

In [Clerk Dashboard](https://dashboard.clerk.com) → your app → **Domains**:

- Add your Vercel production domain
- Add `*.vercel.app` for preview deployments if you use PR previews

Under **Paths**, ensure sign-in/sign-up URLs match:

- Sign-in: `/sign-in`
- Sign-up: `/sign-up`

For production, switch to **live** Clerk keys when ready (`pk_live_` / `sk_live_`).

## 5. Deploy

Click **Deploy** on Vercel, or push to `main` to trigger automatic deploys.

Verify:

- `/` loads
- `/problems` lists problems
- `/problems/[id]` workspace opens
- Sign-in / sign-up work on the Vercel domain

## 6. CLI deploy (optional)

```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local   # optional: sync env for local testing
vercel --prod
```

## Troubleshooting

### Build fails: cannot find `@/generated/prisma`

The project uses standard `@prisma/client` (not a custom `src/generated` path). Ensure:

- `postinstall` runs `prisma generate` (see `package.json`)
- `prisma` is in `dependencies` (not only devDependencies)
- `DATABASE_URL` is set in Vercel before build

### Database connection errors at runtime

- Use Neon **pooled** connection string for `DATABASE_URL`
- Ensure migrations were applied: `npx prisma migrate deploy`

### Clerk redirect / auth errors

- Vercel domain must be added in Clerk **Domains**
- `NEXT_PUBLIC_*` Clerk vars must be set in Vercel

### Judge0 Run/Submit fails

- Confirm RapidAPI subscription and env vars
- Check Vercel function logs for API route errors
