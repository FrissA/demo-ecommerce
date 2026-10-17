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
