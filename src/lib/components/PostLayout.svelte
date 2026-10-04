<script lang="ts">
  import type { Snippet } from 'svelte'
  import { page } from '$app/state'

  let {
    title,
    created,
    image,
    tags = [],
    children
  }: { title: string; created: string; image?: string; alt?: string; tags?: string[]; children: Snippet } = $props()

  const date = $derived(new Date(created).toISOString().slice(0, 10))
  const url = $derived(`https://andrewnash.github.io${page.url.pathname}`)
</script>

<svelte:head>
  <title>{title} · Andrew Nash</title>
  <meta name="description" content="{title}. A write-up by Andrew Nash." />
  <link rel="canonical" href={url} />
  <meta property="og:type" content="article" />
  <meta property="og:title" content={title} />
  <meta property="og:url" content={url} />
  {#if image}<meta property="og:image" content="https://andrewnash.github.io{image}" />{/if}
</svelte:head>

<article>
  <header>
    <a class="back no-print" href="/#writing">← all writing</a>
    <p class="meta"><time datetime={date}>{date}</time> · {tags.join(' · ')}</p>
  </header>
  <div class="prose">
    {@render children()}
  </div>
</article>

<style>
  article {
    display: grid;
    gap: 20px;
  }
  header {
    display: grid;
    gap: 6px;
  }
  .back {
    font: 500 0.8rem var(--mono);
    text-decoration: none;
  }
  .meta {
    font: 0.76rem var(--mono);
    color: var(--muted);
  }
  .prose {
    min-width: 0;
  }
  .prose :global(h1) {
    font-size: clamp(1.8rem, 5.5vw, 2.3rem);
    font-weight: 800;
    font-stretch: 85%;
    margin-bottom: 0.6em;
  }
  .prose :global(h2) {
    font-size: 1.35rem;
    font-weight: 700;
    font-stretch: 90%;
    margin: 1.8em 0 0.5em;
  }
  .prose :global(h3) {
    font-size: 1.08rem;
    font-weight: 650;
    margin: 1.5em 0 0.4em;
  }
  .prose :global(p),
  .prose :global(ul),
  .prose :global(ol) {
    margin: 0 0 1em;
  }
  .prose :global(img) {
    display: block;
    margin: 1.4em auto;
    border-radius: 6px;
    border: 1px solid var(--line);
  }
  .prose :global(iframe) {
    display: block;
    width: 100%;
    max-width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    margin: 1.4em 0;
    border: 0;
    border-radius: 6px;
  }
  .prose :global(code) {
    font: 0.88em var(--mono);
    background: var(--surface);
    border: 1px solid var(--line);
    padding: 1px 5px;
    border-radius: 4px;
  }
  .prose :global(pre) {
    overflow-x: auto;
    background: var(--surface);
    border: 1px solid var(--line);
    padding: 14px;
    border-radius: 6px;
  }
  .prose :global(pre code) {
    border: 0;
    padding: 0;
  }
  .prose :global(table) {
    display: block;
    overflow-x: auto;
    border-collapse: collapse;
    margin: 0 0 1em;
  }
  .prose :global(th),
  .prose :global(td) {
    border: 1px solid var(--line);
    padding: 6px 10px;
  }
</style>
