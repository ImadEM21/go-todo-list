import { defineConfig } from 'vite';
import react from 'vite-preset-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		sourcemap: false,
		commonjsOptions: {
			sourceMap: false,
		},
		minify: true,
		rollupOptions: {
			output: {
			  manualChunks: {
				editor: ['jodit'],
				lodash: ['lodash'],
			  },
			},
		  },
	}
});
