<script lang="ts">
  import type { Bullet } from '#lib/resume.ts'

  let { bullet, open = false, dim = false }: { bullet: Bullet; open?: boolean; dim?: boolean } = $props()

  let expanded = $state(false)
  $effect(() => {
    expanded = open
  })
  const id = $props.id()
</script>

<li class:dim>
  <button type="button" aria-expanded={expanded} aria-controls={id} onclick={() => (expanded = !expanded)}>
    <span class="mark" aria-hidden="true">{expanded ? '−' : '+'}</span>
    <b>{bullet.head}</b>
  </button>
  <p {id} class="detail" class:shown={expanded}>
    {bullet.detail}
    {#if bullet.link}
      <a href={bullet.link.href} target="_blank" rel="noopener">[{bullet.link.label}]</a>
    {/if}
  </p>
</li>

<style>
  li {
    list-style: none;
    transition: opacity 0.2s;
  }
  li.dim {
    opacity: 0.28;
  }
  button {
    display: flex;
    gap: 10px;
    align-items: baseline;
    text-align: left;
    background: none;
    border: 0;
    padding: 3px 0;
    cursor: pointer;
    width: 100%;
  }
  .mark {
    font: 600 0.85rem var(--mono);
    color: var(--accent);
    width: 1ch;
    flex: none;
  }
  b {
    font-weight: 600;
  }
  button:hover b {
    color: var(--accent);
  }
  .detail {
    display: none;
    padding: 2px 0 6px calc(1ch + 10px);
    color: var(--muted);
    font-size: 0.94rem;
  }
  .detail.shown {
    display: block;
  }
  @media print {
    li.dim {
      opacity: 1;
    }
    button {
      padding: 0;
    }
    .mark {
      visibility: hidden;
    }
    .detail {
      display: block;
      padding-bottom: 3px;
    }
  }
</style>
