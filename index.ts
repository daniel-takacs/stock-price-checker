import express from 'express';
import axios from 'axios';
import cron from 'node-cron';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const token = process.env.FINNHUB_API_KEY;

interface Stock {
  prices: number[];
  lastUpdated: Date;
}

const stocks: Record<string, Stock> = {};

app.put('/stock/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
  
    try {
        // Request to the Finnhub API to check if the symbol exists
        const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${token}`);
        if (response.data.c === 0) {
            res.status(400).send(`Invalid symbol: ${symbol}`);
            return;
        }
    } catch (error) {
        res.status(500).send(`Error fetching price for symbol ${symbol}: ${(error as Error).message}`);
        return;
    }
  
    // If the symbol exists, start tracking the stock
    fetchStockPrice(symbol);
    cron.schedule('* * * * *', () => fetchStockPrice(symbol));
    res.send(`Started tracking stock ${symbol}`);
  });

app.get('/stock/:symbol', (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    const stock = stocks[symbol];
  
    if (!stock) {
      res.status(404).send('Stock not found');
      return;
    }
  
    const movingAverage = calculateMovingAverage(symbol);
    res.send({ prices: stock.prices, lastUpdated: stock.lastUpdated, movingAverage });
  });

const fetchStockPrice = async (symbol: string) => {
  try {
    const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${token}`);
    const price = response.data.c;
    
    if (stocks[symbol]) {
      stocks[symbol].prices.push(price);
      stocks[symbol].lastUpdated = new Date();
    } else {
      stocks[symbol] = {
        prices: [price],
        lastUpdated: new Date(),
      };
    }

    if (stocks[symbol].prices.length >= 10) {
      const movingAverage = calculateMovingAverage(symbol);
      console.log(`Moving average for ${symbol}: ${movingAverage}`);
    }
  } catch (error) {
    console.error(error);
  }
};

const calculateMovingAverage = (symbol: string): number | null => {
  const stock = stocks[symbol];
  if (!stock || stock.prices.length < 10) {
    return null;
  }

  const lastTenPrices = stock.prices.slice(-10);
  const sum = lastTenPrices.reduce((a, b) => a + b, 0);
  return sum / lastTenPrices.length;
};

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});