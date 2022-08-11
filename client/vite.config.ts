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
			maxParallelFileOps: 1,
			output: {
			  manualChunks: {
				editor: ['jodit'],
				recharts: ['recharts'],
			  },
			},
		  },
	}
});
