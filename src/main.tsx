import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/base.css'
import './styles/app.css'
import App from './App.tsx'
import { applyTheme, getThemePref, watchSystemTheme } from './lib/theme'
import { initSync } from './store/sync'

applyTheme(getThemePref())
watchSystemTheme()
initSync()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
