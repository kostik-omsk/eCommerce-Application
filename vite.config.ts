import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import react from '@vitejs/plugin-react-swc';
import { createRedirectsFilePlugin } from './vite-plugins';

export default defineConfig(({ command }) => {
  if (command === 'build') {
    return {
      mode: 'production',
      plugins: [react(), tsconfigPaths()],
      css: {
        modules: {
          localsConvention: 'camelCaseOnly',
        },
      },
      optimizeDeps: {
        esbuildOptions: {
          define: {
            global: 'globalThis',
          },
          plugins: [
            NodeGlobalsPolyfillPlugin({
              process: true,
              buffer: true,
            }),
            NodeModulesPolyfillPlugin(),
          ],
        },
      },
      build: {
        target: 'esnext',
        rollupOptions: {
          plugins: [rollupNodePolyFill(), createRedirectsFilePlugin()],
        },
      },
      resolve: {
        alias: {
          process: 'process/browser',
          stream: 'stream-browserify',
          zlib: 'browserify-zlib',
          util: 'util',
        },
      },
    };
  } else {
    return {
      mode: 'dev',
      plugins: [react(), tsconfigPaths()],
      css: {
        modules: {
          localsConvention: 'camelCaseOnly',
        },
      },
      resolve: {
        alias: {
          stream: 'rollup-plugin-node-polyfills/polyfills/stream',
        },
      },
      optimizeDeps: {
        esbuildOptions: {
          define: {
            global: 'window',
          },
          plugins: [
            NodeGlobalsPolyfillPlugin({
              process: true,
              buffer: true,
            }),
            NodeModulesPolyfillPlugin(),
          ],
        },
      },
      build: {
        rollupOptions: {
          plugins: [rollupNodePolyFill()],
        },
      },
    };
  }
});
