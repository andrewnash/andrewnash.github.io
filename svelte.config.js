import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex'
import { fileURLToPath } from 'node:url'

/** @type {import('@sveltejs/kit').Config} */
export default {
  extensions: ['.svelte', '.md'],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.md'],
      layout: { _: fileURLToPath(new URL('./src/lib/components/PostLayout.svelte', import.meta.url)) }
    })
  ],
  kit: {
    adapter: adapter({ strict: true }),
    prerender: { handleHttpError: 'fail' }
  }
}
