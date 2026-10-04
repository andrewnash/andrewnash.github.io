import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { execSync } from 'node:child_process'

// Date of the last commit, shown in the footer. Falls back to today outside a git checkout.
function lastUpdated() {
  try {
    return execSync('git log -1 --format=%cs', { encoding: 'utf8' }).trim()
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

export default defineConfig({
  plugins: [sveltekit()],
  define: {
    __LAST_UPDATED__: JSON.stringify(lastUpdated())
  }
})
