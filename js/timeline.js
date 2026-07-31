/*
 * Le fichier JSON est l'unique source des expériences et formations.
 * Modifier data/experiences.json suffit donc pour mettre à jour la frise,
 * ses dates, ses cartes et les boutons de filtrage.
 */
const timelineList = document.querySelector("#timeline-list");
const timelineFilters = document.querySelector("#timeline-filters");
const timelineStatus = document.querySelector("#timeline-status");

if (timelineList !== null && timelineFilters !== null && timelineStatus !== null) {
    /* fetch lit le JSON : cette page doit être ouverte avec un serveur local ou sur le site hébergé. */
    fetch("../data/experiences.json")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Le fichier du parcours n'a pas pu être chargé.");
            }

            return response.json();
        })
        .then(function (data) {
            /* Les entrées sont créées avant les filtres pour que chaque bouton puisse agir sur la frise. */
            createTimelineEntries(data.experiences);
            createTimelineFilters(data.filters, data.experiences);
            filterTimeline("all", data.experiences);
        })
        .catch(function (error) {
            /* Le message devient visible si le JSON n'est pas accessible. */
            timelineStatus.classList.remove("visually-hidden");
            timelineStatus.classList.add("timeline-status");
            timelineStatus.textContent = "Le parcours ne peut pas être chargé pour le moment.";

            console.error(error);
        });
}

function createTimelineEntries(experiences) {
    removeChildren(timelineList);

    for (let index = 0; index < experiences.length; index++) {
        const experience = experiences[index];
        const entry = document.createElement("li");
        const date = document.createElement("span");
        const card = document.createElement("article");
        const title = document.createElement("h3");
        const organization = document.createElement("p");
        const description = document.createElement("p");
        let positionClass = "timeline-entry--right";

        /* L'alternance droite/gauche dépend de l'ordre dans le JSON, comme dans la frise initiale. */
        if (index % 2 !== 0) {
            positionClass = "timeline-entry--left";
        }

        entry.id = "timeline-entry-" + experience.id;
        entry.className = "timeline-entry " + positionClass + " timeline-entry--" + experience.categoryId;
        date.className = "timeline-entry__date";
        date.textContent = experience.period;
        card.className = "timeline-card";
        title.textContent = experience.title;
        organization.className = "timeline-card__organization";
        organization.textContent = experience.organization;
        description.textContent = experience.description;

        card.appendChild(title);
        card.appendChild(organization);
        card.appendChild(description);
        entry.appendChild(date);
        entry.appendChild(card);
        timelineList.appendChild(entry);
    }
}

function createTimelineFilters(filters, experiences) {
    removeChildren(timelineFilters);

    for (let index = 0; index < filters.length; index++) {
        const filter = filters[index];
        const button = document.createElement("button");

        button.className = "timeline-filters__button";
        button.type = "button";
        button.textContent = filter.label;
        button.setAttribute("aria-pressed", "false");

        if (filter.id === "all") {
            button.classList.add("is-active");
            button.setAttribute("aria-pressed", "true");
        }

        button.addEventListener("click", function () {
            updateActiveButton(button);
            filterTimeline(filter.id, experiences);
        });

        timelineFilters.appendChild(button);
    }
}

function updateActiveButton(activeButton) {
    const filterButtons = timelineFilters.querySelectorAll("button");

    /* aria-pressed indique quelle catégorie est actuellement affichée aux technologies d'assistance. */
    for (let index = 0; index < filterButtons.length; index++) {
        filterButtons[index].classList.remove("is-active");
        filterButtons[index].setAttribute("aria-pressed", "false");
    }

    activeButton.classList.add("is-active");
    activeButton.setAttribute("aria-pressed", "true");
}

function filterTimeline(categoryId, experiences) {
    let visibleEntries = 0;

    for (let index = 0; index < experiences.length; index++) {
        const experience = experiences[index];
        const entry = document.querySelector("#timeline-entry-" + experience.id);

        if (entry !== null) {
            if (categoryId === "all" || experience.categoryId === categoryId) {
                entry.hidden = false;
                visibleEntries = visibleEntries + 1;
            } else {
                entry.hidden = true;
            }
        }
    }

    timelineStatus.textContent = visibleEntries + " éléments affichés dans le parcours.";
}

function removeChildren(element) {
    /* Cette boucle vide le conteneur sans utiliser innerHTML pour garder une manipulation du DOM explicite. */
    while (element.firstChild !== null) {
        element.removeChild(element.firstChild);
    }
}
