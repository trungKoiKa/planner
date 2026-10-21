import { THEME_KEY } from '../config'

export type ThemePref = 'light' | 'auto' | 'dark'

const media = () => window.matchMedia('(prefers-color-scheme: dark)')

export function getThemePref(): ThemePref {
  try {
    const v = localStorage.getItem(THEME_KEY)
    if (v === 'light' || v === 'dark' || v === 'auto') return v
  } catch {
    /* storage blocked */
  }
  return 'auto'
}

export function applyTheme(pref: ThemePref) {
  const dark = pref === 'dark' || (pref === 'auto' && media().matches)
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#1a1815' : '#f4f1ea')
}

export function setThemePref(pref: ThemePref) {
  try {
    localStorage.setItem(THEME_KEY, pref)
  } catch {
    /* storage blocked */
  }
  applyTheme(pref)
}

/** Keeps "auto" in step with the OS setting. */
export function watchSystemTheme() {
  media().addEventListener('change', () => getThemePref() === 'auto' && applyTheme('auto'))
}
