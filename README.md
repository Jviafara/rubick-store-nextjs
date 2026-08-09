# Rubik Store Next.js

A modern fullstack e-commerce application built with Next.js, TypeScript, and MongoDB.

## Project Summary

- Frontend: `Next.js`, React, TypeScript, Tailwind CSS, and modern component-driven UI.
- Backend: Next.js API routes with MongoDB for data persistence.
- Authentication: migrated from the original MERN auth flow to a full Next.js implementation with `betterauth`.
- State management: Redux Toolkit and custom React hooks for cart, favorites, and global loading state.
- API: custom modules for products, orders, and favorites with secure route handling.

## Technologies and Skills

- Languages: `TypeScript`, `JavaScript`, `HTML`, `CSS`
- Frameworks / Libraries: `Next.js`, `React`, `Redux Toolkit`
- Database: `MongoDB`
- Authentication: `betterauth` implementation for secure user sign-in and sign-up flows
- Server: Next.js serverless API routes
- Tooling: `npm`, `ESLint`, `PostCSS`

## Migration History

This application was originally developed as a MERN stack project:

- MongoDB
- Express
- React
- Node.js

It was later migrated to a fullstack Next.js project to unify frontend and backend logic, improve performance, and simplify deployment.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Notes

- The current project structure uses Next.js `app/` routing and React Server Components.
- Authentication is now handled with `betterauth` instead of the earlier MERN-based auth stack.
