# Centre Esthétique de l'Estuaire — V2

Refonte du site, pilotée par Airtable : tout le contenu (actes, équipe, blog,
mentions légales, photo d'accueil) est lu en direct depuis Airtable au
chargement de chaque page, sans étape de build. Même pattern que `/pain` et
caracteres-ameriques (token Airtable public en lecture seule, embarqué dans
`cee.js`).

## ⚠️ Avant de publier : créer le token Airtable

`cee.js` contient un `AT.key` à remplacer :

1. Aller sur https://airtable.com/create/tokens
2. Créer un token avec le scope **`data.records:read`** uniquement
3. L'accès doit être restreint à la seule base **"Centre Esthétique de
   l'Estuaire"** (`appoIhVnpmCvSxyEr`) — pas d'accès en écriture, pas d'accès
   aux autres bases
4. Copier le token dans `cee.js`, constante `AT.key`

C'est un token en lecture seule exposé côté client (comme sur `/pain`) : il
ne peut lire que des données déjà destinées à être publiques sur le site,
jamais écrire. Aucun autre secret à gérer.

## Architecture

```
v2/
  cee.js, cee.css, chrome.js   → logique Airtable + styles + header/footer, partagés par toutes les pages
  index.html, accueil.js       → page d'accueil
  actes/<slug>.html, acte.js   → une page par acte (gabarit identique, le slug vient du nom de fichier)
  conseils/<slug>.html, article.js → une page par article de blog
  mentions-legales.html, legal.js
```

Chaque page d'acte / d'article est un fichier HTML quasi-identique (même
`<head>`, mêmes balises `<script>`) : le contenu réel vient entièrement
d'Airtable au chargement, via le slug déduit du nom de fichier. Pour ajouter
un nouvel acte ou article : créer la ligne dans Airtable, puis dupliquer un
fichier HTML existant du bon dossier en le renommant `<slug>.html`.

## Tables Airtable (base `appoIhVnpmCvSxyEr`)

- **Page Accueil** — photo du hero (administrable, pas besoin de redéployer)
- **Catégories** — Visage / Silhouette / Seins / Chirurgie dermatologique / Médecine esthétique
- **Actes** — un acte par ligne : nom, sous-titre, catégorie, contenu (texte riche), médecins habilités, photo principale, galerie "Photos", esquisse
- **Équipe** — médecins + assistante, avec lien Doctolib
- **Articles** — billets de blog (Conseils)
- **Page mentions légales** / **Articles légaux** — titre global + un article par section légale

## Notes de design

- Esquisses body/poitrine : icônes pictogrammes abstraits (pas de silhouette
  anatomique réaliste) — c'est un choix délibéré, pas une limitation : plus
  discret et en phase avec l'image de marque, et plus fiable à générer
  (les prompts anatomiques réalistes sont filtrés par le modèle d'image).
- Ordre des deux chirurgiens (équipe, pages d'actes) tiré aléatoirement à
  chaque chargement pour ne favoriser ni l'un ni l'autre ; l'assistante
  médicale reste toujours en dernier.
