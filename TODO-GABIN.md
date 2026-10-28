# À faire par Gabin avant la mise en ligne

Ce qui manque pour publier le site. Chaque point non renseigné s'affiche sur le site sous forme d'étiquette jaune `TODO`, donc rien n'est inventé en attendant.

## 1. Bloquants

1. **Autoriser l'accès à l'ancien site** pour récupérer photos et logo : ajouter `smartlease.fr`, `www.smartlease.fr`, `le-cdn.website-editor.net`, `multiscreensite.com` et `irp.cdn-website.com` dans les domaines autorisés du projet, puis lancer `npm run photos` (ou me demander de le faire). À faire **avant** de résilier IONOS.
2. **Créer un dépôt GitHub vide** (par exemple `smartlease-site`) : je pousse le code dessus.
3. **Compte Vercel** : importer le dépôt et renseigner les variables d'environnement (voir README, section « Déployer sur Vercel »).
4. **Compte Resend** : vérifier le domaine d'envoi (`smartlease.lu`) et créer la clé API, sinon les formulaires ne partent pas en production.
5. **Nom de domaine final** : `smartlease.fr` ou `smartlease.lu` ? Il sert aux balises canoniques, au sitemap et aux redirections depuis les anciennes adresses.

## 2. Mentions légales (`src/lib/site.ts`)

- Capital social de la S.A.R.L.
- Nom du directeur de la publication (gérant).
- Hébergeur : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (à confirmer une fois le déploiement choisi).
- Faire relire les pages Mentions légales et Confidentialité par votre conseil.
- Coordonnées GPS exactes du 71-72 Muehlenweg (pour la carte et Google).

## 3. Contenus

- **Avis clients** : lien de votre fiche Google Business (pour afficher le widget officiel), ou avis transmis par vos clients avec leur accord. La page /avis de l'ancien site ne contenait aucun avis réel.
- **À propos** : date de création, parcours, philosophie, photo de l'équipe et des locaux.
- **Location** (Nissan Primastar Combi 8 places) : tarifs jour / semaine / mois, caution, kilométrage inclus.
- **Logo** en SVG si vous l'avez (le site affiche pour l'instant un logotype typographique).
- **Instagram** (facultatif) : jeton d'accès pour afficher les dernières publications sur l'accueil.

## 4. Données véhicules à vérifier

La Mini Cooper 3 portes et la Clio gris Schiste figuraient à la fois en stock et en vendus : je les ai mises en « vendu » par défaut, à corriger si elles sont encore disponibles.

Liste complète et à jour avec `npm run todo`. Points récurrents : CV fiscaux (toutes les fiches), garantie, régime de TVA sur 8 véhicules, 6 utilitaires sans prix, écarts de prix entre la liste /utilitaires et les fiches Trafic et Master. Les équipements ont été classés automatiquement par catégorie : un coup d'œil sur chaque fiche est conseillé.

