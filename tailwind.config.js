
module.exports = {
  content: ["./index.html", "./*.{ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'match': 'match-pulse 0.6s ease-out forwards',
        'spin-slow': 'rotate 3s linear infinite',
      },
    },
  },
  plugins: [],
};
