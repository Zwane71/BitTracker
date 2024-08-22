// next.config.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = {
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "https://api.coingecko.com/api/v3/:path*", // Proxy to the CoinGecko API
			},
		];
	},
	async headers() {
		return [
			{
				source: "/api/:path*",
				headers: [
					{
						key: "Access-Control-Allow-Origin",
						value: "*",
					},
				],
			},
		];
	},
};
