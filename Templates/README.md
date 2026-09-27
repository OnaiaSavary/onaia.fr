# Guide personnel — publier un nouvel article de vulgarisation

Ce dossier `Templates/` contient uniquement de la documentation personnelle. Il n'est
jamais lu par Astro (les pages du site viennent uniquement de `src/pages/` et les
articles de `src/content/vulgarisation/`), donc rien ici ne peut créer de page publique.

Contenu du dossier :

- `article-template.mdx` — modèle à dupliquer pour chaque nouvel article.
- `README.md` — ce guide.
- `site-structure.svg` — schéma de l'architecture du site (usage personnel).

---

## A. Créer un article

1. Copie `Templates/article-template.mdx` vers `src/content/vulgarisation/`.
2. Renomme la copie avec un nom de fichier en minuscules, mots séparés par des tirets,
   sans accents ni espaces (c'est ce nom, sans l'extension `.mdx`, qui devient l'URL de
   l'article). Exemple : `mon-nouvel-article.mdx` → `https://onaia.fr/vulgarisation/mon-nouvel-article/`.
   Regarde `glacon-ricard.mdx` et `modelisation-sismique-batiments.mdx` pour des exemples
   déjà en place.
3. Le fichier doit rester dans `src/content/vulgarisation/` : c'est ce dossier (déclaré
   comme collection `vulgarisation` dans `src/content/config.ts`) qui est automatiquement
   transformé en page par `src/pages/vulgarisation/[...slug].astro`. Aucune autre action
   n'est nécessaire pour que la route existe.
4. Remplis le frontmatter en haut du fichier (entre les `---`) :
   - `title` (obligatoire) : titre affiché sur la page.
   - `date` (optionnel) : `"YYYY-MM-DD"`.
   - `tags` (optionnel) : liste de mots-clés, ex. `["physique", "vulgarisation"]`.
   - `summary` (optionnel) : résumé court.
   - `cover` (optionnel) : chemin d'une image de couverture.
5. Écris le contenu en dessous du frontmatter, en Markdown, en t'appuyant sur les exemples
   du template (titres, listes, images, tableaux, vidéos, équations — voir sections C et D
   ci-dessous).

**Important — l'article n'apparaîtra pas automatiquement dans la liste "Outreach" :**
la page `src/pages/vulgarisation/index.astro` liste les articles à la main (elle n'est pas
générée automatiquement depuis la collection). Une fois ton article rédigé, ajoute un lien
vers lui dans la section de l'année correspondante de ce fichier, sur le modèle des entrées
existantes :

```html
<article id="mon-nouvel-article" class="outreach-entry">
  <h3><a href="/vulgarisation/mon-nouvel-article/">Titre de mon nouvel article</a></h3>
</article>
```

Ajoute aussi un lien correspondant dans le sommaire `<nav class="outreach-contents">` en
haut de la même page si tu veux qu'il apparaisse dans la table des matières.

---

## B. Ajouter des fichiers (images, GIF, vidéos, autres ressources)

Tout ce qui va dans `public/` est servi tel quel à la racine du site (le dossier `public/`
lui-même n'apparaît pas dans les URLs).

- **Images (PNG/JPG)** : place-les dans `public/images/` (les images déjà utilisées par le
  site — `article.png`, `mt180.png`, etc. — y sont). Un fichier `public/images/mon-image.png`
  se référence par le chemin `/images/mon-image.png`.
- **GIF** : même principe, dans `public/images/` (ou un sous-dossier dédié si tu préfères,
  par exemple `public/images/gifs/`).
- **Vidéos** : les vidéos ne sont pas hébergées sur le site — elles sont intégrées depuis
  YouTube via une iframe (voir section D). Si tu as un jour un fichier vidéo à héberger
  toi-même, un dossier comme `public/videos/` conviendrait, mais ce n'est pas la méthode
  actuellement utilisée sur le site.
- **Autres documents (PDF, etc.)** : suis la convention existante, par exemple
  `public/documents/` (déjà utilisé pour des présentations PDF) ou `public/posters/`.

Référence ensuite ces fichiers dans ton `.mdx` avec leur chemin réel, en commençant par `/`
(pas de chemin relatif), par exemple :

```mdx
<Figure src="/images/mon-image.png" alt="Description de l'image" />
```

---

## C. Ajouter des équations

Le site utilise **KaTeX** (via `remark-math` + `rehype-katex`, configurés dans
`astro.config.mjs`), pas MathJax. La feuille de style KaTeX est chargée une fois pour toutes
dans `src/layouts/BaseLayout.astro` — tu n'as rien à configurer dans l'article.

- Inline : `$E = mc^2$` → $E = mc^2$
- Centrée :

  ```mdx
  $$
  F = ma
  $$
  ```

- Plus complexe (fraction, indice, exposant), comme dans les articles existants :

  ```mdx
  $$
  \dfrac{d^2Z}{dt^2} + \dfrac{\omega_0}{Q}\dfrac{dZ}{dt} + \omega_0^2 Z = 0
  $$
  ```

---

## D. Ajouter une vidéo YouTube

Il n'existe pas de composant Astro dédié aux vidéos : réutilise directement le motif HTML
déjà utilisé ailleurs sur le site (`src/pages/vulgarisation/index.astro`,
`src/pages/conferences/index.astro`), qui fonctionne aussi dans un `.mdx` :

```mdx
<div class="video-embed">
  <iframe
    src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
    title="Titre descriptif de la vidéo"
    loading="lazy"
    referrerpolicy="strict-origin-when-cross-origin"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
  ></iframe>
</div>
```

Remplace `VIDEO_ID` par l'identifiant de la vidéo (après `/embed/` dans une URL
`youtube-nocookie.com`, ou après `v=` dans une URL YouTube classique).

