export interface PostMeta {
  slug: string
  title: string
  created: string
  image?: string
  tags: string[]
}

// Every post is a src/routes/<slug>/+page.md with YAML frontmatter.
const modules = import.meta.glob<{ metadata: Omit<PostMeta, 'slug'> }>('/src/routes/*/+page.md', { eager: true })

export const posts: PostMeta[] = Object.entries(modules)
  .map(([path, mod]) => ({
    ...mod.metadata,
    slug: path.split('/').at(-2) as string,
    created: new Date(mod.metadata.created).toISOString().slice(0, 10),
    tags: mod.metadata.tags ?? []
  }))
  .sort((a, b) => b.created.localeCompare(a.created))
