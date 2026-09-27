# Firebase to Supabase Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Firebase with Supabase for authentication and relational data while preserving the application's behavior and removing every runtime, configuration, script, and dependency tie to Firebase.

**Architecture:** A repository-owned Supabase SQL migration creates normalized `users`, `tasks`, and `states` tables protected by per-operation RLS policies. Existing service and DAL boundaries remain, but their implementations use a typed Supabase client and ISO/date strings instead of Firestore documents and timestamps. PostgreSQL foreign keys own cascade behavior, and `tasks.user_id` is the only user-to-task relationship.

**Tech Stack:** React 18, TypeScript, Vite, Supabase JavaScript 2.116, PostgreSQL, Supabase Auth, React Query

**Spec:** `docs/superpowers/specs/2026-09-24-firebase-to-supabase-design.md`

## Global Constraints

- Do not migrate any Firebase data or Firebase Auth accounts.
- Preserve the user's current uncommitted Supabase Google OAuth and sign-in UI changes.
- Do not add new automated tests; update the existing state fixture only as required by the new status type.
- Do not add dependencies; `@supabase/supabase-js` is already present in the working tree.
- Do not create commits unless the user explicitly requests them.
- Keep code, documentation, database identifiers, and user-facing application copy in English.
- Add English TSDoc to every new TypeScript function, without periods at the ends of description lines.
- Do not read or print local `.env` values.

## Review Focus

- A signed-in user must never read or mutate another user's profile, tasks, or states; review every grant and RLS expression against this condition.
- A state must not be insertable or movable under a task owned by another user; review the task-ownership subquery in state insert and update policies.
- Users already present in Supabase Auth must receive a profile row during migration without overwriting an existing profile.
- Week 53 and order 0 must satisfy database constraints and continue to work in weekly task queries.
- `date_key` must remain a calendar date across timezones while `date` and `created_at` remain valid instants represented as ISO strings.

Because the approved scope forbids new tests, these conditions are verified through SQL review, existing tests, TypeScript compilation, lint, the production build, and the final diff review.

---

### Task 1: Add the Supabase schema and typed client contract

**Files:**

- Create: `supabase/migrations/20260925000000_create_running_list_schema.sql`
- Create: `src/shared/config/database.types.ts`
- Modify: `src/shared/config/supabase.config.ts`
- Modify: `src/vite-env.d.ts`
- Modify: `.env.example`
- Modify: `README.md`

**Interfaces:**

- Produces: PostgreSQL tables `public.users`, `public.tasks`, and `public.states`
- Produces: PostgreSQL enum `public.state_status`
- Produces: `Database` type consumed by the shared Supabase client and entity DTOs
- Produces: typed `supabase` client configured by `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

- [ ] **Step 1: Create the relational schema and ownership constraints**

Create `supabase/migrations/20260925000000_create_running_list_schema.sql` with the full schema, profile trigger, backfill, grants, and policies:

```sql
create type public.state_status as enum (
  'empty',
  'completed',
  'partially_completed',
  'delayed',
  'failed'
);

create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  email text not null
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  user_id uuid not null references public.users (id) on delete cascade,
  week integer not null check (week between 1 and 53),
  year integer not null,
  color text not null,
  "order" integer not null check ("order" >= 0),
  created_at timestamptz not null default now()
);

create table public.states (
  id uuid primary key default gen_random_uuid(),
  date timestamptz not null,
  date_key date not null,
  status public.state_status not null,
  task_id uuid not null references public.tasks (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade
);

create index tasks_user_week_order_idx
  on public.tasks (user_id, year, week, "order");
create index states_user_date_idx on public.states (user_id, date_key);
create index states_task_idx on public.states (task_id);
```

- [ ] **Step 2: Add profile synchronization and conflict-safe backfill**

Append the following trigger and backfill to the migration:

```sql
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, name, email)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      new.email
    ),
    coalesce(new.email, '')
  )
  on conflict (id) do update
  set name = excluded.name,
      email = excluded.email;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into public.users (id, name, email)
select
  id,
  coalesce(
    raw_user_meta_data ->> 'full_name',
    raw_user_meta_data ->> 'name',
    email
  ),
  coalesce(email, '')
from auth.users
on conflict (id) do nothing;
```

Google OAuth supplies email addresses. The empty-string fallback keeps the
application's required `email: string` contract deterministic if an unexpected
auth row lacks an email value.

- [ ] **Step 3: Add grants and one RLS policy per operation**

Append explicit privileges and policies:

```sql
alter table public.users enable row level security;
alter table public.tasks enable row level security;
alter table public.states enable row level security;

