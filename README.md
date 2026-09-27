# Running List

Weekly task tracking application.

## Local setup

```bash
npm ci
```

Copy `.env.example` to `.env`, then set:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-browser-safe-anon-or-publishable-key
VITE_APP_EMAIL=your-support-email@example.com
VITE_APP_URL=https://runninglist.app
```

The support email is shown in the application footer and on the public privacy
and terms pages. Set the same variables in the production deployment.

Run `supabase/migrations/20260925000000_create_running_list_schema.sql` in
the Supabase SQL Editor. The migration creates the application tables, profile
trigger, indexes, and Row Level Security policies.

In Supabase Auth, enable the Google provider and add both the local application
URL and the production application URL to the allowed redirect URLs.

Start the application:

```bash
npm run dev
```
