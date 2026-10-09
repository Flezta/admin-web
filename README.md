# React + TypeScript + Vite

## Order Operations

Admins and super-admins use `/orders`; hub admins use `/hub/orders`. Both provide All orders and Needs attention views, search, status/shop/date filters, pagination, details, and confirmed fulfilment actions. Admins also filter by hub and view payment/payout summaries. Refunds and payout execution are not included.

Super-admins assign one logistics hub through the user's Admin Actions section. Existing hub admins without a hub see an assignment-required state. The API enforces hub scope for reads and updates.

## Payments

Admins and super-admins use `/payments` for buyer payments, eligible vendor payouts, and completed manual vendor payments. Buyer payments support reference/email/order search, exact buyer database ID and order ID filters, status/date filters, and an attention view for successful payments with no linked order or order creation requiring review.

User profiles link to buyer payment history; shop profiles link to eligible payouts and completed payments. Order details link to buyer payments and vendor payment history. Payment details link back to buyer profiles, orders, shops, and the recording admin. Buyer profile links resolve stored database IDs to Firebase UIDs rather than matching email addresses. Opening payment details from a list preserves its filters and page on return.

Verification requires confirmation and may retry order creation without charging the buyer again. Vendor payments only record money already paid outside the app, for one vendor at a time, after the existing three-day delivered hold. Commission snapshots and duplicate-recording safeguards are retained. Completed financial records and refund history are read-only; provider transfers, refund recording/initiation, proof uploads, and financial record editing/deletion are outside this release.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
