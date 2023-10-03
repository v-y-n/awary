/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
	extend: {
			colors: {
				app: {
					primary: "#36CCCC"
				},
				primary: "#36AAAA",
				"primary-hover": "#368888",
				"primary-active": "#367777",
			}
		}
  },
  plugins: [],
}
