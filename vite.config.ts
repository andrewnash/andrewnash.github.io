import adapter from '@sveltejs/adapter-static'
import { sveltekit } from '@sveltejs/kit/vite'
import { mdsvex } from 'mdsvex'
import { defineConfig } from 'vite'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

// Date of the last commit, shown in the footer. Falls back to today outside a git checkout.
function lastUpdated() {
  try {
    return execSync('git log -1 --format=%cs', { encoding: 'utf8' }).trim()
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter({ strict: true }),
      extensions: ['.svelte', '.md'],
      preprocess: [
        mdsvex({
          extensions: ['.md'],
          layout: { _: fileURLToPath(new URL('./src/lib/components/PostLayout.svelte', import.meta.url)) }
        })
      ],
      prerender: { handleHttpError: 'fail' }
    })
  ],
  define: {
    __LAST_UPDATED__: JSON.stringify(lastUpdated())
  }
})
