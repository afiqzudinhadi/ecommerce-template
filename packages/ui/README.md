# @repo/ui

Shared UI components for frontend use. This package has already been set up with dummy **React UI library** (`<CounterButton>` and `<Link>` components) and **shadcn/ui** components (`<Button>` and `<Card>`).

## What's inside?

This repo includes the following packages and apps:

### Apps and Packages

- `tailwindcss`: Tailwind CSS configuration for styling
- `postcss`: PostCSS configuration for processing CSS
- `shadcn/ui`: shadcn/ui components for UI
- `tsup`: TypeScript bundler for building the UI components

### Building and Running

Building the UI will require exporting the components in the `package.json` file.

For `Vite` apps, `vite-tsconfig-paths` package is required to ensure the UI components are properly built and available for use.

For `Next.js` apps, the `next.config.ts` file needs to have `transpilePackages: ["@repo/ui"]` to ensure the UI components are properly built and available for use.

Although not required, adding:

```
"paths": {
	"@repo/ui/*": ["../../packages/ui/src/*"]
}
```

in the `tsconfig.json` file of **each app** can help with TypeScript path resolution during development.

### More Information

#### [shadcn/ui](https://ui.shadcn.com/docs/monorepo) for UI components

To use the CLI, run `npx shadcn@latest add <component-name>` in the `@repo/ui` package directory.

It can also be run at each app directory and the CLI will automatically install `@radix-ui/react-slot` add the components to the shared `@repo/ui` package. Each app will need its own `components.json` file and the `paths` in the `tsconfig.json` file should be updated accordingly.

#### [Tailwind CSS v4](https://tailwindcss.com/) for styling and to use shadcn/ui

Each app needs its own `tailwind.config.js`file and `postcss.config.js` file but they all extend from the shared `@repo/ui/tailwind.config.js` and `@repo/ui/postcss.config.js` files.
