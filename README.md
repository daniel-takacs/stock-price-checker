# Stock Tracker

This is a simple Node.js application that tracks stock prices using the Finnhub API.

## Setup

1. Clone the repository:

    ```bash
    git clone git@github.com:daniel-takacs/stock-price-checker.git
    cd stock-price-checker

    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Copy the `.env.example` file to a new file named `.env`:

    ```bash
    cp .env.example .env
    ```

4. In the `.env` file, fill in the actual values for each environment:

    ```env
    FINNHUB_API_KEY=your_finnhub_api_key
    PORT=3000
    ```

    Replace `your_finnhub_api_key` with your actual Finnhub API key.

5. Build and run the Docker container:

    ```bash
    docker build -t stock-tracker .
    docker run -p 3000:3000 -d stock-tracker
    ```

The application is now running at `http://localhost:3000`.

## Usage

To start tracking a stock, make a PUT request to `/stock/:symbol`, replacing `:symbol` with the symbol of the stock you want to track.

To get the current price, last updated time, and moving average of a last 10 stock price, make a GET request to `/stock/:symbol`.