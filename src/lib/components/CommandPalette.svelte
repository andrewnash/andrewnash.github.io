<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { palette } from '#lib/palette.svelte.ts'
  import { posts } from '#lib/posts.ts'
  import { profile } from '#lib/resume.ts'
  import { theme, toggleTheme } from '#lib/theme.svelte.ts'

  interface Command {
    label: string
    group: string
    hint?: string
    keywords?: string
    run: () => void
  }

  let dialog: HTMLDialogElement
  let input: HTMLInputElement
  let query = $state('')
  let active = $state(0)
  let toast = $state('')

  function section(id: string) {
    if (page.url.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      history.replaceState(history.state, '', `#${id}`)
    } else goto(`/#${id}`)
  }
  const external = (href: string) => () => window.open(href, '_blank', 'noopener')

  const commands: Command[] = $derived([
    { label: 'Experience', group: 'Go to', run: () => section('experience') },
    { label: 'Projects', group: 'Go to', run: () => section('projects') },
    { label: 'Publications', group: 'Go to', run: () => section('publications') },
    { label: 'Education', group: 'Go to', run: () => section('education') },
    { label: 'Writing', group: 'Go to', run: () => section('writing') },
    ...posts.map(p => ({ label: p.title, group: 'Read', hint: p.created.slice(0, 4), keywords: `${p.slug} ${p.tags.join(' ')}`, run: () => goto(`/${p.slug}/`) })),
    { label: 'Resume (PDF)', group: 'Links', run: () => (location.href = profile.resume) },
    { label: 'GitHub', group: 'Links', hint: 'github.com/andrewnash', run: external(profile.github) },
    { label: 'LinkedIn', group: 'Links', hint: 'in/andrewnashnl', run: external(profile.linkedin) },
    { label: 'Copy email', group: 'Actions', hint: profile.email, run: copyEmail },
    { label: `Switch to ${theme.current === 'dark' ? 'light' : 'dark'} theme`, group: 'Actions', run: toggleTheme },
    { label: 'Print resume', group: 'Actions', run: () => setTimeout(() => window.print(), 50) }
  ])

  const results = $derived.by(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter(c => `${c.group} ${c.label} ${c.hint ?? ''} ${c.keywords ?? ''}`.toLowerCase().includes(q))
  })

  $effect(() => {
    // Reset the highlight whenever the result list changes.
    void results
    active = 0
  })

  $effect(() => {
    if (palette.open && !dialog.open) {
      query = ''
      dialog.showModal()
      input.focus()
    } else if (!palette.open && dialog.open) dialog.close()
  })

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      toast = `Copied ${profile.email}`
    } catch {
      toast = profile.email
    }
    setTimeout(() => (toast = ''), 2500)
  }

  function run(c: Command) {
    palette.open = false
    c.run()
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      active = (active + 1) % Math.max(results.length, 1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      active = (active - 1 + results.length) % Math.max(results.length, 1)
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault()
      run(results[active])
    }
  }

  function onGlobalKey(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault()
      palette.open = !palette.open
    }
  }
</script>

<svelte:window onkeydown={onGlobalKey} />

<dialog
  bind:this={dialog}
  class="no-print"
  aria-label="Command menu"
  onclose={() => (palette.open = false)}
  onclick={e => e.target === dialog && (palette.open = false)}>
  <div class="box">
    <input
      bind:this={input}
      bind:value={query}
      onkeydown={onKey}
      type="text"
      placeholder="Jump to a section, post or link…"
      aria-label="Search commands"
      aria-controls="cmd-list"
      aria-activedescendant={results[active] ? `cmd-${active}` : undefined}
      autocomplete="off"
      spellcheck="false" />
    <ul id="cmd-list" role="listbox">
      {#each results as c, i (c.group + c.label)}
        {#if i === 0 || results[i - 1].group !== c.group}
          <li class="group" role="presentation">{c.group}</li>
        {/if}
        <li
          id="cmd-{i}"
          role="option"
          aria-selected={i === active}
          class:active={i === active}
          onclick={() => run(c)}
          onkeydown={() => {}}
          onmousemove={() => (active = i)}>
          <span>{c.label}</span>
          {#if c.hint}<span class="hint">{c.hint}</span>{/if}
        </li>
      {:else}
        <li class="empty" role="presentation">Nothing matches "{query}".</li>
      {/each}
    </ul>
    <p class="foot"><span>↑↓ move</span><span>↵ open</span><span>esc close</span></p>
  </div>
</dialog>

{#if toast}
  <p class="toast no-print" role="status">{toast}</p>
{/if}

<style>
  dialog {
    padding: 0;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--surface);
    color: var(--fg);
    width: min(560px, calc(100vw - 32px));
    margin-top: 12vh;
    box-shadow: 0 24px 60px rgb(0 0 0 / 0.35);
  }
  dialog::backdrop {
    background: rgb(5 8 10 / 0.55);
  }
  .box {
    display: grid;
  }
  input {
    font: 1rem var(--body);
    color: var(--fg);
    background: transparent;
    border: 0;
    border-bottom: 1px solid var(--line);
    padding: 16px 18px;
    outline: none;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 6px;
    max-height: min(52vh, 420px);
    overflow-y: auto;
  }
  li {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.94rem;
  }
  li.active {
    background: var(--accent-soft);
    color: var(--fg);
  }
  .hint {
    font: 0.75rem var(--mono);
    color: var(--muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .group {
    font: 500 0.68rem var(--mono);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    padding: 10px 12px 4px;
    cursor: default;
  }
  .empty {
    color: var(--muted);
    cursor: default;
  }
  .foot {
    display: flex;
    gap: 16px;
    border-top: 1px solid var(--line);
    padding: 8px 18px;
    font: 0.7rem var(--mono);
    color: var(--muted);
  }
  .toast {
    position: fixed;
    left: 50%;
    bottom: calc(24px + env(safe-area-inset-bottom, 0px));
    transform: translateX(-50%);
    background: var(--fg);
    color: var(--bg);
    font: 500 0.82rem var(--mono);
    padding: 8px 14px;
    border-radius: 6px;
  }
</style>
