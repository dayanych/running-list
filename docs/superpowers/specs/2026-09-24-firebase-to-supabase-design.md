# Firebase to Supabase Migration Design

## Goal

Replace Firebase with Supabase as the application's only authentication and data backend while preserving the existing `users`, `tasks`, and `states` data model and user-visible behavior. Existing Firebase data will not be migrated.

## Scope

The migration covers:

- Supabase Google OAuth already being introduced in the working tree
- A reproducible Supabase SQL migration for the application schema
- Row Level Security for all public application tables
- Supabase implementations of the existing user, task, and state services
- String-based state statuses shared by PostgreSQL and TypeScript
- Removal of all Firebase source files, scripts, configuration, environment variables, dependencies, and lockfile entries

The current uncommitted authentication and sign-in UI changes are user-owned work. They will be preserved and completed rather than replaced.

No Firebase documents or accounts will be imported. Existing Supabase Auth users may be backfilled into `public.users` so the schema is internally consistent.

## Database Schema

The repository will contain a migration under `supabase/migrations/` that creates the following schema.

### State status

PostgreSQL type `public.state_status` contains these readable values:

- `empty`
- `completed`
- `partially_completed`
- `delayed`
- `failed`

The TypeScript `StateStatus` contract exposes the same string values through a
typed `as const` object and derived union type, preserving calls such as
`StateStatus.Completed` without duplicating a numeric mapping. Numeric statuses
are removed from the application and database.

### `public.users`

| Column  | Type   | Rules                                                             |
| ------- | ------ | ----------------------------------------------------------------- |
| `id`    | `uuid` | Primary key; references `auth.users(id)` with `ON DELETE CASCADE` |
| `name`  | `text` | Nullable                                                          |
| `email` | `text` | Required                                                          |

Task ownership is represented only by `tasks.user_id`. The former
`users.task_ids` array is removed from the database, DTO, domain model, and
mappers because it duplicates the relational foreign key and can become
inconsistent.

### `public.tasks`

| Column       | Type          | Rules                                                            |
| ------------ | ------------- | ---------------------------------------------------------------- |
| `id`         | `uuid`        | Primary key; defaults to `gen_random_uuid()`                     |
| `title`      | `text`        | Required                                                         |
| `user_id`    | `uuid`        | Required; references `public.users(id)` with `ON DELETE CASCADE` |
| `week`       | `integer`     | Required; between 1 and 53                                       |
| `year`       | `integer`     | Required                                                         |
| `color`      | `text`        | Required                                                         |
| `order`      | `integer`     | Required; non-negative                                           |
| `created_at` | `timestamptz` | Required; defaults to `now()`                                    |

An index on `(user_id, year, week, "order")` supports the weekly ordered task query.

### `public.states`

| Column     | Type                  | Rules                                                            |
| ---------- | --------------------- | ---------------------------------------------------------------- |
| `id`       | `uuid`                | Primary key; defaults to `gen_random_uuid()`                     |
| `date`     | `timestamptz`         | Required                                                         |
| `date_key` | `date`                | Required                                                         |
| `status`   | `public.state_status` | Required                                                         |
| `task_id`  | `uuid`                | Required; references `public.tasks(id)` with `ON DELETE CASCADE` |
| `user_id`  | `uuid`                | Required; references `public.users(id)` with `ON DELETE CASCADE` |

Indexes on `(user_id, date_key)` and `task_id` support weekly state loading and task-related operations.

## Profile Synchronization

An `AFTER INSERT` trigger on `auth.users` creates the corresponding `public.users` row. It copies the email and uses Google metadata in this order for the name:

1. `full_name`
2. `name`
3. email

The trigger function runs as `SECURITY DEFINER` with an empty search path and schema-qualified object names. The migration also inserts missing `public.users` rows for users already present in Supabase Auth, using conflict-safe insertion.

After authentication, the application loads the profile from `public.users` before placing it in Redux. This preserves the original application boundary between authentication identity and application user data.

## Authorization

Row Level Security is enabled on `users`, `tasks`, and `states`.

- `anon` receives no table privileges.
- `authenticated` receives only the operations used by the application.
- Users may select, insert, and update only their own `users` row. The insert
  permission keeps the existing service contract available, while the normal
  authentication flow relies on the database trigger.
- Users may select, insert, update, and delete only `tasks` whose `user_id` equals `(select auth.uid())`.
- Users may select, insert, update, and delete only `states` whose `user_id` equals `(select auth.uid())`.
- State inserts and updates also require the referenced task to belong to the authenticated user.
- Update policies use both `USING` and `WITH CHECK` so ownership cannot be reassigned.

Policies are defined separately for each operation to keep the allowed behavior explicit.

## Application Data Flow

The existing service and DAL boundaries remain in place:

- `UsersService`, `TasksService`, and `StatesService` query Supabase through the shared client.
- Every Supabase response checks `error` and throws it to the caller.
- Inserts and updates that need the resulting row use `.select().single()`.
- DTO mappers preserve the existing camelCase domain models and snake_case database rows.
- PostgreSQL timestamps cross the API as ISO strings and map to JavaScript `Date` values.
- `date_key` crosses the API as `yyyy-MM-dd` and continues to represent a calendar day independently of timezone.
- Deleting a task performs one delete request; PostgreSQL removes its states through `ON DELETE CASCADE`.

A typed Supabase `Database` definition describes the three tables and the status enum so service queries and DTOs share one schema contract.

## Authentication

The in-progress Google OAuth implementation remains the authentication method. The shared Supabase client uses PKCE, the sign-in page redirects to Google, the auth listener restores the session, and logout uses Supabase Auth.

On login, the auth DAL loads the matching `public.users` row. Failure to load a profile leaves the user signed out in application state and shows the existing account-loading error notification.

## Error Handling

Services expose Supabase failures by throwing the returned error. Existing React Query mutation and page-level error handling continues to determine user-facing feedback. Authentication failures keep the current generic notifications and do not expose provider or database details.

The migration does not add retry queues, offline persistence, or realtime subscriptions.

## Firebase Removal

The completed migration removes:

- `firebase` and `firebase-tools` from `package.json` and `package-lock.json`
- `src/shared/config/firebase.config.ts`
- Firebase exports from shared configuration
- Firebase collection-path constants and exports
- the repository's `firebase/` migration scripts and documentation
- Firebase-specific timestamps, imports, comments, scripts, and environment variables

`.env.example` will replace the Firebase keys with `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` while retaining `VITE_APP_DISABLED`. Local `.env`
secrets are not read or printed; known Firebase key lines may be removed and
the two Supabase key names may be added without exposing their values.

## Verification

No new automated tests will be added, per the approved scope. Completion requires:

- running the existing test suite
- running ESLint
- running the production TypeScript/Vite build
- searching application, configuration, dependency, and lock files to confirm
  that no Firebase references remain; the design and implementation-plan
  documents are retained as historical migration records
- reviewing the final diff to ensure the existing user-owned Supabase Auth and UI changes remain intact

Database behavior that requires a live Supabase project will be documented for application of the SQL migration; the implementation will not silently claim a remote migration was applied.
