export type Theme = 'dark' | 'light'

// app.html sets data-theme before paint; this mirrors it so components can react.
export const theme = $state<{ current: Theme }>({ current: 'dark' })

export function initTheme() {
  theme.current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function toggleTheme() {
  theme.current = theme.current === 'dark' ? 'light' : 'dark'
  document.documentElement.dataset.theme = theme.current
  try {
    localStorage.setItem('theme', theme.current)
  } catch {}
}
