---
name: react-standards
description: >
  Applies arch-decisions React and TypeScript standards. Use when writing or
  editing frontend components, hooks, forms, data fetching, mutations, routing,
  accessibility, or frontend tests. Covers state ownership, TanStack Query,
  Zod, and feature boundaries. Read reference.md for extended code samples.
---

# React standards

This is a React + TypeScript frontend. Write production code: readable, typed, testable, and accessible. Prefer simple code over clever abstractions.

Extended samples live in [reference.md](reference.md). Folder placement also follows the `frontend-structure` skill. Test names and Arrange/Act/Assert follow the `test-structure` skill.

## Core

- Function components only. TypeScript everywhere. No `any`.
- Do not add an abstraction before it is useful.
- Small, focused components. Composition over inheritance and configuration objects.
- No class components, HOCs, or render props unless explicitly requested.
- Do not hide complexity in magic hooks or god components.
- Explicit data flow. No implicit global state.
- Do not define components inside other components unless there is a strong reason.

## Mental model

- Render is a snapshot. Props flow down.
- State belongs to the component that owns the change.
- Derived values are calculated during render.
- A re-render is normal. It is not automatically a performance problem.
- Component identity is type, position, and `key`. Use `key` to preserve or reset state.

## State ownership

Pick the tool from the kind of state:

- Local UI (`isModalOpen`, `selectedTab`) → `useState`
- Server state (API lists, `currentUser` from `/me`) → TanStack Query
- Derived (`isFormValid`, `fullName`, filtered or sorted lists, totals) → calculate during render
- URL state (search, page, sort, shareable tab) → search params
- Form fields → `useState`, or React Hook Form when the form is complex
- Global client state → Context, Zustand, or Redux only when truly needed
- Mutable non-UI value (timer id) → `useRef`

Do not put everything into Redux, Context, or one global store.

## useEffect

Use `useEffect` only to synchronize React with an external system: `document.title`, `localStorage`, browser events, timers, WebSockets, third-party imperative APIs, manual DOM.

Do not use `useEffect` for derived values, filtering, sorting, validation derived from fields, user events, copying props into state, form submit, navigation after a direct user action, or a basic API GET (use TanStack Query).

## Data fetching

Default flow: page or container → feature hook → API service → backend.

- Do not fetch inside presentational components.
- Do not store API data in Redux by default.
- Every API parameter belongs in `queryKey`.
- Handle loading, error, empty, and success explicitly.
- Use `refetch` for a manual refresh.
- Lists and tables receive data through props.
- Service functions have typed inputs and outputs.
- Query hooks are named `useUsersQuery`, `useUserQuery`, `useCurrentUserQuery`.

## Mutations

POST, PUT, PATCH, and DELETE use `useMutation`.

Flow: user action → mutation → disable the action while pending → `onSuccess` invalidates related queries → toast if useful → handle errors.

Optimistic updates only when the UX needs an immediate response, rollback is safe, and business risk is low (like, checkbox, mark as read). Not for payments, orders with critical validation, legal documents, or irreversible actions.

## API layer

No raw `fetch` inside UI components. Services live in `features/<name>/services/`.

A service function is typed, checks `response.ok`, throws a meaningful error, and returns typed data. Validate external JSON with Zod when the payload is untrusted.

## Zod

TypeScript does not validate runtime JSON. Use Zod for form validation, API response validation, unknown external data, and shared schemas. Infer the type with `z.infer`. Do not keep a hand-written type and a separate manual validator.

## Components and boundaries

- Page or container: load data, compose the screen, handle states.
- Feature component: knows domain concepts. Lives in `features/*/components/`.
- Shared UI: generic blocks only (`Button`, `Modal`, `Input`, `Card`, `Badge`, `Tooltip`, `EmptyState`, `ErrorState`, `Skeleton`) in `shared/ui/`.
- A shared component must be usable in another project without this domain.

Dependency direction: `app` → `pages` → `features` → `shared`. Pages may use shared. Shared must not import features, business types, or feature APIs.

Presentational tables, cards, and lists take data as props. The page owns the query.

## Forms

Simple forms: controlled inputs, local state, validation during render, submit in `onSubmit`, semantic HTML. Do not submit from `useEffect`.

Complex forms (many fields, nested fields, field arrays, touched/dirty/errors, schema validation): React Hook Form + Zod. React Hook Form owns form state. `useMutation` sends the valid data.

## URL state

Search, page, sort, filters, and a shareable selected tab live in search params. If state should survive refresh or be shared, use the URL. If it affects the API response, include it in `queryKey`.

Draft filters stay in form or local state. Applied filters are the URL. The query key uses applied filters.

## Tables

