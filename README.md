# Postly Administration

In `NEXT_PUBLIC_APP_MODE=cloud`, this app redirects to `${CUSTOMER_APP_URL}/platform`, which uses the customer frontend's platform UI, backed by email-template-builder-be for sessions, database authorization, and audits. Configure the URL using `.env.example`. The connected administration area exposes actual users, workspaces, subscriptions, plans, template publishing, roles, and audit records according to the operator's role.

Run this frontend alongside the customer app with `npm run dev -- --port 3001`. It remains a Next.js app; no backend logic or provider credentials are stored here.

The original Postcraft admin demo is retained below and remains the default in demo mode. Its campaign, analytics, CMS, and other sample screens are not represented as live services. See the backend repository's `OPERATIONS.md` for provisioning and launch requirements.

# Postcraft Admin

A responsive Email Template Builder SaaS admin **demo**, built with Next.js App Router, React, TypeScript, Tailwind CSS, Lucide, and Recharts.

## Run

```sh
npm install
npm run dev
```

Visit http://localhost:3000. `npm run build`, `npm run typecheck`, and `npm run lint` validate the project.

## Architecture and initial inspection

The initial repository contained only `.git`: no framework, schema, authentication provider, API endpoints, components, or integrations existed. The final instruction requested dummy data and static integrations; this implementation therefore has no live backend, credentials, payments, or email sending.

- `app/[[...slug]]/page.tsx`: admin routes, rendered inside a shared shell.
- `components/admin-app.tsx`: sidebar, topbar, search, notifications, demo session, navigation.
- `components/dashboard.tsx`: illustrative KPIs, revenue chart, subscription distribution, recent users/activity, template previews.
- `components/management.tsx`: searchable/filterable/sortable/paginated demo tables, local record editing, plans, integrations, settings, and template library.
- `components/ui.tsx`: shared badges, avatars, dialogs, CSV download.
- `lib/data.ts`: typed demo fixtures.
- `app/globals.css`: responsive visual system.

## Routes

`/`, `/users`, `/workspaces`, `/templates`, `/categories`, `/plans`, `/subscriptions`, `/payments`, `/campaigns`, `/usage`, `/analytics`, `/cms`, `/support`, `/notifications`, `/roles`, `/audit`, `/integrations`, `/settings`.

## Demo behavior

Management data is filtered and paginated locally. Supported record edits persist in versioned browser localStorage and append demo audit entries. Billing, usage and audit tables are read-only. Template duplication/publication, plan prices/features, and platform settings persist locally. Integration checks explicitly simulate responses. CSV exports contain only demo data. All dashboard values are illustrative snapshots, not calculated platform accounting; date selection changes the displayed chart window. The dataset contains 30 days, so the 90-day selection shows all available sample points.

No real authorization is implemented. The displayed Super Admin identity and “Leave demo” action are interface demonstrations, not a security boundary. No secrets or passwords are requested. CMS content is rendered as plain text. No email is sent and no payment is processed.

## Production work remaining

Connect a server-validated auth provider and enforce a permission matrix at every service boundary: Super Admin (all), Operations (users/workspaces/templates/campaigns/usage), Billing (plans/subscriptions/payments), Support (restricted customers/tickets), Content (CMS/categories/templates). Replace fixtures with validated paginated services, tenant-scoped database policies, transactional append-only audits, quota enforcement, signed idempotent provider webhooks, and provider-specific billing workflows. Implement secure uploads, a real email document editor/version service, support delivery, CMS publishing, and production integration health checks. Add corresponding authorization, isolation, webhook, quota, and end-to-end tests before live use.

No migrations or environment variables are required for this demo.

## Verification

Production build, TypeScript, lint, and three CSV safety tests pass. Browser smoke checks cover user-edit persistence, template duplication, simulated provider checks, and mobile navigation with no runtime errors. Run `npm run test:browser` with the app running on port 3001 and Google Chrome installed.

The runtime dependency audit is clean after a PostCSS override. Five development-only advisories remain in the Next ESLint plugin → fast-glob → micromatch → braces chain; npm currently suggests a major downgrade, which is not applied automatically.
