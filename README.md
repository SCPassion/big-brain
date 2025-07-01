# Install convex

```bash
npm install convex
npx convex dev
```

## Install clerk

```bash
npm install @clerk/nextjs
```

follow https://docs.convex.dev/auth/clerk#nextjs

# Avoid running multiple dev cli
In cli, install:
```bash
npm install npm-run-all --save-dev
```

Modify your dev command in the package.json
```
"scripts": {
"dev": "npm-run-all -p dev:frontend dev:backend",
"dev:frontend": "next dev --turbopack",
"dev:backend": "convex dev",
},
```
