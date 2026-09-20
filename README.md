This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Stripe webhooks (local development)

The checkout flow needs a webhook to fulfill orders in Printify after payment. To test this locally, forward Stripe events to your dev server with the Stripe CLI:

1. Install the CLI: `npm install -g @stripe/cli` (or `brew install stripe/stripe-cli/stripe`)
2. Log in: `stripe login`
3. Authorize CLI access to the **Sandbox** matching your `STRIPE_SECRET_KEY` (not the Live account) — run `stripe reauth` and enable CLI for the sandbox in the browser page it opens
4. Select that sandbox context: `stripe switch context`
5. Start forwarding events:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe --events checkout.session.completed
   ```
6. Copy the printed `whsec_...` value into `.env.local` as `STRIPE_WEBHOOK_SECRET`. This secret stays the same across restarts of `stripe listen`, so you only need to do this once.

If `stripe listen` complains about live mode, your CLI is pointed at the wrong context — re-run `stripe switch context` and pick the sandbox, not the live account.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
