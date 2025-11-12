import { Link } from 'react-router-dom'
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-charcoal text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <img src="/logos/anais-logo-reversed.svg" alt="ANAIS" className="h-12 mb-4" />
            <p className="font-body text-sm text-warm-gray leading-relaxed">
              Ensembles élégants pour femmes. Découvrez la sophistication pour vos occasions spéciales.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg mb-4">Liens Rapides</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/shop?type=ensemble" className="font-body text-sm text-warm-gray hover:text-antique-gold transition-colors">
                Ensembles
              </Link>
              <Link to="/shop" className="font-body text-sm text-warm-gray hover:text-antique-gold transition-colors">
                Boutique
              </Link>
              <Link to="/gift-boxes" className="font-body text-sm text-warm-gray hover:text-antique-gold transition-colors">
                Coffrets Cadeaux
              </Link>
              <Link to="/about" className="font-body text-sm text-warm-gray hover:text-antique-gold transition-colors">
                À Propos
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-display text-lg mb-4">Service Client</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/shipping" className="font-body text-sm text-warm-gray hover:text-antique-gold transition-colors">
                Informations Livraison
              </Link>
              <Link to="/returns" className="font-body text-sm text-warm-gray hover:text-antique-gold transition-colors">
                Retours et Échanges
              </Link>
              <Link to="/faq" className="font-body text-sm text-warm-gray hover:text-antique-gold transition-colors">
                FAQ
              </Link>
              <Link to="/contact" className="font-body text-sm text-warm-gray hover:text-antique-gold transition-colors">
                Contactez-nous
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-lg mb-4">Contactez-nous</h3>
            <div className="flex flex-col space-y-3">
              <a href="tel:+213774148612" className="flex items-center space-x-2 text-sm text-warm-gray hover:text-antique-gold transition-colors">
                <Phone className="w-4 h-4" />
                <span>+213 774 148 612</span>
              </a>
              <a href="mailto:youcefneoyoucef@gmail.com" className="flex items-center space-x-2 text-sm text-warm-gray hover:text-antique-gold transition-colors">
                <Mail className="w-4 h-4" />
                <span>youcefneoyoucef@gmail.com</span>
              </a>
              <div className="flex items-center space-x-2 text-sm text-warm-gray">
                <MapPin className="w-4 h-4" />
                <span>Alger, Ain Nadja</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 mt-4">
              <a href="#" className="p-2 bg-warm-gray/20 rounded-lg hover:bg-antique-gold transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-warm-gray/20 rounded-lg hover:bg-antique-gold transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-warm-gray/20 mt-8 pt-8 text-center">
          <p className="font-body text-sm text-warm-gray">
            &copy; 2025 ANAIS. Tous droits réservés. | Créé avec élégance en Algérie.
          </p>
        </div>
      </div>
    </footer>
  )
}
