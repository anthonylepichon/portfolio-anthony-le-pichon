/*
 * Les projets sont conservés dans un fichier JSON pour éviter de répéter les données
 * dans le HTML. Cette page affiche seulement les trois premiers projets du fichier.
 */
const projectsList = document.querySelector("#projects-list");

if (projectsList !== null) {
    fetch("data/projects.json")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Le fichier des projets n'a pas pu être chargé.");
            }

            return response.json();
        })
        .then(function (data) {
            displayProjects(data.projects, data.meta.defaultImage);
        })
        .catch(function (error) {
            projectsList.innerHTML = "";

            const errorMessage = document.createElement("p");
            errorMessage.className = "project-grid__status";
            errorMessage.setAttribute("role", "status");
            errorMessage.textContent = "Les projets sont temporairement indisponibles.";
            projectsList.appendChild(errorMessage);

            console.error(error);
        });
}

function displayProjects(projects, defaultImage) {
    projectsList.innerHTML = "";

    const maximumProjects = 3;
    let displayedProjects = 0;

    for (let index = 0; index < projects.length; index++) {
        if (displayedProjects < maximumProjects) {
            const projectCard = createProjectCard(projects[index], defaultImage);
            projectsList.appendChild(projectCard);
            displayedProjects = displayedProjects + 1;
        }
    }

    if (displayedProjects === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "project-grid__status";
        emptyMessage.setAttribute("role", "status");
        emptyMessage.textContent = "Aucun projet n'est encore disponible.";
        projectsList.appendChild(emptyMessage);
    }
}

function createProjectCard(project, defaultImage) {
    const card = document.createElement("article");
    card.className = "project-card";

    const image = document.createElement("img");
    image.className = "project-card__image";
    image.src = defaultImage;
    image.alt = "";
    image.loading = "lazy";
    card.appendChild(image);

    const content = document.createElement("div");
    content.className = "project-card__content";

    const title = document.createElement("h3");
    title.textContent = project.title;
    content.appendChild(title);

    const category = document.createElement("p");
    category.className = "project-card__category";
    category.textContent = project.categoryLabel;
    content.appendChild(category);

    const description = document.createElement("p");
    description.className = "project-card__description";
    description.textContent = project.description;
    content.appendChild(description);

    card.appendChild(content);

    return card;
}
