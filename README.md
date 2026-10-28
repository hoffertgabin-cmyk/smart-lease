# Smart Lease, site vitrine

Site de Smart Lease S.A.R.L (négociant automobile, Luxembourg) : stock de véhicules particuliers et utilitaires, fiches détaillées, véhicules vendus, services, recherche personnalisée, reprise, financement, location et contact.

Stack : Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · composants shadcn/ui (Radix) · Motion · react-hook-form + zod · Resend · déploiement Vercel.

## Démarrer en local

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
cp .env.example .env.local   # puis renseigner les variables (facultatif en local)
npm run dev                  # http://localhost:3000
```

Autres commandes :

| Commande | Rôle |
|---|---|
| `npm run build` | Build de production (vérifie aussi les types et le lint) |
| `npm run start` | Sert le build de production |
| `npm run lint` | ESLint |
| `npm run photos` | Télécharge photos et logo depuis l'ancien site (voir plus bas) |
| `npm run todo` | Liste les points à vérifier sur chaque véhicule |

Sans `RESEND_API_KEY`, les formulaires fonctionnent en développement : le contenu du message s'affiche dans le terminal au lieu d'être envoyé.

## Déployer sur Vercel

1. Pousser ce dépôt sur GitHub, puis sur vercel.com : **Add New → Project**, importer le dépôt. Vercel détecte Next.js, aucun réglage de build n'est nécessaire.
2. Dans **Settings → Environment Variables**, ajouter pour l'environnement Production les variables de `.env.example` :
   - `NEXT_PUBLIC_SITE_URL` : l'URL finale (ex. `https://www.smartlease.fr` ou `https://www.smartlease.lu`) ;
   - `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO` : créer un compte sur resend.com, vérifier le domaine d'envoi (enregistrements DNS fournis par Resend), puis créer une clé API ;
   - `INSTAGRAM_ACCESS_TOKEN` (facultatif).
3. Déployer, puis dans **Settings → Domains**, ajouter le domaine et suivre les instructions DNS (chez IONOS : enregistrement `A` vers `76.76.21.21` et `CNAME www` vers `cname.vercel-dns.com`, valeurs à confirmer dans l'écran Vercel).
4. Les anciennes adresses IONOS sont redirigées en 301 vers les nouvelles (`src/lib/redirects.ts`) : rien à faire, à condition de garder le même nom de domaine.

Chaque push sur la branche principale redéploie le site ; chaque pull request obtient une URL de prévisualisation.

## Où est le contenu

| Contenu | Fichier |
|---|---|
| Coordonnées, horaires, RCS, TVA, réseaux, directeur de publication, hébergeur | `src/lib/site.ts` (source unique, ne jamais recopier ailleurs) |
| Véhicules en stock, vendus, référence vendue, location | `src/content/vehicles.json` (validé au build par `src/lib/vehicle-schema.ts`) |
| Photos des véhicules | `public/vehicules/<slug>/` |
| Services et étapes de l'import | `src/content/services.ts` |
| Avis clients (uniquement réels, avec accord) | `src/content/reviews.ts` |
| Libellés communs (boutons, navigation) | `src/i18n/fr.ts` |
| Menu principal et pied de page | `src/lib/navigation.ts` |

Les éléments manquants s'affichent sur le site sous forme d'étiquette jaune `TODO` : rien n'est inventé.

## Ajouter un véhicule

1. Créer le dossier `public/vehicules/<slug>/` et y déposer les photos, nommées `01.webp`, `02.webp`… (ou `.jpg`). La première est la photo principale. Format paysage 3:2, 2400 px de large maximum.
2. Dans `src/content/vehicles.json`, copier un véhicule existant dans le tableau `vehicles` et l'adapter :
   - `slug` : identifiant unique de l'URL, en minuscules avec des tirets, par exemple `porsche-718-boxster-s-2017` (l'adresse devient `/vehicules/porsche-718-boxster-s-2017`) ;
   - `category` : `vp` (particulier) ou `utilitaire` ;
   - `status` : `en-stock`, `arrivage` (avec `availableFrom`), `reserve` ou `vendu` ;
   - `condition` : `neuf`, `zero-km` ou `occasion` ;
   - `fuel` : `essence`, `diesel`, `hybride`, `hybride-rechargeable`, `electrique`, `gpl` ;
   - `bodyType` : `citadine`, `compacte`, `berline`, `break`, `suv`, `coupe`, `cabriolet`, `monospace`, `fourgon`, `fourgonnette`, `benne` ;
   - `price.amount` en euros (ou `null` pour « Prix sur demande »), `price.taxMode` `TTC` ou `HT`, `vatRecoverable`, `financingAvailable` ;
   - `options` : groupes d'équipements (`group` + `items`), affichés repliables sur la fiche ;
   - `images` : une entrée par photo, par exemple
     `{ "src": "/vehicules/<slug>/01.webp", "alt": "Porsche 718 Boxster S, vue avant", "width": 2400, "height": 1600 }` ;
   - `featured: true` pour le mettre en avant sur l'accueil ;
   - `todo` : liste vide `[]` une fois tout vérifié.