---

## E. Prévisualiser l'article en local

Depuis la racine du projet :

```powershell
npm run dev
```

Astro démarre un serveur local (par défaut sur `http://localhost:4321/`). Ouvre
`http://localhost:4321/vulgarisation/mon-nouvel-article/` pour voir ton article, et
`http://localhost:4321/vulgarisation/` pour vérifier le lien que tu as ajouté dans la liste.
Vérifie en particulier : le rendu des équations, l'affichage des images/GIF, la lecture de
la vidéo intégrée, et l'absence d'erreur dans le terminal. Arrête le serveur avec `Ctrl+C`
quand tu as terminé.

---

## F. Publier l'article (procédure complète)

Une fois l'article terminé et vérifié en local :

1. Enregistre le fichier `.mdx` dans `src/content/vulgarisation/`.
2. Copie les images/GIF utilisés dans `public/images/` (ou le sous-dossier choisi).
3. Lance le site en local pour vérifier une dernière fois :

   ```powershell
   npm run dev
   ```

4. Vérifie le rendu de l'article et de la page `/vulgarisation/` dans le navigateur, puis
   arrête le serveur (`Ctrl+C`).
5. Lance le build de production et vérifie qu'il se termine sans erreur :

   ```powershell
   npm run build
   ```

6. Si le build affiche des erreurs, corrige-les avant de continuer.
7. Ajoute les fichiers modifiés/créés à Git :

   ```powershell
   git add src/content/vulgarisation/mon-nouvel-article.mdx public/images/mon-image.png src/pages/vulgarisation/index.astro
   ```

   (adapte la liste de fichiers à ce que tu as réellement créé ou modifié — utilise
   `git status` pour vérifier).
8. Crée le commit :

   ```powershell
   git commit -m "Add article: Mon nouvel article"
   ```

9. Pousse sur GitHub, sur la branche `main` :

   ```powershell
   git push origin main
   ```

Le workflow GitHub Actions `.github/workflows/deploy.yml` se déclenche automatiquement à
chaque push sur `main` : il installe les dépendances, lance `npm run build`, puis déploie
le contenu de `dist/` sur l'hébergement OVH par FTP. Tu peux suivre sa progression dans
l'onglet "Actions" du dépôt GitHub. Une fois le workflow terminé avec succès, l'article est
en ligne sur `onaia.fr`.

---

## G. Exemple minimal complet

```mdx
---
title: "Pourquoi le ciel est bleu"
date: "2026-03-01"
tags: ["physique", "optique", "vulgarisation"]
---

import Figure from '../../components/Figure.astro'

## Énoncé

Un paragraphe d'introduction expliquant le phénomène étudié, avec une équation inline
comme $\lambda \propto 1/\nu$.

<Figure src="/images/mon-image.png" alt="Schéma du phénomène" caption="Légende de l'image" />

### Questions :

1. Première question.
2. Deuxième question.

## Correction

### 1. Première question

Explication, avec une équation centrée :

$$
I(\lambda) \propto \dfrac{1}{\lambda^4}
$$
```
