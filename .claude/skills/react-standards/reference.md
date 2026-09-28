# React standards — examples

Read this when a rule in SKILL.md needs a concrete sample. The normative rules stay in SKILL.md.

## Derived value, not useEffect

```tsx
const fullName = `${firstName} ${lastName}`;
```

Do not `setFullName` inside `useEffect` when `firstName` or `lastName` changes.

## Query key includes every parameter

```tsx
useQuery({
  queryKey: ['users', { search, page, sort }],
  queryFn: () => fetchUsers({ search, page, sort }),
});
```

A key of `['users']` while `fetchUsers` receives search, page, and sort is wrong.

## Invalidate after a mutation

```tsx
queryClient.invalidateQueries({ queryKey: ['users'] });
```

## Typed API service

```tsx
async function fetchUsers(params: FetchUsersParams): Promise<User[]> {
  const response = await fetch('/api/users');

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}
```

## Zod schema, then inferred type

```tsx
const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;
```

## Page owns the query, table receives props

```tsx
function UsersPage() {
  const { data: users = [], isLoading, isError } = useUsersQuery();

  if (isLoading) return <UsersSkeleton />;
  if (isError) return <ErrorState />;

  return <UsersTable users={users} />;
}
```

Do not call `useUsersQuery` inside `UsersTable`.

## Feature layout

```txt
features/users/
  components/
  hooks/
  services/
  types.ts
  UsersPage.tsx
```

App layout:

```txt
src/
  app/
  pages/
  features/
  shared/
    ui/
    lib/
    api/
```

In this repo those folders live under `frontend/src/`.

## Form submit

```tsx
<form onSubmit={handleSubmit}>
  <button type="submit">Submit</button>
</form>
```

## Protected route

```tsx
if (isLoading) return <PageSkeleton />;
if (!user) return <Navigate to="/login" />;

return <Outlet />;
```

Do not redirect on `!user` before the session query finishes.

## Permissions

```tsx
type Permission =
  | 'users:create'
  | 'users:delete'
  | 'orders:refund'
  | 'reports:view';

function can(user: CurrentUser, permission: Permission): boolean {
  return user.permissions.includes(permission);
}
```

Prefer `can(user, 'users:delete')` over `user.roles.includes('admin')`.

## Typed events

```tsx
function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
  event.preventDefault();
}

function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
  setValue(event.currentTarget.value);
}
```

## Pure function, not a hook

```tsx
function getUserFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`;
}
```

## Derived validity

```tsx
const isValid = email.includes('@') && password.length >= 8;
```

Do not store `isValid` in state and update it from `useEffect`.

## Code splitting

```tsx
const ReportsPage = lazy(() => import('./ReportsPage'));

<Suspense fallback={<ReportsSkeleton />}>
  <ReportsPage />
</Suspense>
```

`lazy` loads the component chunk. It does not mean the API data is loading.

## Accessible icon button

```tsx
<button aria-label="Delete user">
  <TrashIcon />
</button>
```

Do not use a clickable `div`.

## Behavior test

```tsx
await user.click(screen.getByRole('button', { name: 'Create user' }));

expect(
  screen.getByRole('dialog', { name: 'Create user' })
).toBeInTheDocument();
```

Do not assert `isModalOpen === true`.

## Browser-only value after mount

```tsx
function CurrentTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);

  if (time === null) {
    return <p>Loading time...</p>;
  }

  return <p>{time}</p>;
}
```

Do not call `new Date().toLocaleTimeString()` during the first render.

## Default decisions

```txt
API GET                         -> TanStack Query
API POST / PATCH / DELETE       -> useMutation
modal open                      -> local useState
search / page / sort            -> URL search params
login form fields               -> form state
complex form                    -> React Hook Form + Zod
currentUser                     -> useCurrentUserQuery
permission checks               -> permission helpers
simple derived value            -> calculate during render
expensive derived value         -> useMemo only if justified
DOM focus                       -> useRef
large list DOM problem          -> virtualization
large route bundle              -> lazy + Suspense
unexpected runtime error        -> Error Boundary
expected API error              -> ErrorState
success after mutation          -> toast + cache invalidation
```
