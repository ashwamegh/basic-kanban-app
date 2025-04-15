# Kanban Task Management App

A simple but powerful Kanban task management application built with Next.js, PostgreSQL, and Knex.js.

![Kanban Board Screenshot](https://example.com/screenshot.png)

## Features

- Create, read, update, and delete boards and tasks
- Organize tasks in different columns
- Responsive design for all screen sizes
- Interactive UI with hover states
- Form validation for all inputs

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Knex.js
- **Language**: TypeScript

## Requirements

- Node.js 18+
- PostgreSQL 12+

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/kanban-app.git
cd kanban-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a PostgreSQL database:

```bash
createdb kanban
```

4. Set up environment variables by creating a `.env` file (or use the existing default one):

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=kanban
```

5. Run migrations to create the database tables:

```bash
npm run migrate:latest
```

6. Seed the database with sample data:

```bash
npm run seed
```

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Building for Production

```bash
npm run build
npm start
```

## API Endpoints

### Boards

- `GET /api/boards` - Get all boards
- `POST /api/boards` - Create a new board
- `GET /api/boards/:id` - Get a specific board
- `PUT /api/boards/:id` - Update a board
- `DELETE /api/boards/:id` - Delete a board
- `GET /api/boards/:id/columns` - Get columns for a board
- `POST /api/boards/:id/columns` - Create a column in a board

### Columns

- `GET /api/columns/:id` - Get a specific column
- `PUT /api/columns/:id` - Update a column
- `DELETE /api/columns/:id` - Delete a column
- `GET /api/columns/:id/tasks` - Get tasks for a column
- `POST /api/columns/:id/tasks` - Create a task in a column

### Tasks

- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## License

MIT
