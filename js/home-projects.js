/*
 * Les réalisations de l'accueil utilisent la même source de données que la page Projets.
 * La propriété featured permet de choisir les trois cartes affichées ici sans dupliquer
 * leurs titres, catégories ou descriptions dans le HTML.
 */
const homeProjectsList = document.querySelector("#home-projects-list");
const homeProjectsStatus = document.querySelector("#home-projects-status");

if (homeProjectsList !== null && homeProjectsStatus !== null) {
    /* fetch lit le JSON depuis la racine du portfolio : il faut donc ouvrir le site via un serveur local ou hébergé. */
    fetch("data/projects.json")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Le fichier des projets n'a pas pu être chargé.");
            }

            return response.json();
        })
        .then(function (data) {
            const featuredProjects = getFeaturedProjects(data.projects);

            createFeaturedProjectCards(featuredProjects, data.meta.defaultImage);
            homeProjectsStatus.textContent = featuredProjects.length + " réalisations affichées.";
        })
        .catch(function (error) {
            /* Le message devient visible afin d'informer le visiteur si le chargement échoue. */
            homeProjectsStatus.classList.remove("visually-hidden");
            homeProjectsStatus.classList.add("project-grid__status");
            homeProjectsStatus.textContent = "Les réalisations ne peuvent pas être chargées pour le moment.";

            console.error(error);
        });
}

function getFeaturedProjects(projects) {
    const featuredProjects = [];

    /* La boucle conserve l'ordre défini dans le JSON et ne retient que les projets mis en avant. */
    for (let index = 0; index < projects.length; index++) {
        if (projects[index].featured === true) {
            featuredProjects.push(projects[index]);
        }
    }

    return featuredProjects;
}

function createFeaturedProjectCards(projects, defaultImage) {
    /* Vider le conteneur évite de dupliquer les cartes si cette fonction est réutilisée plus tard. */
    while (homeProjectsList.firstChild !== null) {
        homeProjectsList.removeChild(homeProjectsList.firstChild);
    }

    for (let index = 0; index < projects.length; index++) {
        const project = projects[index];
        const card = document.createElement("article");
        const visual = document.createElement("div");
        const projectImage = document.createElement("img");
        const content = document.createElement("div");
        const title = document.createElement("h3");
        const technologies = document.createElement("ul");
        const description = document.createElement("p");
        let imageSource = defaultImage;

        card.className = "project-card";
        visual.className = "project-card__visual";

        /* L'image définie dans le JSON remplace l'illustration générique dès qu'elle existe. */
        if (project.image !== undefined && project.image !== "") {
            imageSource = project.image;
        }

        projectImage.className = "project-card__image";
        projectImage.src = imageSource;
        projectImage.alt = "";
        projectImage.loading = "lazy";

        if (project.imageAlt !== undefined) {
            projectImage.alt = project.imageAlt;
        }

        visual.appendChild(projectImage);

        content.className = "project-card__content";
        title.textContent = project.title;
        technologies.className = "project-card__technologies";

        /* Chaque technologie reçoit sa propre pastille. La liste reste pilotée par le JSON,
         * ce qui évite d'écrire les mots-clés directement dans le JavaScript. */
        for (let technologyIndex = 0; technologyIndex < project.technologies.length; technologyIndex++) {
            const technology = document.createElement("li");

            technology.className = "project-card__technology";
            technology.textContent = project.technologies[technologyIndex];
            technologies.appendChild(technology);
        }

        description.className = "project-card__description";
        description.textContent = project.description;

        content.appendChild(technologies);

        if (project.status !== undefined) {
            /* Le statut est ajouté au contenu après les technologies et avant le titre. */
            const projectStatus = document.createElement("p");

            projectStatus.className = "project-card__status";
            projectStatus.textContent = project.status.label;

            if (project.status.id === "production") {
                projectStatus.classList.add("project-card__status--production");
            } else if (project.status.id === "development") {
                projectStatus.classList.add("project-card__status--development");
            }

            content.appendChild(projectStatus);
        }

        content.appendChild(title);
        content.appendChild(description);
        card.appendChild(visual);
        card.appendChild(content);
        homeProjectsList.appendChild(card);
    }
}
