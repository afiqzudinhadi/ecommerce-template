# Turborepo kitchen sink starter

This Turborepo starter is scaffolded at 2025/06/19 using the [kitchen-sink template](https://vercel.com/templates/monorepos/turborepo-kitchensink) which is maintained by the Turborepo core team. It is heavily modified as a starter template for new Turborepos e-commerce projects but could also be used as a general-purpose monorepo starter.

This example also shows how to use [Workspace Configurations](https://turborepo.com/docs/core-concepts/monorepos/configuring-workspaces).

## What's inside?

This Turborepo includes the following packages and apps:

### Apps and Packages

- `express-template`: an [Express](https://expressjs.com/) server
- `next-template`: a [Next.js](https://nextjs.org/) app
- `vite-template`: a [Vite](https://vitejs.dev/) single page app
- `remix-template`: a [Remix](https://remix.run/) app
- `@repo/eslint-config`: ESLint configurations used throughout the monorepo
- `@repo/typescript-config`: tsconfig.json's used throughout the monorepo
- `@repo/jest-presets`: Jest configurations
- `@repo/logger`: isomorphic logger (a small wrapper around console.log)
- `@repo/ui`: shared UI components for frontend use.
    - A dummy React UI library (which contains `<CounterButton>` and `<Link>` components)
    - And shadcn/ui components (which contains `<Button>` and `<Card>` components)

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting
- [shadcn/ui](https://ui.shadcn.com/docs/monorepo) for UI components
- [Tailwind CSS v4](https://tailwindcss.com/) for styling and to use shadcn/ui
