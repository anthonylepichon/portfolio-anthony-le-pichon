/*
 * Les compétences sont conservées dans un fichier JSON afin que leur nom,
 * leur niveau et leur icône soient modifiés à un seul endroit.
 */
const skillsCategories = document.querySelector("#skills-categories");
const skillsStatus = document.querySelector("#skills-status");

if (skillsCategories !== null && skillsStatus !== null) {
    fetch("../data/skills.json")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Le fichier des compétences n'a pas pu être chargé.");
            }

            return response.json();
        })
        .then(function (data) {
            displaySkillCategories(data.categories, data.meta.unknownLevelLabel);
            skillsStatus.textContent = "";
        })
        .catch(function (error) {
            skillsStatus.textContent = "Les compétences sont temporairement indisponibles.";
            console.error(error);
        });
}

function displaySkillCategories(categories, unknownLevelLabel) {
    /* Cette boucle évite innerHTML et retire proprement l'ancien contenu. */
    while (skillsCategories.firstChild !== null) {
        skillsCategories.removeChild(skillsCategories.firstChild);
    }

    for (let index = 0; index < categories.length; index++) {
        const categorySection = createSkillCategory(categories[index], unknownLevelLabel);
        skillsCategories.appendChild(categorySection);
    }
}

function createSkillCategory(category, unknownLevelLabel) {
    const section = document.createElement("section");
    section.className = "skills-category";

    const container = document.createElement("div");
    container.className = "skills-container skills-category__inner";

    const title = document.createElement("h2");
    title.className = "skills-category__title";
    title.id = "skills-category-" + category.id;

    const titleStart = document.createElement("span");
    titleStart.textContent = category.titleStart + " ";
    title.appendChild(titleStart);

    const titleAccent = document.createElement("span");
    titleAccent.className = "skills-category__title-accent";
    titleAccent.textContent = category.titleAccent;
    title.appendChild(titleAccent);

    section.setAttribute("aria-labelledby", title.id);
    container.appendChild(title);

    const list = document.createElement("ul");
    list.className = "skills-grid";

    for (let index = 0; index < category.skills.length; index++) {
        const skillCard = createSkillCard(category.skills[index], unknownLevelLabel);
        list.appendChild(skillCard);
    }

    container.appendChild(list);
    section.appendChild(container);

    return section;
}

function createSkillCard(skill, unknownLevelLabel) {
    const card = document.createElement("li");
    card.className = "skill-card";

    if (skill.highlighted === true) {
        const star = document.createElement("span");
        star.className = "skill-card__highlight";
        star.setAttribute("aria-hidden", "true");
        star.textContent = "★";
        card.appendChild(star);

        const highlightedText = document.createElement("span");
        highlightedText.className = "visually-hidden";
        highlightedText.textContent = "Compétence principale : ";
        card.appendChild(highlightedText);
    }

    const iconBackground = document.createElement("span");
    iconBackground.className = "skill-card__icon-background";

    const icon = document.createElement("img");
    icon.className = "skill-card__icon";
    icon.src = skill.icon;
    icon.alt = "";
    iconBackground.appendChild(icon);
    card.appendChild(iconBackground);

    const name = document.createElement("h3");
    name.className = "skill-card__name";
    name.textContent = skill.name;
    card.appendChild(name);

    const level = document.createElement("span");
    level.className = "skill-card__level";
    level.setAttribute("role", "img");

    const levelValue = document.createElement("span");
    levelValue.className = "skill-card__level-value";

    if (skill.level === null) {
        level.classList.add("skill-card__level--unknown");
        level.setAttribute("aria-label", "Niveau : " + unknownLevelLabel);
        levelValue.textContent = "?";
    } else {
        level.classList.add("skill-card__level--" + skill.level);
        level.setAttribute("aria-label", "Niveau déclaré : " + skill.level + " %");
        levelValue.textContent = skill.level + "%";
    }

    level.appendChild(levelValue);
    card.appendChild(level);

    return card;
}
