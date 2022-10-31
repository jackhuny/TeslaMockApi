# Project Descriptions - Tesla Mock API

This project is aim to help developer who uses Tesla APIs. It mocks the Tesla API routes and response base on [unofficial Tesla APIs documentation](https://tesla-api.timdorr.com/ "unofficial Tesla APIs documentation"). Built with NextJs + Prisma(Sqlite) + Typescript + JEST

## Getting Started

1. Clone repo
2. `npm install` or `yarn add`
3. `npx prisma migrate reset`
4. `npm run dev` or `yarn run dev`

## API Route

-   API routes follows tesla api routes
    -   https://auth.tesla.com/api/1/vehicles/{id}/vehicle_data => http://localhost:3000/api/1/vehicles/{id}/vehicle_data
-   Authentication route
    -   https://auth.tesla.com/oauth2/v3 => http://localhost:3000/api/oauth2/v3

## Features

Vehicle sample data import with prisma database seeding
Vehicle state API routes

Commands

-   Sentry Mode

## TODOs

Add more commands
Mock auth process
UI for adding/editing sample vehicle
Add artificial errors