Separate data fetching, URL filters, rendering, row actions, selection, and permissions. Page, sort, and filters are URL state. Selected and expanded rows are local state. Data is TanStack Query. The table model is TanStack Table when the table is complex. Query and Table are different tools. Do not build a table engine by hand unless necessary.

## Modals

Generic shell in `shared/ui/Modal.tsx`. Business modal in the feature. Open state lives in the closest owner, usually `useState`. Not in Redux by default.

A production modal has `role="dialog"`, `aria-modal="true"`, a title, a close button, Escape, focus management, focus return, and scroll lock when needed. Prefer Radix Dialog, Headless UI Dialog, or React Aria for a complex modal.

## Toasts

A toast is a short notice, not state. Use it after a mutation, a copy, or a saved setting. Important screen states still render in the page (`ErrorState` with retry when users fail to load). After a successful mutation, invalidate the query and then toast. Do not toast and leave stale data.

## Auth and permissions

`currentUser` is server state: `GET /me` via `useCurrentUserQuery`. Login and logout invalidate `['current-user']`. Do not cache the user once in Redux and skip the backend.

A protected route handles loading, authenticated, and unauthenticated. Show a skeleton while the session loads. Do not redirect before loading finishes.

Prefer httpOnly secure cookies. Frontend permission checks are UX only. The backend enforces them.

Check permissions, not hardcoded roles: `can(user, 'users:delete')`. Roles group permissions. Permissions are the capabilities.

## TypeScript

Type props, event handlers, API responses, service inputs and outputs, hook returns, mutation inputs, query params, and form values.

Avoid `any`, `object`, `Function`, and `as unknown as User`. Prefer `unknown` plus narrowing, specific signatures, and domain types.

## Hooks and refs

A custom hook extracts reusable stateful behavior. It does not hide a page. Good: `useDisclosure`, `useDebouncedValue`, `useUsersQuery`, `useCreateUserMutation`, `useDocumentTitle`. A pure calculation is a function, not a hook. Do not build a god hook that fetches, filters, opens modals, deletes, navigates, and toasts.

`useRef` is for DOM, focus, scroll, measurements, timer ids, mutable values that must not render, and imperative third-party APIs. UI state uses `useState`.

## Performance

Do not add `useMemo`, `useCallback`, or `React.memo` by default. Use them for a measured cost, an expensive computation, a large list, a memoized child that needs stable props, or a third-party API that depends on reference equality.

Do not lazy-load tiny components. Lazy-load routes, heavy charts, maps, editors, admin-only sections, and large rarely opened modals.

`React.lazy` and `Suspense` load component code. TanStack Query `isLoading` means data is loading. Do not use Suspense as the default API loading state.

## Errors and races

Expected API errors render `ErrorState` with retry. Error Boundaries are for unexpected runtime errors, placed at app, route, or an unstable widget. An Error Boundary is not the primary API error strategy.

Prefer TanStack Query and a correct `queryKey` over a manual `fetch` inside `useEffect`. A manual async effect must ignore stale results (`AbortController`, cleanup, or a stale flag).

## Accessibility

Semantic HTML first. `<button>` for buttons. Labels on inputs. `aria-label` on icon-only buttons. Dialog roles on modals. `aria-invalid` and `aria-describedby` on form errors. Visible focus. Accessibility should make the UI easier to test.

## Frontend tests

Test what the user can see or do. Prefer `getByRole`, `getByLabelText`, and `getByText`. Do not assert internal state or private functions. Use `data-testid` only when an accessible query is not practical.

## Rendering model

Choose on purpose. CSR for private dashboards behind login. SSR for public dynamic pages that need SEO or request-time data. SSG for docs, blogs, and rarely changing marketing pages. A private dashboard without SEO is a strong fit for React + Vite + React Router + TanStack Query.

If this were Next.js App Router: Server Components by default, `'use client'` only for browser interactivity, and a small client boundary. Do not mark a whole page as client because one button is interactive. This repo is the Vite frontend unless a task says otherwise.

## Hydration

Do not render `new Date()`, `Math.random()`, `window`, `localStorage`, timezone formatting, or browser-only conditions during the first server/client render. Read browser-only data after mount, or from a server-safe source such as cookies.

## Before finishing

- Is state in the right place, and is server state in TanStack Query?
- Is every query parameter in `queryKey`? Do mutations invalidate related queries?
- Are derived values calculated during render? Is this `useEffect` actually an external sync?
- Are props, events, and API inputs/outputs typed? Is Zod needed for runtime data?
- Are loading, error, empty, and success handled? Is the component accessible and easy to test?
- Is this abstraction needed? Is the file in page, feature, or shared?
- Is performance work tied to a real cost? Would another senior follow this code?
