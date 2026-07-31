/*
 * Les animations restent discrètes : elles accompagnent la lecture sans bloquer
 * l'accès au contenu. Le HTML reste visible si JavaScript est désactivé ou si
 * le navigateur ne prend pas en charge IntersectionObserver.
 */
const sectionsToReveal = document.querySelectorAll("main section");

if ("IntersectionObserver" in window) {
    /*
     * L'observateur surveille les sections qui entrent dans la zone visible.
     * Chaque section est animée une seule fois, puis retirée de l'observateur
     * afin d'éviter des animations répétées pendant le défilement.
     */
    const revealObserver = new IntersectionObserver(function (entries) {
        for (let index = 0; index < entries.length; index++) {
            if (entries[index].isIntersecting) {
                entries[index].target.classList.add("motion-reveal--visible");
                revealObserver.unobserve(entries[index].target);
            }
        }
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px"
    });

    for (let index = 0; index < sectionsToReveal.length; index++) {
        sectionsToReveal[index].classList.add("motion-reveal");
        revealObserver.observe(sectionsToReveal[index]);
    }
}
