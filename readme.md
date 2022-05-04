
# Realworld example app - backend

Practice application for testing and improving my JS/TypeScript/NodeJS/NestJS knowledge.

## 1. Getting started

### 1.1 Requirements

Before starting, make sure you have at least those components on your workstation:

- An up-to-date release of [NodeJS](https://nodejs.org/) and NPM

### 1.2 Project configuration

Start by cloning this project on your workstation.

``` sh
git clone https://github.com/Tomschuh/realworld.git
```

The next thing will be to install all the dependencies of the project.

```sh
cd ./realworld
npm install
```

Once the dependencies are installed, you can now configure your project by creating a new `.env` file containing your environment variables used for development.

```
cp .env.example .env
vi .env
```
Environment variables for setting API are `API_PORT` with default value: `3000` and `API_PREFIX` with default value `/api/`.

The JWT authentication configuration consists of `JWT_SECRET` with default value: `secret` (Needs to be changed before deploying to production!) and `JWT_EXPIRATION` with default value: `10m`.

Last configuration is `DATABASE_URL`, which is path to SQLite database file with default value: `file:./sqlite.db`

### 1.3 Database migration

For database migration use following command

```sh
# Command to apply migrations:
npx prisma migrate deploy
```

## 2. Default NPM commands

The NPM commands below are already included with this template and can be used to quickly run, build and test your project.

```sh
# Start the application using the transpiled NodeJS
npm run start
# Run the application using "ts-node"
npm run dev
# Transpile the TypeScript files
npm run build
# Run the project' functional tests
npm run test
# Prisma generate migration with 'migration_name'
prisma migrate dev --name migration_name 
```
