import { Link } from "react-router-dom"

export function Legal() {
  return (
    <div className="min-h-full p-6 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(2,132,199,0.12),transparent_55%)]">
      <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-surface/80 backdrop-blur p-8 shadow-sm space-y-8">
        <div>
          <Link to="/" className="text-sm text-muted hover:underline">← Retour</Link>
          <h1 className="mt-3 text-2xl font-semibold">Mentions légales & Politique de confidentialité</h1>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Mentions légales</h2>
          <p className="text-sm text-muted">
            MonSuiviAuto est une application développée dans le cadre d'un projet de formation
            (Développeur Web et Web Mobile). Elle n'a pas de vocation commerciale et est mise à
            disposition à titre démonstratif.
          </p>
          <p className="text-sm text-muted">
            <strong>Éditeur :</strong> Maxime — projet étudiant<br />
            <strong>Hébergement :</strong> environnement de développement local<br />
            <strong>Contact :</strong> via le dépôt du projet
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Politique de confidentialité</h2>

          <h3 className="text-sm font-medium mt-4">Données collectées</h3>
          <p className="text-sm text-muted">
            MonSuiviAuto collecte uniquement les données nécessaires au fonctionnement du service :
            adresse email, mot de passe (haché, jamais stocké en clair), rôle du compte, et les
            données que vous saisissez vous-même (véhicules, entretiens, rappels, documents).
          </p>

          <h3 className="text-sm font-medium mt-4">Utilisation des données</h3>
          <p className="text-sm text-muted">
            Vos données sont utilisées exclusivement pour vous permettre d'utiliser l'application.
            Elles ne sont ni vendues, ni partagées avec des tiers, ni utilisées à des fins publicitaires.
          </p>

          <h3 className="text-sm font-medium mt-4">Conservation des données</h3>
          <p className="text-sm text-muted">
            Vos données sont conservées tant que votre compte est actif. Un journal des actions
            (création, modification, suppression) est conservé séparément à des fins de traçabilité
            technique.
          </p>

          <h3 className="text-sm font-medium mt-4">Vos droits</h3>
          <p className="text-sm text-muted">
            Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de
            portabilité et d'effacement de vos données. Vous pouvez :
          </p>
          <ul className="text-sm text-muted list-disc pl-5 space-y-1">
            <li>Exporter l'ensemble de vos données via le bouton "Exporter mes données" dans l'application</li>
            <li>Supprimer définitivement votre compte et toutes vos données via "Supprimer mon compte"</li>
          </ul>

          <h3 className="text-sm font-medium mt-4">Sécurité</h3>
          <p className="text-sm text-muted">
            Les mots de passe sont hachés avec bcrypt, les sessions sont gérées par token JWT à
            durée limitée, et toutes les entrées utilisateur sont validées avant traitement.
          </p>
        </section>
      </div>
    </div>
  )
}
