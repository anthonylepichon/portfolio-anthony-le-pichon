/*
 * Les filtres n'effacent aucun contenu : ils masquent seulement les cartes qui
 * ne correspondent pas au choix de l'utilisateur.
 */
const allButton = document.querySelector("#filter-all");
const trainingButton = document.querySelector("#filter-training");
const experienceButton = document.querySelector("#filter-experience");
const timelineEntries = document.querySelectorAll(".timeline-entry");

/*
 * Cette fonction met à jour l'apparence et l'information lue par les
 * technologies d'assistance grâce à aria-pressed.
 */
function updateActiveButton(activeButton) {
    const filterButtons = document.querySelectorAll(".timeline-filters__button");

    for (let index = 0; index < filterButtons.length; index++) {
        filterButtons[index].classList.remove("is-active");
        filterButtons[index].setAttribute("aria-pressed", "false");
    }

    activeButton.classList.add("is-active");
    activeButton.setAttribute("aria-pressed", "true");
}

function showAllEntries() {
    /* Toutes les entrées reprennent leur place dans la frise lorsqu'aucun filtre n'est appliqué. */
    for (let index = 0; index < timelineEntries.length; index++) {
        timelineEntries[index].hidden = false;
    }

    updateActiveButton(allButton);
}

function showEntriesByCategory(categoryClass, activeButton) {
    /* La classe reçue correspond aux catégories déjà écrites dans le HTML : formation ou expérience. */
    for (let index = 0; index < timelineEntries.length; index++) {
        if (timelineEntries[index].classList.contains(categoryClass)) {
            timelineEntries[index].hidden = false;
        } else {
            timelineEntries[index].hidden = true;
        }
    }

    updateActiveButton(activeButton);
}

/* Le test évite une erreur si ce script est chargé par erreur sur une autre page. */
if (allButton && trainingButton && experienceButton) {
    allButton.addEventListener("click", showAllEntries);

    trainingButton.addEventListener("click", function () {
        showEntriesByCategory("timeline-entry--training", trainingButton);
    });

    experienceButton.addEventListener("click", function () {
        showEntriesByCategory("timeline-entry--experience", experienceButton);
    });
}
