import { Link } from "react-router-dom"

function SvgIcon({ path, className = "w-6 h-6" }: { path: string | string[]; className?: string }) {
  const paths = Array.isArray(path) ? path : [path]
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
      {paths.map((p, i) => (
        <path key={i} strokeLinecap="round" strokeLinejoin="round" d={p} />
      ))}
    </svg>
  )
}

export function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-text">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-2 focus:z-50 focus:rounded-b-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Aller au contenu principal
      </a>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <span className="flex items-center gap-2 text-lg font-bold text-text">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-base text-white" aria-hidden="true">
              🚗
            </span>
            MonSuiviAuto
          </span>
          <nav aria-label="Navigation principale">
            <ul className="hidden items-center gap-6 sm:flex">
              <li><a href="#features" className="text-sm text-muted hover:text-primary">Fonctionnalités</a></li>
              <li><a href="#how" className="text-sm text-muted hover:text-primary">Comment ça marche</a></li>
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-muted hover:text-primary">Se connecter</Link>
            <Link to="/register" className="btn-primary text-sm">Commencer</Link>
          </div>
        </div>
      </header>

      <main id="main">
        {/* ── HERO ── */}
        <section className="bg-gradient-to-br from-[#1d4ed8] to-[#312e81] px-6 py-20 text-center text-white" aria-labelledby="hero-title">
          <div className="mx-auto max-w-3xl">
            <span className="mb-6 inline-block rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-sm font-semibold">
              ✨ Gratuit · Sans engagement · Aucune carte requise
            </span>
            <h1 id="hero-title" className="mb-4 text-4xl font-black leading-tight sm:text-5xl">
              Gérez l'entretien de votre voiture sans jamais rien oublier
            </h1>
            <p className="mb-8 text-lg text-white/80">
              Rappels automatiques, suivi des coûts, documents centralisés et recherche de garages. Tout ce qu'il vous faut pour garder votre véhicule en parfait état.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="rounded-full bg-white px-8 py-3 text-base font-bold text-primary hover:bg-blue-50" aria-label="Créer votre compte gratuitement">
                Essayer gratuitement →
              </Link>
              <Link to="/login" className="rounded-full border border-white/40 px-8 py-3 text-base font-semibold text-white hover:bg-white/10" aria-label="Se connecter à votre compte">
                Se connecter
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              {["✓ Gratuit", "✓ Sans pub", "✓ RGPD", "✓ Multi-véhicules"].map((tag) => (
                <span key={tag} className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROBLÈME ── */}
        <section id="problem" className="bg-slate-100 px-6 py-16" aria-labelledby="problem-title">
          <div className="mx-auto max-w-5xl">
            <h2 id="problem-title" className="mb-2 text-center text-3xl font-black">
              Vous reconnaissez-vous dans ces situations ?
            </h2>
            <p className="mb-10 text-center text-muted">
              Des milliers d'automobilistes font face à ces problèmes chaque année.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                  iconColor: "text-amber-500",
                  title: "La révision oubliée",
                  desc: "Vous ne savez plus quand vous avez fait la dernière vidange. Le carnet de bord est quelque part dans la boîte à gants.",
                },
                {
                  iconPath: "M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z",
                  iconColor: "text-blue-500",
                  title: "Les documents éparpillés",
                  desc: "Factures, contrôles techniques, garanties... introuvables au moment où vous en avez besoin.",
                },
                {
                  iconPath: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                  iconColor: "text-red-500",
                  title: "Les coûts inconnus",
                  desc: "Aucune visibilité sur vos dépenses d'entretien annuelles. Impossible d'anticiper le budget.",
                },
                {
                  iconPath: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
                  iconColor: "text-orange-500",
                  title: "La panne évitable",
                  desc: "Un entretien négligé coûte toujours plus cher. La prévention est moins chère que la réparation.",
                },
              ].map((c) => (
                <article key={c.title} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                  <div className={`mb-3 ${c.iconColor}`}>
                    <SvgIcon path={c.iconPath} className="w-8 h-8" />
                  </div>
                  <h3 className="mb-2 text-base font-bold">{c.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{c.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── FONCTIONNALITÉS ── */}
        <section id="features" className="bg-slate-50 px-6 py-16" aria-labelledby="features-title">
          <div className="mx-auto max-w-5xl">
            <h2 id="features-title" className="mb-2 text-center text-3xl font-black">
              Tout pour suivre votre véhicule
            </h2>
            <p className="mb-10 text-center text-muted">
              Des outils simples et efficaces, conçus pour rester sereins.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  iconPath: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
                  bg: "bg-blue-50 text-blue-600",
                  title: "Suivi des entretiens",
                  desc: "Enregistrez chaque intervention — vidange, freins, pneus, révision — avec date, kilométrage et coût. Historique complet en un clic.",
                },
                {
                  iconPath: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
                  bg: "bg-green-50 text-green-600",
                  title: "Rappels automatiques",
                  desc: "L'application calcule la prochaine échéance selon le type d'entretien. Vidange : 1 an / 10 000 km. Contrôle technique : 2 ans.",
                },
                {
                  iconPath: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                  bg: "bg-purple-50 text-purple-600",
                  title: "Gestion de documents",
                  desc: "Stockez factures, carte grise et certificats en sécurité. Accessibles depuis n'importe quel appareil.",
                },
                {
                  iconPath: ["M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z", "M15 11a3 3 0 11-6 0 3 3 0 016 0z"],
                  bg: "bg-orange-50 text-orange-600",
                  title: "Recherche de garages",
                  desc: "Trouvez un garagiste à proximité grâce à la carte interactive. Filtrez par type de service.",
                },
                {
                  iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                  bg: "bg-blue-50 text-blue-600",
                  title: "Statistiques de coûts",
                  desc: "Visualisez vos dépenses d'entretien par catégorie et par période. Anticipez vos budgets.",
                },
                {
                  iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                  bg: "bg-green-50 text-green-600",
                  title: "Multi-véhicules",
                  desc: "Gérez plusieurs véhicules depuis un seul compte. Données synchronisées et sauvegardées en sécurité.",
                },
              ].map((f) => (
                <article key={f.title} className="rounded-2xl border border-border p-6 transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${f.bg}`}>
                    <SvgIcon path={f.iconPath} className="w-6 h-6" />
                  </div>
                  <h3 className="mb-2 text-base font-bold">{f.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMMENT ÇA MARCHE ── */}
        <section id="how" className="bg-slate-100 px-6 py-16" aria-labelledby="how-title">
          <div className="mx-auto max-w-4xl">
            <h2 id="how-title" className="mb-2 text-center text-3xl font-black">
              Démarrez en 3 étapes
            </h2>
            <p className="mb-12 text-center text-muted">
              Pas de configuration complexe. En deux minutes, votre véhicule est suivi.
            </p>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  iconPath: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
                  title: "Créez votre compte",
                  desc: "Inscription gratuite en quelques secondes. Aucune carte bancaire requise, aucun engagement.",
                },
                {
                  step: "2",
                  iconPath: "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM3 10h1l1-4h12l1 4h1M5 10h14",
                  title: "Ajoutez votre véhicule",
                  desc: "Renseignez la marque, le modèle, l'année et le kilométrage actuel. Autant de véhicules que vous voulez.",
                },
                {
                  step: "3",
                  iconPath: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
                  title: "Enregistrez vos entretiens",
                  desc: "À chaque passage en garage, notez l'intervention. L'application génère automatiquement le prochain rappel.",
                },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="relative mb-4 inline-flex">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <SvgIcon path={s.iconPath} className="w-8 h-8" />
                    </div>
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="mb-2 text-base font-bold">{s.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-border bg-white p-6">
              <p className="mb-4 text-sm font-semibold">🔒 Sécurité et confidentialité</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  "Données chiffrées · RGPD compliant",
                  "Hébergement européen (Vercel · Render)",
                  "Aucune revente de données à des tiers",
                  "Suppression de compte à tout moment",
                  "Export de vos données (droit RGPD)",
                  "Authentification sécurisée par JWT",
                ].map((item) => (
                  <p key={item} className="text-sm text-muted">✓ {item}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section
          id="cta"
          className="bg-gradient-to-br from-[#1d4ed8] to-[#312e81] px-6 py-16 text-center text-white"
          aria-labelledby="cta-title"
        >
          <div className="mx-auto max-w-xl">
            <h2 id="cta-title" className="mb-3 text-3xl font-black">
              Prêt à ne plus oublier vos révisions ?
            </h2>
            <p className="mb-8 text-white/80">
              Gratuit, sans engagement, accessible depuis n'importe quel appareil.
            </p>
            <Link
              to="/register"
              className="inline-block rounded-full bg-white px-10 py-3.5 text-base font-bold text-primary hover:bg-blue-50"
              aria-label="Créer mon compte gratuit"
            >
              Créer mon compte gratuit →
            </Link>
            <p className="mt-4 text-xs text-white/60">
              Aucune carte bancaire requise · Annulable à tout moment · RGPD ✓
            </p>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer role="contentinfo" className="bg-[#0f172a] px-6 py-10 text-sm text-slate-400">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 grid gap-8 sm:grid-cols-3">
            <div>
              <p className="mb-2 text-base font-bold text-white">🚗 MonSuiviAuto</p>
              <p className="text-xs leading-relaxed">
                L'application gratuite qui simplifie le suivi d'entretien de votre véhicule.
              </p>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-white">Produit</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white">Fonctionnalités</a></li>
                <li><Link to="/register" className="hover:text-white">S'inscrire</Link></li>
                <li><Link to="/login" className="hover:text-white">Se connecter</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-white">Légal</h4>
              <ul className="space-y-2">
                <li><Link to="/legal" className="hover:text-white">Mentions légales & CGU</Link></li>
                <li><a href="mailto:contact@monsuiviauto.fr" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-xs text-slate-500">
            © 2025 MonSuiviAuto — Tous droits réservés ·{" "}
            <Link to="/legal" className="hover:text-white">Mentions légales</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
