# @repo/db

Shared database package for the monorepo using `Drizzle ORM` and `Supabase (Postgres)` as the database. This package provides a centralized way to manage database connections, models, migrations, and seeders across all applications in the monorepo.

WIP - Current implementation has no authorization and application logic yet. It is a basic setup to get started with `Drizzle ORM` and `Supabase`.

TODO:

- Configure to work with `Clerk` for authentication and authorization
- Implement application logic for the database models

## What's inside?

This repo uses `Drizzle ORM` for database interactions and includes the following:

### Apps and Packages

- `drizzle-orm`: ORM for TypeScript and JavaScript
- `@drizzle-orm/postgres`: Postgres driver for Drizzle ORM
- `drizzle-kit`: Tool for generating migrations and managing the database schema
- `@faker-js/faker`: Library for generating fake data for seeding the database

### Structure

The database package is structured as follows:

```
src/
├── queries/                # Database queries
│   ├── products.ts         # Example product query
│   └── users.ts            # Example user query
├── schema/                 # Database models
│   ├── column.helpers.ts   # Helper functions for column definitions
│   ├── products.ts         # Example product models
│   └── user.ts             # Example user model
├── seeders/                # Database migration files
│   ├── products.ts         # Example product seeder
│   ├── seed.ts             # Main seeder file
│   └── user.ts             # Example user seeder
├── database.ts             # Database connection and initialization
└── index.ts                # Database schema exports
supabase/                   # Supabase configuration and migrations
    ├── migrations/         # Database migration files
    │   └── *.sql           # Example migration file
    ├── seed.sql            # SQL file for seeding the database
    └── config.toml         # Supabase configuration file
```

### Local Supabase Instance

To run a local Supabase instance, you need to have the Supabase CLI installed

https://supabase.com/docs/guides/local-development/cli/getting-started

Some commands to manage the local Supabase instance:

- `npx supabase init`: Initialize Supabase in the monorepo
- `npx supabase login`: Log in to your Supabase account
- `npx supabase link`: Link the Supabase project to the monorepo
- `npx supbase start`: Start the Supabase local development server using Docker. Docker must be installed and running.
- `npx supabase stop`: Stop the Supabase local development server

### Development Commands

- `turbo run db:check`: Check the database schema against the models
- `turbo run db:generate`: Generate database schema and types
- `turbo run db:migrate`: Run database migrations
- `turbo run db:push`: Push the current schema to the database
- `turbo run db:pull`: Pull the current schema from the database
- `turbo run db:reset`: Reset the online database. Connection to the online Supabase DB with Supabase CLI is required; Database password is required in `.env` file; `turbo run db:generate` must be run before this command to ensure the database schema is up-to-date, as the CLI will look for the migrations sql in the supabase directory.
- `turbo run db:seed`: Seed the database with initial data

### Usage

WIP

To use the database package in your applications, you can import the necessary modules and functions from the `@repo/db` package. For example:

### Known Issues

_Please install latest version of "drizzle-orm"_

- For `npm` users, run `npm install --force drizzle-kit drizzle-orm` in root of monorepo
- remove the entries in `package.json` file and run `npm install` again
- https://github.com/drizzle-team/drizzle-orm/issues/2699#issuecomment-2660850530
