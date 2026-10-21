import { useState, type FormEvent } from 'react'
import { APP_NAME } from '../config'
import { navigate } from '../lib/route'
import { supabase } from '../lib/supabase'
import { signOut, useAuth } from '../store/sync'

type Mode = 'signin' | 'signup' | 'forgot'

const TITLES: Record<Mode, string> = {
  signin: 'Sign in to sync',
  signup: 'Create an account',
  forgot: 'Reset your password',
}

export default function Auth() {
  const user = useAuth((s) => s.user)
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const switchMode = (m: Mode) => {
    setMode(m)
    setError('')
    setInfo('')
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setError('')
    setInfo('')
    const redirectTo = window.location.origin
    const res =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : mode === 'signup'
          ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } })
          : await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    setBusy(false)
    if (res.error) return setError(res.error.message)
    if (mode === 'signin') return navigate('plan')
    setInfo(mode === 'signup' ? 'Check your inbox to confirm your email, then sign in.' : 'If that email has an account, a reset link is on its way.')
  }

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <div className="logo" style={{ fontSize: 24 }}>{APP_NAME}<span>.</span></div>

        {user ? (
          <>
            <h2 style={{ margin: '14px 0 6px' }}>You're signed in</h2>
            <p className="muted">{user.email} · your plan syncs automatically.</p>
            <div className="modal-actions">
              <button className="btn" onClick={() => signOut()}>Sign out</button>
              <button className="btn primary" onClick={() => navigate('plan')}>Back to plan</button>
            </div>
          </>
        ) : !supabase ? (
          <>
            <h2 style={{ margin: '14px 0 6px' }}>Sync isn't set up</h2>
            <p className="muted">
              This build has no Supabase settings, so your plan is saved in this browser only. Add
              VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable accounts.
            </p>
          </>
        ) : (
          <form onSubmit={submit}>
            <h2 style={{ margin: '14px 0 16px' }}>{TITLES[mode]}</h2>
            <div className="field">
              <label className="label" htmlFor="email">Email</label>
              <input id="email" className="input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {mode !== 'forgot' && (
              <div className="field">
                <label className="label" htmlFor="password">Password</label>
                <div className="pw">
                  <input
                    id="password"
                    className="input"
                    type={show ? 'text' : 'password'}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    minLength={6}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" className="icon-btn" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'}>
                    {show ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
            )}
            {mode === 'signin' && (
              <button type="button" className="link" style={{ marginTop: 8, fontSize: 14 }} onClick={() => switchMode('forgot')}>
                Forgot password?
              </button>
            )}
            {error && <div className="error">{error}</div>}
            {info && <div className="banner">{info}</div>}
            <button className="btn primary" type="submit" disabled={busy} style={{ width: '100%', marginTop: 18, padding: 10 }}>
              {busy ? '…' : mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Sign up' : 'Send reset link'}
            </button>
            <p className="muted" style={{ fontSize: 14, textAlign: 'center' }}>
              {mode === 'signin' ? (
                <>No account? <button type="button" className="link" onClick={() => switchMode('signup')}>Sign up</button></>
              ) : (
                <>Have an account? <button type="button" className="link" onClick={() => switchMode('signin')}>Sign in</button></>
              )}
            </p>
          </form>
        )}

        {!user && (
          <button className="btn ghost" style={{ marginTop: 10 }} onClick={() => navigate('plan')}>
            ‹ Keep planning as a guest
          </button>
        )}
      </div>
    </div>
  )
}
