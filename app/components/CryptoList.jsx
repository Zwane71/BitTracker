"use client";
import React, { useEffect, useState } from "react";
import styles from "@/app/components/crypto.module.css";
import SearchBar from "@/app/components/SearchBar/SearchBar";
import CoinDetails from "@/app/components/CoinDetails/CoinDetails";

const CryptoTable = () => {
	const [cryptos, setCryptos] = useState([]);
	const [filteredCryptos, setFilteredCryptos] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [error, setError] = useState(null);
	const router = useRouter();

	useEffect(() => {
		const fetchCryptos = async () => {
			try {
				const response = await fetch(
					"https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
				);
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();
				setCryptos(data.slice(0, 15)); // Limiting the array to the first 15 items
				setFilteredCryptos(data.slice(0, 15));
			} catch (err) {
				setError(err.message);
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
		router.push(`/coins/${coinId}`);
	};

	if (error) return <div>Error: {error}</div>;

	return (
		<div className={styles.container}>
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
							<tr
								key={crypto.id}
								className={styles.tableRow}
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
								<td
									className={`${styles.tableCell} uppercase`}
									data-label='Symbol'>
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
									{crypto.price_change_percentage_24h >= 0 ? "Profit" : "Loss"}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default CryptoTable;