revoke all on table public.users, public.tasks, public.states
  from anon, authenticated;
revoke all on type public.state_status from anon;

grant select, insert, update on table public.users to authenticated;
grant select, insert, update, delete on table public.tasks, public.states
  to authenticated;
grant usage on type public.state_status to authenticated;

create policy "users_select_own"
  on public.users for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = id);

create policy "users_insert_own"
  on public.users for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = id);

create policy "users_update_own"
  on public.users for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = id);

create policy "tasks_select_own"
  on public.tasks for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "tasks_insert_own"
  on public.tasks for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "tasks_update_own"
  on public.tasks for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "tasks_delete_own"
  on public.tasks for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "states_select_own"
  on public.states for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "states_insert_own"
  on public.states for insert to authenticated
  with check (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
    and exists (
      select 1
      from public.tasks
      where tasks.id = states.task_id
        and tasks.user_id = (select auth.uid())
    )
  );

create policy "states_update_own"
  on public.states for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
    and exists (
      select 1
      from public.tasks
      where tasks.id = states.task_id
        and tasks.user_id = (select auth.uid())
    )
  );

create policy "states_delete_own"
  on public.states for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
```

- [ ] **Step 4: Define the browser-visible database types**

Create `src/shared/config/database.types.ts`. Use one `StateStatusValue` literal union, and describe `Row`, `Insert`, and `Update` for every table. The essential public shape is:

```ts
export type StateStatusValue =
  | 'empty'
  | 'completed'
  | 'partially_completed'
  | 'delayed'
  | 'failed';

