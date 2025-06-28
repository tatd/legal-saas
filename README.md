# Easy Matters

Backend API for managing customers and matters, and frontend to interact with the system.

## Quickstart

- Download docker
- Download nvm
- Download the repo
- From the root directory, make the scripts executable

```bash
chmod +x deploy.sh down.sh
```

- To start the docker containers:

```bash
./deploy.sh
```

## Manual Start

If the script isn't working, these are the manual steps.

### From the directory `api-easy-matters/`:

- Copy .env.example to .env

```
cp .env.example .env
```

```bash
nvm use
npm install
```

- start the container

```bash
docker compose up -d --build
```

- Run the migration

```bash
npm run migrate
```

- Run the data seed

```bash
npm run seed:run
```

The API is available at `http://localhost:3001/`

### From the directory `easy-matters/`:

- start the container

```bash
docker compose up -d --build
```

The frontend app is available at `http://localhost:5173/`

### Stop the containers

From each project directory mentioned above:

```bash
docker compose down -v
```

### Sample logins

The db is seeded with logins:

- email: dennis@sample.com, pw: password1
- email: clara@sample.com, pw: password2

### curl commands to test API

See list of helpful commands and curl commands to test the API in `commands` file.

## API Documentation

For detailed API documentation, see [API.md](API.md)

## Things to improve with more time

- nest matter routes under customer routes so they're not all in the same router in the API
- refactor error messages so they're not magic strings
- add more specific errors, like when foreign key doesn't exist (customer id when creating matter)
- add tests (e2e, API, unit)
- better logging, include ids for tracing
- add separate pages in the frontend for better UX
- overall I was rushing and didn't put as much time in the frontend, so with more time I would put some more though into the design.

### Development notes

While developing, I used youtube tutorials, docs, and an AI editors as tools. For the frontend, I am unfamiliar with tailwind, so I chose to use shadcn ui components. The AI editor was especially helpful with scaffolding and setting up tool integrationss, debugging errors, CSS, and writing documentation. If I relied on AI, I tried my best to verify its truthfulness and how it works.
