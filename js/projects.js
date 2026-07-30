/*
 * Le contenu principal des cartes reste dans le HTML pour être disponible sans JavaScript.
 * Le fichier JSON sert à construire les filtres et à relier chaque projet à sa catégorie.
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
            createProjectFilters(data.filters, data.projects);
            filterProjects("all", data.projects);
        })
        .catch(function (error) {
            /* Les cartes restent visibles même si les filtres ne peuvent pas être créés. */
            projectsStatus.classList.remove("visually-hidden");
            projectsStatus.classList.add("projects-status");
            projectsStatus.textContent = "Les filtres sont indisponibles. Tous les projets restent visibles.";

            console.error(error);
        });
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
