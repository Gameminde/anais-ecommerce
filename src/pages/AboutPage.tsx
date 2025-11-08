export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory-cream">
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-8 text-center">À Propos d'ANAIS</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
            <h2 className="font-display text-3xl text-anais-taupe mb-4">Notre Histoire</h2>
            <p className="font-body text-body-lg text-warm-gray leading-relaxed mb-6">
              ANAIS est bien plus qu'une marque de mode – c'est une célébration de l'élégance pudique enracinée dans l'héritage algérien. 
              Fondée avec la vision d'offrir aux femmes des ensembles sophistiqués et de haute qualité qui valorisent à la fois le style et la pudeur, 
              nous avons bâti notre réputation sur nos tissus à texture côtelée signature et nos créations intemporelles.
            </p>
            <p className="font-body text-body-lg text-warm-gray leading-relaxed">
              Chaque ensemble ANAIS est soigneusement confectionné pour incarner l'équilibre parfait entre valeurs traditionnelles et esthétique contemporaine. 
              Notre palette de couleurs taupe chaud, greige et accents dorés reflète la beauté naturelle de l'Algérie tout en maintenant 
              un attrait luxueux et moderne.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
            <h2 className="font-display text-3xl text-deep-plum mb-4">Notre Mission</h2>
            <p className="font-body text-body-lg text-warm-gray leading-relaxed mb-6">
              Offrir aux femmes algériennes des ensembles élégants et pudiques qui honorent la tradition tout en embrassant le style moderne. 
              Nous croyons que la pudeur et la mode peuvent coexister magnifiquement, et nous nous engageons à créer des pièces qui rendent 
              chaque femme confiante et sophistiquée.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
            <h2 className="font-display text-3xl text-antique-gold mb-4">Nos Créations Complémentaires</h2>
            <p className="font-body text-body-lg text-warm-gray leading-relaxed mb-6">
              En complément de nos ensembles, nous proposons une sélection de parfums de créateur conçus par mon mari, 
              ainsi qu'une gamme de maquillage soigneusement sélectionnée. Ces produits ajoutent la touche finale parfaite 
              à votre tenue pour toutes vos occasions spéciales.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="font-display text-3xl text-antique-gold mb-4">Coffrets Cadeaux</h2>
            <p className="font-body text-body-lg text-warm-gray leading-relaxed">
              Nos coffrets cadeaux signature combinent un ensemble élégant avec un parfum soigneusement sélectionné et du maquillage, 
              créant le cadeau parfait pour les mariages, anniversaires et célébrations spéciales. 
              Chaque coffret est composé pour offrir une expérience de luxe complète, rendant l'art d'offrir simple et mémorable.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
