import type { SiteConfig } from '$lib/types/site'

export const site: SiteConfig = {
  protocol: import.meta.env.URARA_SITE_PROTOCOL ?? import.meta.env.DEV ? 'http://' : 'https://',
  domain: import.meta.env.URARA_SITE_DOMAIN ?? 'urara-demo.netlify.app',
  title: 'Andrew Nash Blog',
  subtitle: 'MSc',
  lang: 'en-US',
  description: 'Developer Blog',
  author: {
    avatar: '/assets/icon.png',
    name: 'Andrew Nash',
    status: '🚀',
    bio: 'M.Sc Computer Science Candidate'
  },
  themeColor: '#3D4451'
}
