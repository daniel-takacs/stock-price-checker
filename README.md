# Stock Price Checker

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

This is a Node.js application that tracks stock prices using the Finnhub API and stores data in a PostgreSQL database. The application uses Prisma as an ORM to interact with the database.

## Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/get-npm) (for local development)


## Setup

### Clone the Repository

```bash
git clone git@github.com:daniel-takacs/stock-price-checker.git
cd stock-price-checker
```

### Install Dependencies

Install the dependencies using npm:

```bash
npm install
```

### Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Fill in the actual values for each environment variable in the `.env` file:

```env
FINNHUB_API_KEY=your_finnhub_api_key
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_NAME=mydatabase
DB_PORT=5432
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}?schema=public"

```

Replace `your_finnhub_api_key` with your actual Finnhub API key.

### Docker Setup

Ensure Docker is running on your system. The Docker setup includes both the application and a PostgreSQL database.

### Docker Compose

The Docker Compose configuration is set to build and run the application along with a PostgreSQL database. Ensure your `docker-compose.yml` is set up as follows:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - FINNHUB_API_KEY=${FINNHUB_API_KEY}
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/mydatabase
      - PORT=3000
    depends_on:
      - db
  db:
    image: postgres:13
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```
### Dockerfile

Create a file named Dockerfile in the root of your project with the following content:
```
# Use the official Node.js image as a base
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Generate the Prisma client
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 3000

# Define the environment variable
ENV PORT=3000

# Command to run the application
CMD ["npm", "run", "dev"]

```

### Build and Run Docker Containers

Rebuild and run your Docker containers:

```bash
docker-compose build
docker-compose up
```

### Verify Setup

1. **Check Application Logs**:

   ```bash
   docker-compose logs app
   ```

2. **Check Database Logs**:

   ```bash
   docker-compose logs db
   ```

## Usage

### Start Tracking a Stock Symbol

To start tracking a stock symbol, make a `PUT` request to `/stock/:symbol`, replacing `:symbol` with the symbol of the stock you want to track. For example:

```bash
curl -X PUT http://localhost:3000/stock/AAPL
```

### Retrieve Stock Data

To get the current price, last updated time, and moving average of the last 10 stock prices, make a `GET` request to `/stock/:symbol`, replacing `:symbol` with the symbol of the stock. For example:

```bash
curl http://localhost:3000/stock/AAPL
```

## Development

### Running Locally

Ensure PostgreSQL is running locally and update the `DATABASE_URL` in your `.env` file accordingly.

Run the development server:

```bash
npm run dev
```
The application will start running at `http://localhost:3000`.

### Applying Prisma Migrations

If you make changes to your Prisma schema, apply the migrations:

```bash
npx prisma migrate dev --name <migration_name>
```

### Prisma Studio

To explore and manipulate your data, you can use Prisma Studio:

```bash
npx prisma studio
```