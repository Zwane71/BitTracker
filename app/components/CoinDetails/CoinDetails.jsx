"use client";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import styles from "@/app/components/CoinDetails/CoinDetail.module.css";

const CoinDetails = ({ coinId }) => {
	const [coinData, setCoinData] = useState(null);
	const [priceHistory, setPriceHistory] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!coinId) return;

		const fetchCoinData = async () => {
			try {
				const response = await fetch(
					`https://api.coingecko.com/api/v3/coins/${coinId}`
				);
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();
				setCoinData(data);
			} catch (err) {
				setError(err.message);
			}
		};

		const fetchPriceHistory = async () => {
			try {
				const response = await fetch(
					`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
				);
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();
				setPriceHistory(data.prices);
			} catch (err) {
				setError(err.message);
			}
		};

		fetchCoinData();
		fetchPriceHistory();
	}, [coinId]);

	if (error) return <div>Error: {error}</div>;

	const chartData = {
		labels: priceHistory.map(([timestamp]) =>
			new Date(timestamp).toLocaleDateString()
		),
		datasets: [
			{
				label: "Price (USD)",
				data: priceHistory.map(([_, price]) => price),
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
};

export default CoinDetails;
