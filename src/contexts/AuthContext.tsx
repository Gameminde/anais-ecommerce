import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
// Analytics utils removed - using direct tracking
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<{ user: User | null; session: Session | null }>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Propriété calculée pour vérifier l'authentification
  const isAuthenticated = !!user

  useEffect(() => {
    // Vérifier la session au démarrage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      throw new Error('Email ou mot de passe incorrect')
    }

    // Track login event
    // trackEvent('login', { method: 'email' }) // Analytics removed
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('🔐 Tentative d\'inscription pour:', email)

      // Validation côté client
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email.trim())) {
        throw new Error('Veuillez saisir une adresse email valide.')
      }

      if (!password || password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères.')
      }

      if (!fullName || fullName.trim().length < 2) {
        throw new Error('Veuillez saisir votre nom complet.')
      }

      // Vérifier les emails réservés
      const normalizedEmail = email.trim().toLowerCase()
      const reservedEmails = ['admin@anais.com', 'test@anais.com']
      if (reservedEmails.includes(normalizedEmail)) {
        throw new Error('Cet email est réservé et ne peut pas être utilisé.')
      }

      // Utiliser l'inscription Supabase avec auto-confirm activé côté serveur
      console.log('🔄 Inscription avec confirmation automatique...')
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: { full_name: fullName.trim() },
          // Pas de redirection nécessaire car on confirme automatiquement
        }
      })

      if (error) {
        console.error('❌ Erreur Supabase lors de l\'inscription:', error.message)

        // Gestion des erreurs d'inscription
        if (error.message.includes('User already registered') ||
            error.message.includes('already been registered') ||
            error.message.includes('already exists') ||
            error.message.includes('email address is already registered')) {
          throw new Error('Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.')
        } else if (error.message.includes('Password should be at least')) {
          throw new Error('Le mot de passe doit contenir au moins 6 caractères.')
        } else if (error.message.includes('Invalid email')) {
          throw new Error('Veuillez saisir une adresse email valide.')
        }

        throw new Error(`Erreur d'inscription: ${error.message}`)
      }

      console.log('✅ Inscription réussie')

      // Confirmer automatiquement l'utilisateur si nécessaire
      if (data.user && !data.user.email_confirmed_at) {
        console.log('🔄 Confirmation automatique de l\'email en cours...')

        // Utiliser la clé service role pour confirmer (via requête directe à l'API)
        try {
          const confirmResponse = await fetch(
            `https://zvyhuqkyeyzkjdvafdkx.supabase.co/auth/v1/admin/users/${data.user.id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'apikey': '2d2f50cb113979bf1105082b1f0f17e81da91b9e377af799ce5d5b0679ca6fd8',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2eWh1cWt5ZXl6a2pkdmFmZGt4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI5NzQ3NSwiZXhwIjoyMDc3ODczNDc1fQ.xrlPAtnJM1_zT2ik3T-AHbJQ6EE5ajerPWim-j8MZXI',
              },
              body: JSON.stringify({
                email_confirm: true
              }),
            }
          )

          if (confirmResponse.ok) {
            console.log('✅ Email confirmé automatiquement')
          } else {
            console.warn('⚠️ Confirmation automatique échouée, mais inscription réussie')
          }
        } catch (confirmError) {
          console.warn('⚠️ Erreur lors de la confirmation automatique:', confirmError)
        }
      }

      // Créer le profil utilisateur
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            full_name: fullName.trim(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])

        if (profileError) {
          console.error('❌ Erreur lors de la création du profil:', profileError)
        } else {
          console.log('✅ Profil créé avec succès')
        }
      }

      // Essayer de connecter automatiquement l'utilisateur
      console.log('🔄 Connexion automatique après inscription...')
      try {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        })

        if (signInError) {
          console.warn('⚠️ Connexion automatique échouée, mais inscription réussie:', signInError.message)
          // Track signup event
          // trackEvent('signup', { method: 'email' }) // Analytics removed
          // L'utilisateur pourra se connecter manuellement
          return data
        } else {
          console.log('✅ Connexion automatique réussie')
          // Track signup event
          // trackEvent('signup', { method: 'email' }) // Analytics removed
          return signInData
        }
      } catch (signInError) {
        console.warn('⚠️ Exception lors de la connexion automatique:', signInError)
        return data
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription:', error)
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      isAuthenticated,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
