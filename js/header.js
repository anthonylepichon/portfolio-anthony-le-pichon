/*
 * Le header est déjà présent dans chaque page HTML.
 * JavaScript sert uniquement à ouvrir et fermer la navigation sur les petits écrans.
 */
const menuButton = document.querySelector(".site-header__menu-button");
const navigation = document.querySelector(".site-navigation");

if (menuButton !== null && navigation !== null) {
    menuButton.addEventListener("click", function () {
        const menuIsOpen = navigation.classList.contains("is-open");

        if (menuIsOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    /* La touche Échap permet de refermer le menu sans utiliser la souris. */
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            const menuIsOpen = navigation.classList.contains("is-open");

            if (menuIsOpen) {
                closeMobileMenu();
                menuButton.focus();
            }
        }
    });
}

function openMobileMenu() {
    navigation.classList.add("is-open");
    menuButton.classList.add("is-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Fermer le menu");
}

function closeMobileMenu() {
    navigation.classList.remove("is-open");
    menuButton.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Ouvrir le menu");
}
