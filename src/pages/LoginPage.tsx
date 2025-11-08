import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { signIn, signUp } = useAuth()

  const redirectPath = searchParams.get('redirect') || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password, fullName)
      }
      navigate(redirectPath)
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory-cream flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/logos/anais-logo-primary.svg" alt="ANAIS" className="h-16 mx-auto mb-6" />
          </Link>
          <h1 className="font-display text-4xl text-charcoal mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="font-body text-warm-gray">
            {isLogin ? 'Sign in to your account' : 'Join the ANAIS family'}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="font-body text-sm font-bold text-charcoal mb-2 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  className="w-full px-4 py-3 rounded-lg border-2 border-warm-gray/20 focus:border-anais-taupe focus:outline-none transition-colors font-body"
                  placeholder="Your full name"
                />
              </div>
            )}

            <div>
              <label className="font-body text-sm font-bold text-charcoal mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border-2 border-warm-gray/20 focus:border-anais-taupe focus:outline-none transition-colors font-body"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="font-body text-sm font-bold text-charcoal mb-2 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg border-2 border-warm-gray/20 focus:border-anais-taupe focus:outline-none transition-colors font-body"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-alert-rose/10 border border-alert-rose rounded-lg p-4">
                <p className="font-body text-sm text-alert-rose">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-antique-gold text-white font-body font-bold py-4 rounded-xl hover:bg-anais-taupe transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="font-body text-sm text-anais-taupe hover:text-antique-gold transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
