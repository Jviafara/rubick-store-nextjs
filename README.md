# Rubik Store Next.js (Currently on development)

A modern fullstack e-commerce application built with Next.js, TypeScript, and MongoDB.

##Project Demo live on vercel
-URL: (https://rubick-store-nextjs.vercel.app/)

## Project Summary

- Frontend: `Next.js`, React, TypeScript, Tailwind CSS, and modern component-driven UI.
- Backend: Next.js API routes with MongoDB for data persistence.
- Authentication: migrated from the original MERN auth flow to a full Next.js implementation with `betterauth`.
- State management: Redux Toolkit and custom React hooks for cart, favorites, and global loading state.
- API: custom modules for products, orders, and favorites with secure route handling.
- On this personal project is where i apply and use all the new slkills and technologie that i learn.

## Technologies and Skills

- Languages: `TypeScript`, `JavaScript`, `HTML`, `CSS`
- Frameworks / Libraries: `Next.js`, `React`, `Redux Toolkit`
- Database: `MongoDB`
- Authentication: `betterauth` implementation for secure user sign-in and sign-up flows
- Server: Next.js serverless API routes
- Tooling: `npm`, `ESLint`, `PostCSS`, `TailwindCss`

## Migration History

This application was originally developed as a MERN stack project: (Original Project repository: https://github.com/Jviafara/RubicksStore/)
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
- When running locally the project will not run without the enviroment variables needed to run.
- env.local file needed: `GOOGLE_CLIENT_ID`,`GOOGLE_CLIENT_SECRET`,`MONGODB_URI`,`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`,`STRIPE_SECRET_KEY`,`BETTER_AUTH_SECRET`,`BETTER_AUTH_URL`,`NEXT_PUBLIC_BASE_URL`.
- The version deployed on versel is tracking the main branch, but the project is currently under a redesign and you can see it on the new-design branch although is not deployed yet.
- Althouh this project dont have any ai functionality yet, i expect on the near future with the new design to implement some AI functionalities especially on a new cube speed stopwatch, this funcionality is expected to receive a cube scramble and return a image previsualization of the cube scrambled.
