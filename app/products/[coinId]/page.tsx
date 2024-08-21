import React from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import styles from "./page.module.css";

export async function generateStaticParams() {
	// Fetch the list of coins to generate static params
	const res = await fetch(
		"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
	);
	const data = await res.json();

	// Limiting to 15 coins for static generation
	return data.slice(0, 15).map((coin) => ({
		coinId: coin.id,
	}));
}

async function getCoinData(coinId) {
	const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
	if (!res.ok) {
		throw new Error("Network response was not ok");
	}
	return res.json();
}

async function getPriceHistory(coinId) {
	const res = await fetch(
		`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
	);
	if (!res.ok) {
		throw new Error("Network response was not ok");
	}
	return res.json();
}

export default async function CoinDetailsPage({ params }) {
	const { coinId } = params;

	const [coinData, priceHistory] = await Promise.all([
		getCoinData(coinId),
		getPriceHistory(coinId),
	]);

	const chartData = {
		labels: priceHistory.prices.map(([timestamp]) =>
			new Date(timestamp).toLocaleDateString()
		),
		datasets: [
			{
				label: "Price (USD)",
				data: priceHistory.prices.map(([_, price]) => price),
				borderColor: "#10b981",
				backgroundColor: "rgba(16, 185, 129, 0.2)",
				fill: true,
			},
		],
	};

	return (
		<div className={styles.container}>
			{coinData ? (
				<>
					<h2 className={styles.title}>{coinData.name}</h2>
					<div className={styles.info}>
						<p>
							<strong>Current Price:</strong> $
							{coinData.market_data.current_price.usd.toFixed(2)}
						</p>
						<p>
							<strong>24h Change:</strong>{" "}
							{coinData.market_data.price_change_percentage_24h.toFixed(2)}%
						</p>
						<p>
							<strong>Market Cap:</strong> $
							{coinData.market_data.market_cap.usd.toLocaleString()}
						</p>
						<p>
							<strong>Trading Volume:</strong> $
							{coinData.market_data.total_volume.usd.toLocaleString()}
						</p>
					</div>
					<div className={styles.chart}>
						<Line data={chartData} />
					</div>
				</>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
}
