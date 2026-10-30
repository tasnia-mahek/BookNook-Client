import type { Config } from 'tailwindcss';
export default { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { forest: '#173f35', moss: '#2f6b52', ivory: '#f7f3eb', ink: '#1e2926', clay: '#c86b45' }, fontFamily: { display: ['Georgia', 'serif'], sans: ['Arial', 'sans-serif'] } } }, plugins: [] } satisfies Config;
