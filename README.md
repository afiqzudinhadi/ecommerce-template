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
    - Building the UI will require exporting the components in the `package.json` file.
        - For `Vite` apps, `vite-tsconfig-paths` package is required to ensure the UI components are properly built and available for use.
        - For `Next.js` apps, the `next.config.ts` file needs to have `transpilePackages: ["@repo/ui"]` to ensure the UI components are properly built and available for use.
    - Although not required, adding `	"paths": {
	"@repo/ui/*": ["../../packages/ui/src/*"]
}` in the `tsconfig.json` file of each app can help with TypeScript path resolution during development.

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting
- [shadcn/ui](https://ui.shadcn.com/docs/monorepo) for UI components
    - To use the CLI, run `npx shadcn@latest add <component-name>` in the `@repo/ui` package directory.
    - It can also be run at each app directory and the CLI will automatically add it to the shared `@repo/ui` package but each app will need its own `components.json` file.
- [Tailwind CSS v4](https://tailwindcss.com/) for styling and to use shadcn/ui
    - Each app needs its own tailwind.config.js file and postcss.config.js file but they all extend from the shared `@repo/ui/tailwind.config.js` and `@repo/ui/postcss.config.js` files.
