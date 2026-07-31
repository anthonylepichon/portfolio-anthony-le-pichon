/*
 * Le fichier JSON est l'unique source des projets.
 * Pour ajouter ou modifier une carte, il suffit donc de modifier projects.json.
 * Le HTML contient seulement des conteneurs vides : le script les remplit après le chargement.
 */
const projectsList = document.querySelector("#projects-list");
const projectsFilters = document.querySelector("#projects-filters");
const projectsStatus = document.querySelector("#projects-status");

if (projectsList !== null && projectsFilters !== null && projectsStatus !== null) {
    /* fetch lit le fichier local ; cette étape doit être testée depuis un serveur local ou OVH. */
    fetch("../data/projects.json")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Le fichier des projets n'a pas pu être chargé.");
            }

            return response.json();
        })
        .then(function (data) {
            /* Les cartes et les filtres utilisent les mêmes données pour rester toujours cohérents. */
            createProjectCards(data.projects, data.meta.defaultImage, data.meta.featuredIcon);
            createProjectFilters(data.filters, data.projects);
            filterProjects("all", data.projects);
        })
        .catch(function (error) {
            /* Ce message visible explique le problème si le fichier JSON est indisponible. */
            projectsStatus.classList.remove("visually-hidden");
            projectsStatus.classList.add("projects-status");
            projectsStatus.textContent = "Les projets ne peuvent pas être chargés pour le moment.";

            console.error(error);
        });
}

function createProjectCards(projects, defaultImage, featuredIcon) {
    /* Vider la grille évite de dupliquer les cartes si la fonction est réutilisée plus tard. */
    removeChildren(projectsList);

    for (let index = 0; index < projects.length; index++) {
        const project = projects[index];
        const card = document.createElement("article");
        const visual = document.createElement("div");
        const projectImage = document.createElement("img");
        const content = document.createElement("div");
        const category = document.createElement("p");
        const title = document.createElement("h3");
        const description = document.createElement("p");
        let imageSource = defaultImage;

        card.id = "project-" + project.id;
        card.className = "projects-card";
        visual.className = "projects-card__visual";

        if (project.featured === true) {
            /* featured: true affiche uniquement la pastille jaune avec son étoile noire. */
            const featured = document.createElement("p");
            const featuredImage = document.createElement("img");

            featured.className = "projects-card__featured";
            featuredImage.src = featuredIcon;
            featuredImage.alt = "";

            featured.appendChild(featuredImage);
            visual.appendChild(featured);
        }

        /* L'image générique reste visible tant qu'une image de projet n'a pas été ajoutée au JSON. */
        if (project.image !== undefined && project.image !== "") {
            imageSource = project.image;
        }

        projectImage.className = "projects-card__image";
        projectImage.src = imageSource;
        projectImage.alt = "";
        projectImage.loading = "lazy";

        if (project.imageAlt !== undefined) {
            projectImage.alt = project.imageAlt;
        }

        content.className = "projects-card__content";
        category.className = "projects-card__category";
        /* textContent affiche les données comme du texte, sans interpréter de code HTML. */
        category.textContent = project.categoryLabel;
        title.textContent = project.title;
        description.className = "projects-card__description";
        description.textContent = project.description;

        visual.appendChild(projectImage);
        content.appendChild(category);
        content.appendChild(title);
        content.appendChild(description);
        card.appendChild(visual);
        card.appendChild(content);
        projectsList.appendChild(card);
    }
}

function createProjectFilters(filters, projects) {
    /* Chaque bouton transmet l'identifiant de sa catégorie à la fonction de filtrage. */
    removeChildren(projectsFilters);

    for (let index = 0; index < filters.length; index++) {
        const filter = filters[index];
        const button = document.createElement("button");

        button.className = "projects-filters__button";
        button.type = "button";
        button.textContent = filter.label;
        button.setAttribute("aria-pressed", "false");

        if (filter.id === "all") {
            button.classList.add("is-active");
            button.setAttribute("aria-pressed", "true");
        }

        button.addEventListener("click", function () {
            updateActiveFilter(button);
            filterProjects(filter.id, projects);
        });

        projectsFilters.appendChild(button);
    }
}

function updateActiveFilter(activeButton) {
    /* aria-pressed annonce quelle catégorie est active aux technologies d'assistance. */
    const filterButtons = projectsFilters.querySelectorAll("button");

    for (let index = 0; index < filterButtons.length; index++) {
        filterButtons[index].classList.remove("is-active");
        filterButtons[index].setAttribute("aria-pressed", "false");
    }

    activeButton.classList.add("is-active");
    activeButton.setAttribute("aria-pressed", "true");
}

function filterProjects(categoryId, projects) {
    /* hidden retire visuellement et sémantiquement les cartes qui ne correspondent pas au filtre. */
    let visibleProjects = 0;

    for (let index = 0; index < projects.length; index++) {
        const project = projects[index];
        const card = document.querySelector("#project-" + project.id);

        if (card !== null) {
            if (categoryId === "all" || project.categoryId === categoryId) {
                card.hidden = false;
                visibleProjects = visibleProjects + 1;
            } else {
                card.hidden = true;
            }
        }
    }

    projectsStatus.textContent = visibleProjects + " projets affichés.";
}

function removeChildren(element) {
    /* Cette boucle vide le conteneur sans utiliser innerHTML, ce qui préserve une manipulation explicite du DOM. */
    while (element.firstChild !== null) {
        element.removeChild(element.firstChild);
    }
}
