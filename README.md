# Portfolio - Anthony Le Pichon

Portfolio professionnel d’Anthony Le Pichon, développeur web full stack freelance et consultant digital.

Le site est en ligne sur [anthonylepichon.com](https://anthonylepichon.com).

## Aperçu

Le portfolio présente :

- le parcours professionnel et les formations ;
- les compétences techniques, notamment PC SOFT et développement web ;
- une sélection de projets ;
- un formulaire de contact géré par Formspree ;
- les pages de mentions légales et de politique de confidentialité.

### Page d’accueil

![Page d’accueil du portfolio](assets/documents/Maquette%20desktop%201440%20px/Accueil.jpg)

### Projets

![Page projets du portfolio](assets/documents/Maquette%20desktop%201440%20px/Projets.jpg)

### Version mobile

![Accueil du portfolio sur mobile](assets/documents/Maquette%20mobile%20390%20px/Mobile%20-%20Accueil.jpg)

## Technologies utilisées

- HTML5 sémantique ;
- SCSS compilé en CSS ;
- JavaScript natif ;
- fichiers JSON pour les contenus dynamiques ;
- Formspree pour l’envoi du formulaire de contact ;
- hébergement Web OVHcloud.

Le projet ne dépend d’aucun framework JavaScript ou CSS.

## Lancer le projet localement

1. Cloner ou télécharger ce dépôt.
2. Ouvrir le dossier dans Visual Studio Code.
3. Lancer `index.html` avec l’extension Live Server.

L’utilisation d’un serveur local est recommandée, car les compétences, expériences et projets sont chargés depuis des fichiers JSON avec JavaScript.

## Organisation du projet

```text
assets/             Images, polices et document PDF public
css/                Feuille CSS compilée utilisée par les pages
data/               Sources des contenus dynamiques au format JSON
js/                 Comportements JavaScript du site
pages/              Pages secondaires du portfolio
scss/               Sources SCSS à compiler vers css/style.css
index.html          Page d’accueil
robots.txt          Consignes destinées aux moteurs de recherche
sitemap.xml         Liste des pages à explorer par les moteurs de recherche
```

## Gérer les contenus

Les fichiers JSON sont les sources uniques des contenus correspondants :

- `data/projects.json` : cartes de projets ;
- `data/skills.json` : catégories et compétences techniques ;
- `data/experiences.json` : frise du parcours professionnel et des formations.

Pour ajouter un projet, modifier `data/projects.json`. Les trois projets ayant la propriété `"featured": true` sont affichés dans la section Projets de la page d’accueil.

## Contact

Le formulaire de contact envoie les messages vers Formspree avec un formulaire HTML classique. Aucun serveur PHP ni base de données n’est utilisé par le projet.

## Publication

Le site est déployé sur un hébergement Web OVHcloud par SFTP.

Avant une publication, tester le site localement puis envoyer uniquement les fichiers nécessaires au navigateur :

- `index.html` ;
- `pages/` ;
- `assets/` ;
- `css/` ;
- `js/` ;
- `data/` ;
- `robots.txt` et `sitemap.xml`.

Les fichiers de configuration SFTP et les CV Word modifiables restent locaux : ils sont exclus de Git et du transfert vers l’hébergement.

## Qualité

Un audit Lighthouse réalisé sur la version publique a obtenu les scores suivants :

| Performance | Accessibilité | Bonnes pratiques | SEO |
| --- | --- | --- | --- |
| 100 | 96 | 100 | 100 |

## Auteur

Anthony Le Pichon
[LinkedIn](https://www.linkedin.com/in/anthonylepichon/) · [GitHub](https://github.com/anthonylepichon) · [Portfolio](https://anthonylepichon.com)
