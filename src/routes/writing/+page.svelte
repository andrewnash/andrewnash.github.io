<script lang="ts">
  import { page } from '$app/state'
  import { replaceState } from '$app/navigation'
  import { onMount } from 'svelte'
  import { postTags, posts } from '#lib/posts.ts'

  let selected = $state<string[]>([])

  const shown = $derived(selected.length ? posts.filter(p => selected.every(t => p.tags.includes(t))) : posts)

  function toggle(tag: string) {
    setTags(selected.includes(tag) ? selected.filter(t => t !== tag) : [...selected, tag])
  }

  function setTags(tags: string[]) {
    selected = tags
    const url = new URL(page.url.href)
    if (selected.length) url.searchParams.set('tags', selected.join(','))
    else url.searchParams.delete('tags')
    replaceState(url, {})
  }

  // ?tags=RL,Unity deep-links a filter, as the old blog's tag buttons did.
  onMount(() => {
    const q = new URL(location.href).searchParams.get('tags')
    if (q) selected = q.split(',').filter(t => postTags.includes(t))
  })

  const fmt = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
</script>

<svelte:head>
  <title>Writing · Andrew Nash</title>
  <meta
    name="description"
    content="Write-ups by Andrew Nash on autonomous vehicles, reinforcement learning and robotics projects." />
  <link rel="canonical" href="https://andrewnash.github.io/writing/" />
</svelte:head>

<header class="head">
  <h1>Writing</h1>
  <p class="sub">Deep dives on projects and research: autonomous ground and underwater vehicles, perception and reinforcement learning.</p>
</header>

<div class="posts">
<div class="filter" role="group" aria-label="Filter posts by tag">
  {#each postTags as tag}
    <button type="button" aria-pressed={selected.includes(tag)} onclick={() => toggle(tag)}>#{tag}</button>
  {/each}
  {#if selected.length}
    <button type="button" class="clear" onclick={() => setTags([])}>clear</button>
  {/if}
</div>

<p class="count" aria-live="polite">
  {shown.length}
  {shown.length === 1 ? 'post' : 'posts'}{#if selected.length}
    tagged {selected.map(t => `#${t}`).join(' + ')}{/if}
</p>

<div class="list">
  {#each shown as p, i (p.slug)}
    <a class="card" href="/{p.slug}/">
      {#if p.cover}
        <img src={p.cover} alt={p.coverAlt ?? ''} width="960" height="540" loading={i < 2 ? 'eager' : 'lazy'} decoding="async" />
      {/if}
      <div class="text">
        <p class="meta"><time datetime={p.created}>{fmt(p.created)}</time></p>
        <h2>{p.title}</h2>
        {#if p.summary}<p class="summary">{p.summary}</p>{/if}
        <p class="tags">{p.tags.map(t => `#${t}`).join('  ')}</p>
      </div>
    </a>
  {:else}
    <p class="empty">
      No post has all of those tags.
      <button type="button" class="link" onclick={() => setTags([])}>Clear the filter</button>
    </p>
  {/each}
</div>
</div>

<style>
  .head {
    display: grid;
    gap: 10px;
  }
  h1 {
    font-size: clamp(2.2rem, 7vw, 2.9rem);
    font-weight: 800;
    font-stretch: 85%;
    letter-spacing: -0.01em;
  }
  .sub {
    color: var(--muted);
    max-width: 58ch;
  }

  .posts {
    display: grid;
    gap: 14px;
    margin-top: -16px;
  }
  .filter {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .filter button {
    font: 500 0.74rem var(--mono);
    border: 1px solid var(--line);
    background: transparent;
    color: var(--muted);
    border-radius: 99px;
    padding: 3px 10px;
    cursor: pointer;
  }
  .filter button:hover {
    color: var(--fg);
    border-color: var(--muted);
  }
  .filter button[aria-pressed='true'] {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--bg);
  }
  .filter .clear {
    border-style: dashed;
  }
  .count {
    font: 0.75rem var(--mono);
    color: var(--muted);
  }

  .list {
    display: grid;
    gap: 10px;
  }
  .card {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 20px;
    align-items: start;
    color: var(--fg);
    text-decoration: none;
    padding: 14px;
    margin: 0 -14px;
    border-radius: 10px;
    transition: background 0.15s;
  }
  .card:hover {
    background: var(--surface);
  }
  .card:hover h2 {
    color: var(--accent);
  }
  img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid var(--line);
    background: var(--surface);
  }
  .text {
    display: grid;
    gap: 6px;
    min-width: 0;
  }
  .meta {
    font: 0.76rem var(--mono);
    color: var(--muted);
  }
  h2 {
    font-size: 1.2rem;
    font-weight: 700;
    font-stretch: 92%;
  }
  .summary {
    color: var(--muted);
    font-size: 0.95rem;
  }
  .tags {
    font: 0.72rem/1.7 var(--mono);
    color: var(--muted);
    white-space: pre-wrap;
  }
  .empty {
    color: var(--muted);
  }
  .link {
    background: none;
    border: 0;
    padding: 0;
    color: var(--accent);
    text-decoration: underline;
    cursor: pointer;
  }

  @media (max-width: 600px) {
    .card {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }
</style>
