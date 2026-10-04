<script lang="ts">
  import Bullet from '#lib/components/Bullet.svelte'
  import { posts } from '#lib/posts.ts'
  import { education, internships, profile, projects, publications, roles, skills, stats, type Skill } from '#lib/resume.ts'

  let skill = $state<Skill | null>(null)
  let expandAll = $state(false)

  const allBullets = roles.flatMap(r => r.bullets)
  const matches = $derived(skill ? allBullets.filter(b => b.skills.includes(skill!)).length : allBullets.length)
  const dim = (s: Skill[]) => skill !== null && !s.includes(skill)

  const description = `${profile.name}, ${profile.title} at ${profile.company}. ${profile.summary}`
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    worksFor: { '@type': 'Organization', name: profile.company },
    url: 'https://andrewnash.github.io/',
    sameAs: [profile.github, profile.linkedin]
  })
</script>

<svelte:head>
  <title>{profile.name} · {profile.title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href="https://andrewnash.github.io/" />
  <meta property="og:type" content="profile" />
  <meta property="og:title" content="{profile.name} · {profile.title}" />
  <meta property="og:description" content={description} />
  <meta property="og:url" content="https://andrewnash.github.io/" />
  {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<header class="hero">
  <h1>{profile.name}</h1>
  <p class="sub">
    <b>{profile.title} @ {profile.company}.</b>
    {profile.summary}
  </p>
  <p class="where">{profile.location}</p>
  <p class="links">
    <a href={profile.github} target="_blank" rel="noopener">github ↗</a>
    <a href={profile.linkedin} target="_blank" rel="noopener">linkedin ↗</a>
    <a href="mailto:{profile.email}">{profile.email}</a>
    <a class="pdf no-print" href={profile.resume}>resume.pdf ↓</a>
  </p>
</header>

<dl class="stats">
  {#each stats as s}
    <div>
      <dt>{s.label}</dt>
      <dd>{s.value}</dd>
    </div>
  {/each}
</dl>

<section id="experience" aria-labelledby="h-exp">
  <div class="sec-head">
    <h2 id="h-exp" class="label">Experience</h2>
    <button type="button" class="text-btn no-print" onclick={() => (expandAll = !expandAll)} aria-pressed={expandAll}>
      {expandAll ? 'collapse all' : 'expand all'}
    </button>
  </div>
  <div class="filter no-print" role="group" aria-label="Highlight work by skill">
    {#each skills as s}
      <button type="button" aria-pressed={skill === s} onclick={() => (skill = skill === s ? null : s)}>{s}</button>
    {/each}
    <span class="count" aria-live="polite">
      {#if skill}{matches} of {allBullets.length} highlights use {skill}{/if}
    </span>
  </div>

  {#each roles as role}
    <article class="row">
      <span class="when">{role.start.slice(-4)} – {role.end === 'Present' ? 'now' : role.end.slice(-4)}</span>
      <div class="body">
        <h3>{role.company} <span>· {role.title}</span></h3>
        <ul class="bullets">
          {#each role.bullets as b}
            <Bullet bullet={b} open={expandAll} dim={dim(b.skills)} />
          {/each}
        </ul>
        <p class="tags">{role.tags.join(' · ')}</p>
      </div>
    </article>
  {/each}

  <article class="row" id="internships">
    <span class="when">2018 – 2021</span>
    <div class="body">
      <h3>Co-op internships <span>· ML, data science and NLP</span></h3>
      <ul class="coops">
        {#each internships as i}
          <li>
            <b>{i.company}</b>
            <span class="role">{i.role} · {i.dates}</span>
            <span class="sum">{i.summary}</span>
          </li>
        {/each}
      </ul>
    </div>
  </article>
</section>

<section id="projects" aria-labelledby="h-proj">
  <h2 id="h-proj" class="label">Projects</h2>
  {#each projects as p}
    <article class="row" class:dim={dim(p.skills)}>
      <span class="when">{p.when}</span>
      <div class="body">
        <h3>{p.name} <span>· {p.kicker}</span></h3>
        <ul class="plain">
          {#each p.points as pt}<li>{pt}</li>{/each}
        </ul>
        <p class="tags">
          {p.tags.join(' · ')}
          {#each p.links as l}<a href={l.href}>{l.label} →</a>{/each}
        </p>
      </div>
    </article>
  {/each}
</section>

<section id="publications" aria-labelledby="h-pub">
  <h2 id="h-pub" class="label">Publications</h2>
  {#each publications as p}
    <article class="row" class:dim={dim(p.skills)}>
      <span class="when">{p.when}</span>
      <div class="body">
        <h3>{p.title} <span>· {p.venue}</span></h3>
        <p class="muted">{p.summary}</p>
        <p class="tags">
          {p.tags.join(' · ')}
          {#each p.links as l}<a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener">{l.label} →</a>{/each}
        </p>
      </div>
    </article>
  {/each}
</section>

<section id="education" aria-labelledby="h-edu">
  <h2 id="h-edu" class="label">Education</h2>
  {#each education as e}
    <article class="row">
      <span class="when">{e.when}</span>
      <div class="body">
        <h3>{e.degree}</h3>
        <p class="muted">{e.school}. {e.note}</p>
      </div>
    </article>
  {/each}
</section>

<section id="writing" class="no-print" aria-labelledby="h-wri">
  <div class="sec-head">
    <h2 id="h-wri" class="label">Writing</h2>
    <a class="text-btn" href="/writing/">all writing →</a>
  </div>
  {#each posts as p}
    <a class="row post" href="/{p.slug}/">
      <span class="when">{p.created}</span>
      <span class="body"><span class="ptitle">{p.title}</span><span class="tags">{p.tags.slice(0, 3).join(' · ')}</span></span>
    </a>
  {/each}
</section>

<style>
  .hero {
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
    max-width: 62ch;
  }
  .sub b {
    color: var(--fg);
    font-weight: 600;
  }
  .where {
    font: 0.8rem var(--mono);
    color: var(--muted);
  }
  .links {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 18px;
    font: 500 0.82rem var(--mono);
    margin-top: 4px;
  }
  .links a {
    text-decoration: none;
  }
  .links a:hover {
    text-decoration: underline;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--line);
    border: 1px solid var(--line);
    margin: 0;
  }
  .stats div {
    background: var(--bg);
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .stats dd {
    order: -1;
  }
  .stats dd {
    margin: 0;
    font: 700 1.5rem/1.15 var(--display);
    font-stretch: 85%;
    font-variant-numeric: tabular-nums;
  }
  .stats dt {
    font-size: 0.8rem;
    color: var(--muted);
  }

  section {
    display: grid;
    gap: 18px;
  }
  section > .label,
  .sec-head {
    border-bottom: 1px solid var(--line);
    padding-bottom: 7px;
  }
  .sec-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .text-btn {
    text-decoration: none;
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
    font: 500 0.72rem var(--mono);
    color: var(--accent);
  }

  .filter {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: -6px;
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
  .count {
    font: 0.74rem var(--mono);
    color: var(--muted);
    margin-left: 4px;
  }

  .row {
    display: grid;
    grid-template-columns: 112px 1fr;
    gap: 16px;
    transition: opacity 0.2s;
  }
  .row.dim {
    opacity: 0.28;
  }
  .when {
    font: 0.78rem/2 var(--mono);
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }
  .body {
    min-width: 0;
    display: grid;
    gap: 6px;
  }
  h3 {
    font: 600 1rem/1.5 var(--body);
  }
  h3 span {
    color: var(--muted);
    font-weight: 400;
  }
  .bullets {
    margin: 0;
    padding: 0;
    display: grid;
    gap: 2px;
  }
  .plain {
    margin: 0;
    padding-left: 18px;
    color: var(--muted);
    font-size: 0.94rem;
  }
  .muted {
    color: var(--muted);
    font-size: 0.94rem;
  }
  .tags {
    font: 0.74rem/1.7 var(--mono);
    color: var(--muted);
    display: flex;
    flex-wrap: wrap;
    gap: 4px 14px;
  }
  .tags a {
    text-decoration: none;
  }
  .coops {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 8px;
  }
  .coops li {
    display: grid;
    font-size: 0.94rem;
  }
  .coops b {
    font-weight: 600;
  }
  .coops .role {
    font: 0.74rem var(--mono);
    color: var(--muted);
  }
  .coops .sum {
    color: var(--muted);
  }

  .post {
    text-decoration: none;
    color: var(--fg);
  }
  .post .ptitle {
    font-weight: 600;
  }
  .post:hover .ptitle {
    color: var(--accent);
  }

  @media (max-width: 560px) {
    .row {
      grid-template-columns: 1fr;
      gap: 2px;
    }
    .stats {
      grid-template-columns: 1fr;
    }
  }
  @media print {
    .stats div {
      padding: 6px 10px;
    }
    .stats dd {
      font-size: 1.15rem;
    }
    .row.dim {
      opacity: 1;
    }
    .row {
      grid-template-columns: 90px 1fr;
    }
    section {
      gap: 10px;
    }
  }
</style>
