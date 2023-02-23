import { defineConfig } from 'vite'

export default defineConfig({
	test: {
		/* for example, use global to avoid globals imports (describe, test, expect): */
		// globals: true,
	},
	plugins: [],
	server: { host: '0.0.0.0', port: 8000 },
	clearScreen: false,
	base: './'
})
