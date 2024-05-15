import express from 'express';
import axios from 'axios';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const token = process.env.FINNHUB_API_KEY;
const prisma = new PrismaClient();

interface Stock {
  prices: number[];
  lastUpdated: Date;
}

const stocks: Record<string, Stock> = {};

app.put('/stock/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${token}`);
    if (response.data.c === 0) {
      res.status(400).send(`Invalid symbol: ${symbol}`);
      return;
    }
  } catch (error) {
    res.status(500).send(`Error fetching price for symbol ${symbol}: ${(error as Error).message}`);
    return;
  }

  fetchStockPrice(symbol);
  cron.schedule('* * * * *', () => fetchStockPrice(symbol));
  res.send(`Started tracking stock ${symbol}`);
});

app.get('/stock/:symbol', async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    const stock = await prisma.stock.findUnique({
      where: { symbol },
      select: {
        prices: true,
        lastUpdated: true,
      },
    });

    if (!stock) {
      res.status(404).send('Stock not found');
      return;
    }

    const movingAverage = calculateMovingAverage(stock.prices);
    res.send({ prices: stock.prices, lastUpdated: stock.lastUpdated, movingAverage });
  } catch (error) {
    res.status(500).send(`Error retrieving stock ${symbol}: ${(error as Error).message}`);
  }
});

const fetchStockPrice = async (symbol: string) => {
  try {
    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${token}`);
    const price = response.data.c;

    const stock = await prisma.stock.upsert({
      where: { symbol },
      update: {
        prices: { push: price },
        lastUpdated: new Date(),
      },
      create: {
        symbol,
        prices: [price],
        lastUpdated: new Date(),
      },
    });

    if (stock.prices.length >= 10) {
      const movingAverage = calculateMovingAverage(stock.prices);
      console.log(`Moving average for ${symbol}: ${movingAverage}`);
    }
  } catch (error) {
    console.error(error);
  }
};

const calculateMovingAverage = (prices: number[]): number | null => {
  if (prices.length < 10) {
    return null;
  }

  const lastTenPrices = prices.slice(-10);
  const sum = lastTenPrices.reduce((a, b) => a + b, 0);
  return sum / lastTenPrices.length;
};

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});