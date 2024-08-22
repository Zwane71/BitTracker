import React from "react";
import styles from "./SearchBar.module.css";

const SearchBar = ({ searchQuery, onSearch }) => {
	return (
		<div className={styles.searchContainer}>
			<input
				type='text'
				value={searchQuery}
				onChange={(e) => onSearch(e.target.value)}
				placeholder='Search for a coin...'
				className={styles.searchInput}
			/>
		</div>
	);
};

export default SearchBar;
