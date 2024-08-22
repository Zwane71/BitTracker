"use client";
import React, { useState, useEffect } from "react";
import styles from "./crypto.module.css"; // Still use CSS modules for other styles
import SearchBar from "./SearchBar/SearchBar";
import CoinDetails from "./CoinDetails/CoinDetails";

const CryptoTable = () => {
	const [cryptos, setCryptos] = useState([]);
	const [filteredCryptos, setFilteredCryptos] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCoinId, setSelectedCoinId] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCryptos = async () => {
			setLoading(true);
			try {
				const response = await fetch("/api/coins/markets?vs_currency=usd");
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();
				setCryptos(data.slice(0, 15)); // Limiting the array to the first 15 items
				setFilteredCryptos(data.slice(0, 15));
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchCryptos();
	}, []);

	const handleSearch = (query) => {
		setSearchQuery(query);
		if (query === "") {
			setFilteredCryptos(cryptos);
		} else {
			setFilteredCryptos(
				cryptos.filter(
					(crypto) =>
						crypto.name.toLowerCase().includes(query.toLowerCase()) ||
						crypto.symbol.toLowerCase().includes(query.toLowerCase())
				)
			);
		}
	};

	const handleRowClick = (coinId) => {
		setSelectedCoinId(selectedCoinId === coinId ? null : coinId); // Toggle dropdown
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div
			style={{
				backgroundColor: "var(--bg-color-light)", // Uses global CSS variables
				color: "var(--text-color-light)", // These variables will change based on the theme
			}}
			className={styles.container}>
			<h1 className={styles.title}>Cryptocurrency Prices</h1>
			<SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
			<div className={styles.tableWrapper}>
				<table className={styles.table}>
					<thead className={styles.tableHead}>
						<tr>
							<th className={styles.tableCell}>Icon</th>
							<th className={styles.tableCell}>Name</th>
							<th className={styles.tableCell}>Symbol</th>
							<th className={styles.tableCell}>Price (USD)</th>
							<th className={styles.tableCell}>24h Change</th>
							<th className={styles.tableCell}>Status</th>
						</tr>
					</thead>
					<tbody>
						{filteredCryptos.map((crypto) => (
							<React.Fragment key={crypto.id}>
								<tr
									className={`${styles.tableRow} ${
										selectedCoinId === crypto.id ? styles.activeRow : ""
									}`}
									onClick={() => handleRowClick(crypto.id)}>
									<td className={styles.tableCell} data-label='Icon'>
										<img
											src={crypto.image}
											alt={crypto.name}
											className={styles.tableCellIcon}
										/>
									</td>
									<td className={styles.tableCell} data-label='Name'>
										{crypto.name}
									</td>
									<td className={styles.tableCell} data-label='Symbol'>
										{crypto.symbol}
									</td>
									<td className={styles.tableCell} data-label='Price (USD)'>
										${crypto.current_price.toFixed(2)}
									</td>
									<td
										className={`${styles.tableCell} ${
											crypto.price_change_percentage_24h >= 0
												? styles.greenText
												: styles.redText
										}`}
										data-label='24h Change'>
										{crypto.price_change_percentage_24h.toFixed(2)}%
									</td>
									<td className={styles.tableCell} data-label='Status'>
										{crypto.price_change_percentage_24h >= 0
											? "Profit"
											: "Loss"}
									</td>
								</tr>
								{selectedCoinId === crypto.id && (
									<tr>
										<td colSpan='6' className={styles.dropdown}>
											<CoinDetails coinId={crypto.id} />
										</td>
									</tr>
								)}
							</React.Fragment>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default CryptoTable;