export type Database = {
  public: {
    Tables: {
      users: {
        Row: { id: string; name: string | null; email: string };
        Insert: { id: string; name?: string | null; email: string };
        Update: { id?: string; name?: string | null; email?: string };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          user_id: string;
          week: number;
          year: number;
          color: string;
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          user_id: string;
          week: number;
          year: number;
          color: string;
          order: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          user_id?: string;
          week?: number;
          year?: number;
          color?: string;
          order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      states: {
        Row: {
          id: string;
          date: string;
          date_key: string;
          status: StateStatusValue;
          task_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          date: string;
          date_key: string;
          status: StateStatusValue;
          task_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          date?: string;
          date_key?: string;
          status?: StateStatusValue;
          task_id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { state_status: StateStatusValue };
    CompositeTypes: { [_ in never]: never };
  };
};
```

- [ ] **Step 5: Type the Supabase client and environment contract**

Update the client:

```ts
import { createClient } from '@supabase/supabase-js';

import type { Database } from './database.types';

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { flowType: 'pkce' } },
);
```

Extend `src/vite-env.d.ts` with `ImportMetaEnv` declarations for the two required Supabase variables and `VITE_APP_DISABLED`. Replace the Firebase keys in `.env.example` with:

```dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Set to true and redeploy to temporarily disable the entire application
VITE_APP_DISABLED=false
```

- [ ] **Step 6: Document project setup without claiming the remote migration ran**

Expand `README.md` with exact setup steps: install with `npm ci`, copy `.env.example` to `.env`, provide the Supabase URL and browser-safe anon/publishable key, run the SQL file in the Supabase SQL Editor, enable Google Auth, configure local and production redirect URLs, and start with `npm run dev`.

- [ ] **Step 7: Check the schema task diff**

Run:

```bash
git diff --check -- \
  supabase/migrations/20260925000000_create_running_list_schema.sql \
  src/shared/config/database.types.ts \
  src/shared/config/supabase.config.ts \
  src/vite-env.d.ts .env.example README.md
```

Expected: exit code 0 and no whitespace errors. Do not report the SQL migration as applied to a remote project.

---

### Task 2: Migrate application profiles and auth hydration

**Files:**

- Modify: `src/entities/user/api/dto/user.dto.ts`
- Modify: `src/entities/user/model/types/user.type.ts`
- Modify: `src/entities/user/api/mappers/user-to-user-dto.mapper.ts`
- Modify: `src/entities/user/api/mappers/user-dto-to-user.mapper.ts`
- Modify: `src/entities/user/api/users.service.ts`
- Modify: `src/entities/auth/model/auth.dal.ts`

**Interfaces:**

- Consumes: typed `supabase` client and `Database['public']['Tables']['users']`
- Produces: normalized `User` and `UserDto` with only `id`, `email`, and `name`
- Produces: auth-state hydration through `UsersDal.getUser(userId)`

- [ ] **Step 1: Remove the denormalized task list from user types and mappers**

Set both models to the normalized shape:

```ts
export interface User {
  id: string;
  email: string;
  name: string | null;
}
```

Make `UserDto` an alias of the typed database row:

```ts
import type { Database } from '@/shared/config/database.types';

export type UserDto = Database['public']['Tables']['users']['Row'];
```

Update both mappers so they copy only `id`, `email`, and `name`. Remove every `taskIds` and `task_ids` reference.

- [ ] **Step 2: Replace Firestore profile calls with Supabase queries**

Implement `UsersService` with explicit error checks:

```ts
import { supabase } from '@/shared/config';

import { UserDto } from './dto/user.dto';

export class UsersService {
  public static async getUser(id: string): Promise<UserDto | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  public static async createUser(userDto: UserDto): Promise<void> {
    const { error } = await supabase.from('users').insert(userDto);
    if (error) throw error;
  }

  public static async updateUser(userDto: UserDto): Promise<void> {
    const { id, ...updates } = userDto;
    const { error } = await supabase.from('users').update(updates).eq('id', id);
    if (error) throw error;
  }
}
```

- [ ] **Step 3: Hydrate Redux from the public profile**

Remove the local Supabase-user-to-domain mapper from `auth.dal.ts`. Restore the original profile boundary by importing `UsersDal` and making `onLogin` asynchronous:

```ts
return AuthService.listenAuthStateChange({
  onLogin: async (supabaseUser) => {
    onLoad(true);

    try {
      const user = await UsersDal.getUser(supabaseUser.id);
      if (!user) throw new Error('User profile was not found');
      dispatch(setUser(user));
    } catch {
      notify.error('Could not load your account. Try reloading the page');
      dispatch(unsetUser());
    } finally {
      onLoad(false);
    }
  },
  onLogout: () => {
    dispatch(unsetUser());
    onLoad(false);
  },
});
```

Keep the current Supabase logout, Google OAuth redirect, generic auth errors, and subscription cleanup.

- [ ] **Step 4: Compile the profile boundary**

Run:

```bash
npx tsc -b --pretty false
```

Expected: no `taskIds`, `task_ids`, Firebase user, or user DTO type errors. If other data services still fail because Tasks 3 and 4 have not run, record only those known remaining Firebase errors and continue; do not weaken the user types.

---

### Task 3: Replace the task data layer

**Files:**

- Modify: `src/entities/tasks/api/dto/task.dto.ts`
- Modify: `src/entities/tasks/api/mappers/task-dto-to-task.mapper.ts`
- Modify: `src/entities/tasks/api/mappers/task-to-task-dto.mapper.ts`
- Modify: `src/entities/tasks/api/tasks.service.ts`
- Modify: `src/entities/tasks/model/tasks.dal.ts`

**Interfaces:**

- Consumes: `Database['public']['Tables']['tasks']` and typed `supabase`
- Produces: ordered task rows scoped by user, year, and week
- Produces: task create/update results returned in one request
- Produces: one-request task deletion with database-owned state cascade

- [ ] **Step 1: Replace the Firestore task DTO and timestamp conversions**

Alias `TaskDto` to the database row:

```ts
import type { Database } from '@/shared/config/database.types';

export type TaskDto = Database['public']['Tables']['tasks']['Row'];
```

Change `converterTaskDtoToTask` to use `new Date(taskDto.created_at)`. Change `convertedTaskToTaskDto` to use `task.createdAt.toISOString()`.

- [ ] **Step 2: Implement ordered Supabase task queries**

Replace `tasks.service.ts` with Supabase methods that check every error:

```ts
import { supabase } from '@/shared/config';

import { TaskDto } from './dto/task.dto';

type TaskDtoWithoutId = Omit<TaskDto, 'id'>;

export class TasksService {
  public static async getTasksByUserIdYearWeek(
    userId: string,
    week: number,
    year: number,
  ): Promise<TaskDto[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('year', year)
      .eq('week', week)
      .order('order', { ascending: true });

    if (error) throw error;
    return data;
  }

  public static async createAndGetTask(
    taskDtoWithoutId: TaskDtoWithoutId,
  ): Promise<TaskDto> {
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskDtoWithoutId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  public static async updateTask(taskDto: TaskDto): Promise<TaskDto> {
    const { id, ...updates } = taskDto;
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  public static async deleteTask(
    taskId: string,
    userId: string,
  ): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId);

    if (error) throw error;
  }
}
```

Remove Firestore collection constants, batch limits, manual state cleanup, and `getTaskById`. PostgreSQL performs the state cascade.

- [ ] **Step 3: Make the task DAL use ISO timestamps and returned updates**

In `createTask`, replace `Timestamp.fromDate(new Date())` with `new Date().toISOString()`. In `updateTask`, map the DTO returned by `TasksService.updateTask(taskDto)` instead of issuing `getTaskById`.

- [ ] **Step 4: Check task-layer types**

Run:

```bash
npx tsc -b --pretty false
```

Expected: no errors in `src/entities/tasks/**`. Remaining state-layer Firebase errors are resolved in Task 4.

---

### Task 4: Replace the state data layer and numeric statuses

**Files:**

- Modify: `src/entities/states/model/constants/state-status.ts`
- Modify: `src/entities/states/api/dto/state.dto.ts`
- Modify: `src/entities/states/api/mappers/state-dto-to-state.ts`
- Modify: `src/entities/states/api/mappers/state-to-state-dto.ts`
- Modify: `src/entities/states/api/states.service.ts`
- Modify: `src/entities/states/model/states.dal.ts`
- Modify: `src/pages/week-page/ui/state-cell.tsx`
- Modify: `src/pages/guide/ui/guide-page.tsx`
- Modify: `src/pages/week-page/lib/remove-state-from-tasks.test.ts`

**Interfaces:**

- Consumes: `Database['public']['Tables']['states']` and `StateStatusValue`
- Produces: `StateStatus.Empty`, `Completed`, `PartiallyCompleted`, `Delayed`, and `Failed`
- Produces: inclusive user/date-range state queries
- Produces: state create/update results returned in one request

- [ ] **Step 1: Replace the numeric enum with a typed string contract**

Use an `as const` object so existing property-style call sites remain readable and the derived type is structurally compatible with the database union:

```ts
import type { StateStatusValue } from '@/shared/config/database.types';

export const StateStatus = {
  Empty: 'empty',
  Completed: 'completed',
  PartiallyCompleted: 'partially_completed',
  Delayed: 'delayed',
  Failed: 'failed',
} as const satisfies Record<string, StateStatusValue>;

export type StateStatus = (typeof StateStatus)[keyof typeof StateStatus];
```

- [ ] **Step 2: Replace the Firestore state DTO and timestamp conversion**

Alias `StateDto` to the database row. Retain a comment explaining that `date_key` is a timezone-independent calendar day, but remove the legacy-tab and Firestore migration wording.

In `converterStateToStateDto`, serialize `date` with `state.date.toISOString()`. Keep `converterStateDtoToState` based on `parseISO(stateDto.date_key)` so UI calendar days do not shift across timezones.

- [ ] **Step 3: Implement Supabase state CRUD and date-range queries**

Replace `states.service.ts` with:

```ts
import { supabase } from '@/shared/config';

import { StateDto } from './dto/state.dto';

type StateDtoWithoutId = Omit<StateDto, 'id'>;

export class StatesService {
  public static async getStatesByUserIdDateRange(
    userId: string,
    fromDateKey: string,
    toDateKey: string,
  ): Promise<StateDto[]> {
    const { data, error } = await supabase
      .from('states')
      .select('*')
      .eq('user_id', userId)
      .gte('date_key', fromDateKey)
      .lte('date_key', toDateKey);

    if (error) throw error;
    return data;
  }

  public static async createAndGetState(
    stateWithoutIdDto: StateDtoWithoutId,
  ): Promise<StateDto> {
    const { data, error } = await supabase
      .from('states')
      .insert(stateWithoutIdDto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  public static async updateState(stateDto: StateDto): Promise<StateDto> {
    const { id, ...updates } = stateDto;
    const { data, error } = await supabase
      .from('states')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  public static async deleteState(stateId: string): Promise<void> {
    const { error } = await supabase.from('states').delete().eq('id', stateId);
    if (error) throw error;
  }
}
```

Remove `getStateById`; update operations already return the changed row.

- [ ] **Step 4: Make the state DAL use ISO timestamps and returned updates**

In `createState`, send `date: state.date.toISOString()`. In `updateState`, map the DTO returned by `StatesService.updateState(stateDto)` instead of issuing `getStateById`.

- [ ] **Step 5: Rename every status call site and visible label**

Use this mapping consistently:

| Old member | New member           | Stored value          | Visible label         |
| ---------- | -------------------- | --------------------- | --------------------- |
| `Empty`    | `Empty`              | `empty`               | `Empty`               |
| `FullDone` | `Completed`          | `completed`           | `Completed`           |
| `HalfDone` | `PartiallyCompleted` | `partially_completed` | `Partially completed` |
| `Delay`    | `Delayed`            | `delayed`             | `Delayed`             |
| `Failed`   | `Failed`             | `failed`              | `Failed`              |

Update `STATE_ICON_SRC`, dropdown values, handlers, guide status labels, descriptive alt text, and guide prose. Keep the existing SVG filenames because they are presentation assets rather than backend identifiers.

- [ ] **Step 6: Update the existing fixture without adding a test**

Import `StateStatus` as a value in `remove-state-from-tasks.test.ts` and replace:

```ts
status: 1 as StateStatus,
```

with:

```ts
status: StateStatus.Completed,
```

- [ ] **Step 7: Verify the state task**

Run:

```bash
npm test
npx tsc -b --pretty false
```

Expected: all existing tests pass and TypeScript reports no numeric-status or Firebase timestamp errors.

---

### Task 5: Remove Firebase and complete repository verification

**Files:**

- Delete: `firebase/`
- Delete: `src/shared/config/firebase.config.ts`
- Delete: `src/shared/models/constants/firebase-paths.ts`
- Delete: `src/shared/models/index.ts`
- Modify: `.env` key names only when the ignored local file still contains known Firebase variables
- Modify: `src/shared/config/index.ts`
- Modify: `src/app/providers/react-query-provider.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**

- Consumes: completed Supabase application data layer
- Produces: a repository whose runtime and tooling dependency graph contains no Firebase packages

- [ ] **Step 1: Remove Firebase-owned files and exports**

Delete the repository `firebase/` directory, `firebase.config.ts`, and the now-unused shared model constants. Remove the Firebase export from `src/shared/config/index.ts`. Keep the Supabase export and add a type export for `database.types.ts` only if consumers benefit from the barrel without creating import cycles.

- [ ] **Step 2: Remove Firebase scripts and packages**

Remove `migrate:task-order` and `migrate:states` from `package.json`. Remove `firebase` from dependencies and `firebase-tools` from devDependencies. Preserve every unrelated package entry and the user's existing `@supabase/supabase-js` addition.

- [ ] **Step 3: Regenerate only the lockfile metadata**

Run the package manager in lockfile-only mode so it does not modify `node_modules`:

```bash
npm install --package-lock-only --ignore-scripts
```

Expected: `package-lock.json` no longer contains `firebase`, `firebase-tools`, or `@firebase/*` packages, and `node_modules` is not rewritten.

- [ ] **Step 4: Remove the final Firestore-specific comment**

In `react-query-provider.tsx`, change “costs Firestore reads” to “causes unnecessary network requests” while preserving the cache behavior.

- [ ] **Step 5: Remove known Firebase keys from the ignored local environment**

Inspect only variable names, never values:

```bash
sed -E 's/=.*$/=/' .env
```

If present, mechanically remove lines for `VITE_FCM_DATABASE_URL`,
`VITE_FCM_KEY_PAIR`, `VITE_APP_ID`, `VITE_MESSAGING_SENDER_ID`,
`VITE_STORAGE_BUCKET`, `VITE_PROJECT_ID`, `VITE_AUTH_DOMAIN`, and
`VITE_API_KEY`. Preserve all other lines and values. Confirm that the key names
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` exist; if either is absent,
leave its value for the user to supply rather than copying or inventing a
secret.

- [ ] **Step 6: Confirm Firebase is absent from application and configuration files**

Run targeted searches that intentionally exclude the historical design and plan documents:

```bash
rg -n -i 'firebase|firestore' \
  src package.json package-lock.json .env.example README.md vite.config.ts \
  vercel.json || true
find firebase -type f -print 2>/dev/null
```

Expected: both commands produce no file matches. Also run:

```bash
rg -n 'taskIds|task_ids|FullDone|HalfDone|StateStatus\.Delay|status: [0-9]' src || true
```

Expected: no legacy relationship or numeric-status matches.

- [ ] **Step 7: Run the complete project verification**

Run each command separately and preserve its actual result:

```bash
npm test
npm run lint
npm run build
git diff --check
```

Expected: all commands exit with code 0. Report any pre-existing or unrelated failure by command and exact error instead of claiming success.

- [ ] **Step 8: Review user-owned changes and final scope**

Run:

```bash
git status --short
git diff --stat
git diff -- src/entities/auth src/pages/auth src/app/router/routes.tsx
```

Confirm that the existing Supabase Google OAuth, Google-only sign-in screen, route cleanup, and guide edits remain present. Confirm that no unrelated user-owned change was reverted. Do not stage or commit.

- [ ] **Step 9: Hand off the Supabase dashboard actions**

Report that the code migration is complete, link the SQL migration and README, and state clearly that the user still needs to run the SQL migration in their Supabase project and configure Google Auth redirect URLs. Do not claim remote database setup without evidence.
