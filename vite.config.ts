import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import optimizer from "vite-plugin-optimizer";
import { devPlugin, getReplacer } from "./plugins/devPlugin";
import { buildPlugin } from "./plugins/buildPlugin";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [optimizer(getReplacer()), devPlugin(), react()],
	build: {
		rollupOptions: {
			plugins: [buildPlugin()],
		},
	},
});

