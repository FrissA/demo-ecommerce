# Demo E-commerce

A demo store built on [Shopco](https://github.com/mohammadoftadeh/next-ecommerce-shopco) by Mohammad Oftadeh (MIT), extended with a **simulated checkout flow**: shipping info → payment → confirmation or failure. No real payments are made.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Redux Toolkit, Framer Motion and shadcn/ui.

## Run locally

```bash
npm install
npm run dev   # http://localhost:3000 (Turbopack)
```

## Checkout flow

1. Add products to the cart, then **Go to Checkout**.
2. **Information**: contact and shipping details (saved for next time).
3. **Payment**: card number, name, expiry and CVC, with formatting, brand detection and validation.
4. **Confirmation** (`/checkout/success`): order number, transaction ID and summary. The cart is cleared.
   **Failure** (`/checkout/failed`): the reason and error code. The cart is kept, and **Try Again** returns to payment.

Card details are never stored. The simulated processor lives in `src/lib/payment.ts`.

### Test cards

| Card number | Result |
|---|---|
| `4242 4242 4242 4242` (or any other valid number) | Success |
| `4000 0000 0000 0002` | Declined |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 0069` | Expired card |
| `4000 0000 0000 0119` | Processing error |

Use any future expiry (e.g. `12/30`) and any 3-digit CVC (4 digits for Amex).

## Swarm test hooks

Used by FrictionSwarm (jbecerra73/build101_grupo16) to test the store:

- Every page renders `<meta name="build-sha" content="…">` with the deployed commit (`COMMIT_REF`, inlined at build time; `dev` locally).
- The payment step lives at `/checkout?step=payment`, so shipping and payment are distinct funnel steps.
- The confirmation page marks the echoed required fields with `data-echo="email" | "address" | "card"` (card is masked, e.g. `Visa •••• 4242`).
- A `?swarm=<runId>&agent=<agentId>&persona=<personaId>` query tags the session as a swarm agent (see Analytics).

## Analytics

PostHog (`posthog-js`, `src/lib/analytics.ts`) with pageviews, page leaves, autocapture and rage clicks, plus these business events: `product_viewed`, `size_selected`, `add_to_cart_clicked`, `product_added`, `checkout_clicked`, `account_submitted`, `shipping_submitted`, `promo_applied`, `payment_submitted`, `order_completed`. The tracking plan lives in FrictionSwarm's `shared/analytics.ts`. No personal data (email, name, address, card) is sent as a property.

Every event carries `build_sha`, `font_scale` (root font size / 16) and `prefers_contrast`. Swarm sessions also carry `swarm_run`, `swarm_agent` and `swarm_persona`, kept for the browser session, and are identified as `swarm:<agentId>`. `window.posthog` is exposed so agents can capture `swarm_think_aloud` / `swarm_give_up` / `swarm_done`.

| Env var | Default |
|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | unset: tracking is off |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://us.i.posthog.com` |

For Netlify builds from CI, set them as repository **variables** and pass them in the deploy workflow's `env`.

## Deployment (CI/CD)

`.github/workflows/deploy.yml` deploys to Netlify from GitHub Actions:

- **Pull requests**: preview deploy at `pr-<number>--<site>.netlify.app`, with the URL posted as a PR comment
- **Push to `main`**: production deploy
- Without the secrets below, the workflow only builds (CI check)

Required repository secrets:

| Secret | Where to get it |
|---|---|
| `NETLIFY_AUTH_TOKEN` | Netlify → User settings → Applications → Personal access tokens |
| `NETLIFY_SITE_ID` | Netlify → Site configuration → Site details → Site ID |

## License

MIT, see [LICENSE](LICENSE). Original design and code by Mohammad Oftadeh and Hamza Naeem.
