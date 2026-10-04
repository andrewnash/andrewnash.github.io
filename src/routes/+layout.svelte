<script lang="ts">
  import '../app.css'
  import { onMount, type Snippet } from 'svelte'
  import Nav from '#lib/components/Nav.svelte'
  import CommandPalette from '#lib/components/CommandPalette.svelte'
  import { initTheme } from '#lib/theme.svelte.ts'
  import { profile } from '#lib/resume.ts'

  let { children }: { children: Snippet } = $props()

  onMount(initTheme)
</script>

<div class="page">
  <Nav />
  {@render children()}
  <footer class="no-print">
    <span>© {new Date(__LAST_UPDATED__).getFullYear()} {profile.name}</span>
    <span>updated {__LAST_UPDATED__}</span>
  </footer>
</div>

<CommandPalette />

<style>
  .page {
    max-width: var(--col);
    margin: 0 auto;
    padding-block: 40px 56px;
    display: grid;
    gap: 44px;
  }
  footer {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    border-top: 1px solid var(--line);
    padding-top: 14px;
    font: 0.75rem var(--mono);
    color: var(--muted);
  }
  @media print {
    .page {
      max-width: none;
      padding: 0;
      gap: 18px;
    }
  }
</style>
