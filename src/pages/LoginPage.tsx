import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailHint, setEmailHint] = useState('')
  
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { signIn, signUp } = useAuth()

  const redirectPath = searchParams.get('redirect') || '/'

  const checkEmailExists = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('is_active', true)

      if (error) return false

      // Vérifier si c'est un admin
      const adminExists = data.some(admin =>
        admin.user_id && admin.user_id.includes(email.split('@')[0])
      )

      return adminExists
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
        setEmailHint('')
      } else {
        await signUp(email, password, fullName)
      }
      navigate(redirectPath)
    } catch (err: any) {
      let errorMessage = err.message || 'Erreur d\'authentification'

      // Messages d'erreur améliorés selon le contexte
      if (isLogin) {
        // Erreurs de connexion
        if (errorMessage.includes('Email ou mot de passe incorrect')) {
          errorMessage = 'Email ou mot de passe incorrect. Vérifiez vos identifiants.'

          // Donner un indice si c'est un email connu
          if (email.includes('anais.com')) {
            setEmailHint('💡 Essayez avec l\'email admin@anais.com si vous êtes administrateur')
          } else if (email.includes('test@anais.com')) {
            setEmailHint('💡 Utilisez le mot de passe: Test123!')
          }
        } else if (errorMessage.includes('Email not confirmed')) {
          errorMessage = 'Veuillez confirmer votre email avant de vous connecter.'
        } else if (errorMessage.includes('Too many requests')) {
          errorMessage = 'Trop de tentatives. Veuillez réessayer dans quelques minutes.'
        }
      } else {
        // Erreurs d'inscription
        if (errorMessage.includes('Cet email est déjà utilisé')) {
          errorMessage = 'Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.'
          setEmailHint('🔄 Basculez vers "Se connecter" pour accéder à votre compte existant')
        } else if (errorMessage.includes('Cet email est réservé')) {
          errorMessage = 'Cet email est réservé et ne peut pas être utilisé.'
          setEmailHint('💡 Utilisez une adresse email personnelle')
        } else if (errorMessage.includes('mot de passe doit contenir')) {
          errorMessage = 'Le mot de passe doit contenir au moins 6 caractères.'
        } else if (errorMessage.includes('nom complet')) {
          errorMessage = 'Veuillez saisir votre nom complet.'
        } else if (errorMessage.includes('email valide')) {
          errorMessage = 'Veuillez saisir une adresse email valide.'
        }
      }

      setError(errorMessage)
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
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </h1>
          <p className="font-body text-warm-gray">
            {isLogin ? 'Connectez-vous à votre compte' : 'Rejoignez la famille ANAIS'}
          </p>
      {isLogin && redirectPath.includes('checkout') && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            💡 <strong>Commande en cours :</strong> Connectez-vous pour finaliser votre commande
          </p>
        </div>
      )}
        </div>

        {/* Mode selector */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              isLogin
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-gray-600 hover:text-charcoal'
            }`}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !isLogin
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-gray-600 hover:text-charcoal'
            }`}
          >
            S'inscrire
          </button>
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
                {emailHint && (
                  <p className="font-body text-sm text-blue-600 mt-2">{emailHint}</p>
                )}
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
