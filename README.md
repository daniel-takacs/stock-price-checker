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