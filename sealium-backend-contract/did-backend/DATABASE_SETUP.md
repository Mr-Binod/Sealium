# Database Setup Guide

This guide will help you set up PostgreSQL with Drizzle ORM for the DID Backend project.

## Prerequisites

1. **PostgreSQL** - Make sure PostgreSQL is installed and running on your system
2. **Node.js** - Version 16 or higher
3. **npm** - For package management

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=did_database

# RPC Configuration
RPC_URL=https://sepolia.infura.io/v3/your_infura_project_id
```

## Database Setup

1. **Create Database**
   ```sql
   CREATE DATABASE did_database;
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Generate Database Schema**
   ```bash
   npm run db:generate
   ```

4. **Push Schema to Database**
   ```bash
   npm run db:push
   ```

## Available Database Commands

- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Run migrations
- `npm run db:push` - Push schema changes directly to database
- `npm run db:studio` - Open Drizzle Studio for database management

## Database Schema

The application uses the following tables:

- **dids** - Stores DID information including address, private key, and metadata
- **did_documents** - Stores DID documents as JSON
- **verification_methods** - Stores verification methods for DIDs
- **services** - Stores service endpoints for DIDs

## Testing

Run the tests to ensure everything is working:

```bash
npm test
```

## Development

Start the development server:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000` 