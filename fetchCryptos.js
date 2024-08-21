const fetch = require("node-fetch");

const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";
const options = {
	method: "GET",
	headers: {
		accept: "application/json",
	},
};

fetch(url, options)
	.then((res) => res.json())
	.then((json) => console.log(json)) // You'll see detailed data including icons
	.catch((err) => console.error("error:" + err));
