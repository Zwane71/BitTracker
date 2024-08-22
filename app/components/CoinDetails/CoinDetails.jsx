"use client";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2"; // Chart library, install if not already
import Chart from "chart.js/auto"; // Chart.js auto import
import styles from "./CoinDetail.module.css";

const CoinDetails = ({ coinId }) => {
	const [coinData, setCoinData] = useState(null);
	const [priceChartData, setPriceChartData] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchCoinDetails = async () => {
			try {
				const [infoRes, chartRes] = await Promise.all([
					fetch(`/api/coins/${coinId}`),
					fetch(`/api/coins/${coinId}/market_chart?vs_currency=usd&days=7`),
				]);
				if (!infoRes.ok || !chartRes.ok) {
					throw new Error("Network response was not ok");
				}
				const [infoData, chartData] = await Promise.all([
					infoRes.json(),
					chartRes.json(),
				]);

				setCoinData(infoData);
				setPriceChartData(chartData.prices);
			} catch (err) {
				setError(err.message);
			}
		};

		fetchCoinDetails();
	}, [coinId]);

	if (error) return <div>Error: {error}</div>;
	if (!coinData || !priceChartData) return <div>Loading...</div>;

	// Prepare chart data
	const chartLabels = priceChartData.map(([timestamp]) =>
		new Date(timestamp).toLocaleDateString()
	);
	const chartPrices = priceChartData.map(([, price]) => price);

	const chartData = {
		labels: chartLabels,
		datasets: [
			{
				label: "Price (USD)",
				data: chartPrices,
				borderColor: "rgba(75, 192, 192, 1)",
				backgroundColor: "rgba(75, 192, 192, 0.2)",
			},
		],
	};

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>{coinData.name}</h2>
			<div className={styles.details}>
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
		</div>
	);
};

export default CoinDetails;