3. `npm run build` en local (le build échoue avec un message clair si un champ est invalide), puis commit et push : Vercel publie.

Une valeur inconnue s'écrit `null` : la fiche masque simplement la ligne.

## Marquer un véhicule comme vendu

Dans `src/content/vehicles.json`, passer le `status` du véhicule à `"vendu"`. Au déploiement suivant :

- il disparaît du stock, de l'accueil et du sitemap ;
- il apparaît sur la page `/vendus` ;
- son ancienne adresse `/vehicules/<slug>` redirige vers `/vendus`, ce qui évite les liens morts depuis Google ou les réseaux sociaux.

## Photos et logo de l'ancien site

`npm run photos` lit chaque ancienne fiche IONOS (`legacyUrl`), télécharge toutes les photos dans leur meilleure résolution, les enregistre en WebP dans `public/vehicules/<slug>/`, génère les miniatures floues de chargement et l'image de partage `og.jpg`, puis remplit les `images` de `vehicles.json`. Il télécharge aussi le logo dans `public/brand/logo.png`.

Options : `--only <slug>` pour un seul véhicule, `--force` pour remplacer des photos existantes, `--dry-run` pour simplement lister.

Ce script a besoin d'accéder à `www.smartlease.fr` et à son CDN (`le-cdn.website-editor.net`, `*.multiscreensite.com`, `irp.cdn-website.com`). Il est à lancer avant l'arrêt de l'hébergement IONOS. Vérifier ensuite l'ordre des photos de chaque fiche.

## Formulaires

Contact, recherche personnalisée et reprise (avec photos et carte grise, 4 Mo au total, réduites automatiquement dans le navigateur) sont validés côté navigateur et côté serveur (`src/lib/forms/schemas.ts`), protégés par un champ piège anti-robots et une limite de 3 à 5 envois par adresse IP toutes les 10 minutes selon le formulaire, puis envoyés par Resend à `MAIL_TO`.

La limite d'envoi est conservée en mémoire, donc par instance Vercel : elle suffit contre les abus simples. Pour une limite stricte, brancher Upstash Redis (`@upstash/ratelimit`) dans `src/lib/forms/server.ts`.

## Cookies et contenus tiers

Le site ne dépose aucun cookie de mesure ou de publicité. Le bandeau demande l'accord pour les contenus tiers (Google Maps, Instagram, avis Google) ; « Refuser » est aussi visible et facile que « Accepter », et le choix se modifie via « Gérer les cookies » dans le pied de page. Si vous ajoutez un outil de statistiques, il doit attendre cet accord (voir `src/hooks/use-consent.ts`).

## SEO

- Métadonnées et URL canonique par page, image de partage générée pour chaque véhicule (titre, prix, photo).
- `sitemap.xml` et `robots.txt` générés automatiquement.
- Données structurées : `AutoDealer` (toutes les pages), `BreadcrumbList`, `Car` + `Offer` sur les fiches.
- Redirections 301 de toutes les anciennes adresses IONOS (`src/lib/redirects.ts`, à partir des champs `legacyUrl`).

## Passer à un CMS (Sanity)

Les pages ne lisent jamais `vehicles.json` directement : elles passent par `src/lib/vehicles.ts`. Pour gérer le stock depuis une interface d'administration :

1. créer un projet Sanity avec un type `vehicle` reprenant les champs de `src/lib/vehicle-schema.ts` ;
2. importer `vehicles.json` (script `sanity dataset import` après conversion en NDJSON) ;
3. remplacer le contenu des fonctions de `src/lib/vehicles.ts` par des requêtes GROQ, et ajouter le domaine `cdn.sanity.io` dans `next.config.ts` ;
4. déclencher la revalidation (`revalidateTag`) via un webhook Sanity pour publier sans redéployer.

## Accessibilité et performance

Objectifs : WCAG 2.1 AA, Lighthouse ≥ 95. Contrôles faits : navigation clavier complète, lien d'évitement, focus visible, contrastes AA, formulaires étiquetés avec erreurs annoncées, animations désactivées si l'utilisateur préfère réduire les mouvements. Les formulaires et fenêtres modales sont chargés à la demande pour alléger les pages.
