Install convex

```
npm install convex
npx convex dev
```

Install clerk

```
npm install @clerk/nextjs
```

follow https://docs.convex.dev/auth/clerk#nextjs

Avoid running multiple dev cli
npm install npm-run-all --save-dev

Modify your dev command

```
"scripts": {
"dev": "npm-run-all -p dev:frontend dev:backend",
"dev:frontend": "next dev --turbopack",
"dev:backend": "convex dev",
},
```
