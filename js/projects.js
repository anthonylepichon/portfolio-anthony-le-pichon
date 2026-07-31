/*
 * Le fichier JSON est l'unique source des projets.
 * Pour ajouter ou modifier une carte, il suffit donc de modifier projects.json.
 */
const projectsList = document.querySelector("#projects-list");
const projectsFilters = document.querySelector("#projects-filters");
const projectsStatus = document.querySelector("#projects-status");

if (projectsList !== null && projectsFilters !== null && projectsStatus !== null) {
    fetch("../data/projects.json")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Le fichier des projets n'a pas pu être chargé.");
            }

            return response.json();
        })
        .then(function (data) {
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
            const featured = document.createElement("p");
            const featuredImage = document.createElement("img");

            featured.className = "projects-card__featured";
            featuredImage.src = featuredIcon;
            featuredImage.alt = "Projet à la une";

            featured.appendChild(featuredImage);
            visual.appendChild(featured);
        }

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
    const filterButtons = projectsFilters.querySelectorAll("button");

    for (let index = 0; index < filterButtons.length; index++) {
        filterButtons[index].classList.remove("is-active");
        filterButtons[index].setAttribute("aria-pressed", "false");
    }

    activeButton.classList.add("is-active");
    activeButton.setAttribute("aria-pressed", "true");
}

function filterProjects(categoryId, projects) {
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
    /* Cette boucle vide le conteneur sans utiliser innerHTML. */
    while (element.firstChild !== null) {
        element.removeChild(element.firstChild);
    }
}
