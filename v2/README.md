# Centre Esthétique de l'Estuaire — V2

Refonte du site, pilotée par Airtable : tout le contenu (actes, équipe, blog,
mentions légales, photo d'accueil) est lu en direct depuis Airtable au
chargement de chaque page. Même principe que `/pain` et caracteres-ameriques
(token Airtable public en lecture seule, lu depuis `cee.js`) — mais ici le
dépôt est public sur GitHub et sa protection anti-fuite de secrets refuse
tout commit contenant un vrai token. Le token n'est donc **jamais commité en
clair** : `cee.js` contient le placeholder `__AIRTABLE_PAT__`, et un workflow
GitHub Actions l'injecte au moment du déploiement sur GitHub Pages, à partir
du secret de dépôt `AIRTABLE_PAT`. Le token reste visible dans le code source
de la page publiée (normal et voulu : lecture seule, scope `data.records:read`,
restreint à cette seule base) — simplement plus dans l'historique git.

## Déploiement

Géré par `.github/workflows/deploy.yml` : à chaque push sur `main`, le
workflow remplace `__AIRTABLE_PAT__` par le secret `AIRTABLE_PAT` dans une
copie de `v2/cee.js`, puis publie tout le dépôt sur GitHub Pages. Pages doit
être configuré en source "GitHub Actions" (Settings → Pages → Build and
deployment), pas en déploiement classique depuis une branche.

## Token Airtable

Secret de dépôt `AIRTABLE_PAT`, géré dans Settings → Secrets and variables →
Actions. PAT Airtable en lecture seule (scope `data.records:read`), restreint
à la base `appoIhVnpmCvSxyEr`. Pour le régénérer : créer un nouveau token sur
https://airtable.com/create/tokens avec le même scope et le même accès
restreint, puis mettre à jour le secret `AIRTABLE_PAT`.

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
