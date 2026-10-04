<script lang="ts">
  import { profile } from '$lib/resume'
  import { palette } from '$lib/palette.svelte'
  import { theme, toggleTheme } from '$lib/theme.svelte'

  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
</script>

<nav class="no-print" aria-label="Site">
  <a class="home" href="/">andrew nash</a>
  <span class="links">
    <a href="/#experience">work</a>
    <a href="/#writing">writing</a>
    <a href={profile.resume}>resume.pdf</a>
    <button type="button" class="key" onclick={() => (palette.open = true)} aria-label="Open command menu">
      {isMac ? '⌘' : 'Ctrl'} K
    </button>
    <button
      type="button"
      class="key"
      onclick={toggleTheme}
      aria-label={theme.current === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
      {theme.current === 'dark' ? 'light' : 'dark'}
    </button>
  </span>
</nav>

<style>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px 16px;
    font: 500 0.8rem var(--mono);
    color: var(--muted);
  }
  a {
    color: var(--muted);
    text-decoration: none;
  }
  a:hover {
    color: var(--fg);
  }
  .home {
    color: var(--fg);
  }
  .links {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px 16px;
  }
  .key {
    font: 500 0.72rem var(--mono);
    color: var(--muted);
    background: transparent;
    border: 1px solid var(--line);
    border-bottom-width: 2px;
    border-radius: 4px;
    padding: 2px 7px;
    cursor: pointer;
  }
  .key:hover {
    color: var(--fg);
    border-color: var(--muted);
  }
</style>
