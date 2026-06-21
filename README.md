# UChat Shared Database

Shared Drizzle database layer for UChat services.

## Setup

```bash
npm install
```

## Build

```bash
npm run build
```

## Database Commands

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

Set `DATABASE_URL` before running database commands.

## Schema And Migration Workflow

Use this workflow whenever the database schema changes.

### 1. Update The Submodule

From a service repo, for example `uchat-api-bl`:

```bash
cd /Users/ndanh/sites/uchat/uchat-api-bl
git submodule update --init --recursive
```

Then update the shared database submodule:

```bash
cd shared-database
git checkout main
git pull
npm install
```

### 2. Change The Schema

Edit:

```text
shared-database/src/schema.ts
```

Add or update tables, columns, enums, indexes, and relations there.

### 3. Generate A Migration

From `shared-database`:

```bash
npm run db:generate
```

This creates new migration files under:

```text
shared-database/drizzle/
```

Review the generated SQL before applying it. Be careful with destructive SQL such as `DROP TABLE`, `DROP COLUMN`, or type changes that can lose data.

### 4. Apply The Migration

Set `DATABASE_URL` if it is not already available:

```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/database"
```

Then run:

```bash
npm run db:migrate
```

You can also run migrations from `uchat-api-bl` because its scripts forward to the submodule:

```bash
cd /Users/ndanh/sites/uchat/uchat-api-bl
npm run db:migrate
```

### 5. Verify Builds

Build the shared package:

```bash
cd /Users/ndanh/sites/uchat/uchat-api-bl/shared-database
npm run build
```

Build the service that uses the schema change:

```bash
cd /Users/ndanh/sites/uchat/uchat-api-bl
npm run build
```

If `uchat-rag-engine` also uses the updated schema, build it too:

```bash
cd /Users/ndanh/sites/uchat/uchat-rag-engine
git submodule update --init --recursive
npm run build
```

### 6. Commit And Push The Shared Database Repo

Commit schema and migration changes inside the submodule first:

```bash
cd /Users/ndanh/sites/uchat/uchat-api-bl/shared-database
git status
git add src/schema.ts drizzle
git commit -m "feat: update database schema"
git push
```

If package files changed, include them too:

```bash
git add package.json package-lock.json
```

### 7. Commit The Submodule Pointer In The Service Repo

After pushing `shared-database`, commit the updated submodule pointer in the service repo:

```bash
cd /Users/ndanh/sites/uchat/uchat-api-bl
git status
git add shared-database package-lock.json
git commit -m "chore: update shared database submodule"
git push
```

If the service code changed to use the new schema, include those files too:

```bash
git add src shared-database package-lock.json
git commit -m "feat: use updated database schema"
git push
```

### 8. Update Other Services

For another service, such as `uchat-rag-engine`, update the submodule to the pushed shared database commit:

```bash
cd /Users/ndanh/sites/uchat/uchat-rag-engine/shared-database
git checkout main
git pull
npm install
```

Then commit the pointer in that service repo:

```bash
cd /Users/ndanh/sites/uchat/uchat-rag-engine
npm install
npm run build
git add shared-database package-lock.json
git commit -m "chore: update shared database submodule"
git push
```

## Rules

- Schema and migration SQL are owned by `uchat-shared-database`.
- Service repos commit only the submodule pointer, service code changes, and lockfile changes.
- Do not edit `node_modules/@uchat/shared-database` directly.
- Do not generate migrations in `uchat-api-bl/drizzle` or `uchat-rag-engine/drizzle`.
- After cloning or pulling a service repo, run `git submodule update --init --recursive`.