- **Porsche 718 Boxster S PDK** (`porsche-718-boxster-s-2017`) : Date exacte de 1re mise en circulation ; CV fiscaux ; Couleur exacte (URL : « noir ») ; Libellés d'options à revérifier sur le HTML brut
- **Audi RS Q8 4.0 TFSI quattro** (`audi-rsq8-2022`) : Énergie et version confirmées (l'ancien site ne les indique pas) ; CV fiscaux ; Garantie
- **Cupra Formentor VZ 2.0 TSI 333 4Drive** (`cupra-formentor-vz-333-2025`) : CV fiscaux ; Couleur confirmée (URL : « noir ») ; Transmission 4Drive à confirmer
- **Mercedes-Benz Classe C Coupé 220 d AMG Line** (`mercedes-classe-c-220d-coupe-amg-line-2019`) : Régime TVA ; CV fiscaux ; Garantie
- **Mercedes-Benz CLA Shooting Brake 200 d AMG Line** (`mercedes-cla-shooting-brake-200d-amg-line-2025`) : Couleur ; Régime TVA ; CV fiscaux ; Garantie ; Vérifier 1re MEC 04/2025 avec 59 900 km
- **Mercedes-Benz GLB 220 d AMG Line** (`mercedes-glb-220d-amg-line-2022`) : Régime TVA ; CV fiscaux ; Garantie
- **BMW X3 xDrive20d M Sport** (`bmw-x3-xdrive20d-m-sport-2021`) : Date de 1re MEC ; Couleur ; CV fiscaux ; Garantie
- **Mini John Cooper Works 231 Ultimate** (`mini-john-cooper-works-231-ultimate-2021`) : Régime TVA ; CV fiscaux ; Garantie
- **Mini Cooper 3 portes C Favoured** (`mini-cooper-3-portes-favoured-2024`) : STATUT : la fiche est à la fois dans le stock et dans /vendu. Vendue ou pas ? ; CV fiscaux ; Garantie
- **Volkswagen T-Roc R 2.0 TSI 4Motion Akrapovič** (`volkswagen-t-roc-r-akrapovic-2022`) : CV fiscaux ; Garantie
- **Renault Rafale E-Tech full hybrid 200 Esprit Alpine** (`renault-rafale-e-tech-200-esprit-alpine-2024`) : Régime TVA ; CV fiscaux ; Garantie ; Révision 09/2027 à 20 500 km alors que le véhicule a 21 500 km : à vérifier
- **Donkervoort D8 210 préparation Düchting** (`donkervoort-d8-2004`) : Régime TVA ; CV fiscaux ; Libellé « D8 210 » vs 281 ch à clarifier
- **Audi A3 Sportback 35 TDI S line** (`audi-a3-sportback-35-tdi-s-line-2025`) : Régime TVA ; CV fiscaux ; Garantie (MEC 05/2025 : garantie constructeur probable, à confirmer)
- **Seat Leon 1.4 e-Hybrid 204 Xcellence** (`seat-leon-e-hybrid-excellence-2020`) : Couleur ; Régime TVA ; CV fiscaux ; Garantie ; Ancien site : « hybride essence 1.5 L » ; l'e-Hybrid 204 est un 1.4 hybride rechargeable : à confirmer
- **Renault Clio 5 Blue dCi 100 Advanced** (`renault-clio-5-blue-dci-100-advanced-gris-schiste-2025`) : STATUT : la fiche est à la fois dans le stock et dans /vendu ; CV fiscaux ; Garantie constructeur
- **Renault Clio 5 Blue dCi 100 Advanced** (`renault-clio-5-blue-dci-100-advanced-noir-2025`) : CV fiscaux ; Garantie constructeur
- **Volkswagen T-Cross 1.0 TSI 110 Style DSG** (`volkswagen-t-cross-1-0-tsi-110-style-2024`) : CV fiscaux ; Garantie (MEC 08/2024 : garantie constructeur probable)
- **Renault Master L3H2 Grand Confort** (`renault-master-l3h2-grand-confort`) : La liste /utilitaires affiche le 180 à 35 998 € HT, la fiche à 35 698 € HT : quel prix ?
- **Renault Master L2H2 Grand Confort** (`renault-master-l2h2-grand-confort`) : Liste : « 150 » à 34 698 € ; fiche : « 180 » à 34 698 €. Quelle motorisation ?
- **Renault Trafic L1H1 / L2H1 130 Confort** (`renault-trafic-l1h1-130-confort`) : Liste /utilitaires : « L2H1 130 Confort » à 27 900 € HT ; fiche : 25 400 / 25 900 € HT. Quel prix ?
- **Renault Trafic L2H1 Energy dCi 145 Confort** (`renault-trafic-l2h1-145-energy-confort`) : Prix ; Encore disponible ?
- **Renault Trafic L2H1 145** (`renault-trafic-l2h1-145`) : Prix ; Encore disponible ? ; Photos nommées « Master » sur une fiche Trafic
- **Renault Express Van Blue dCi 95 Confort / Grand Confort** (`renault-express-van-blue-dci-95-gris-urban`) : Prix ; Combien d'exemplaires / couleurs ?
- **Renault Master Benne dCi 135 Confort, benne 3,20 m, coffre 1,30 m, roues jumelées** (`renault-master-benne-135-roues-jumelees`) : Prix ; Encore disponible ? ; Options copiées d'un fourgon (plancher bois, cloison, portes 180°) retirées : à confirmer
- **Fiat Talento L2H1 2.0 MultiJet 120 Pro Lounge** (`fiat-talento-l2h1-2-0-multijet-120-pro-lounge-2021`) : Prix ; Kilométrage ; Encore disponible ?
- **Fiat Ducato 3.3 t L3H2 2.3 MultiJet 140 Pro Lounge** (`fiat-ducato-l3h2-2-3-multijet-140-pro-lounge-2021`) : Prix ; Encore disponible ?
