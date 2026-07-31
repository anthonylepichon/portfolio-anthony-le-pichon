/*
 * Le fondu concerne uniquement le contenu principal : le header et le footer restent stables.
 * Les liens externes, les ancres et les téléchargements gardent leur comportement normal.
 */
(function () {
    const mainContent = document.querySelector("main");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (mainContent === null || reducedMotion) {
        return;
    }

    mainContent.classList.add("page-transition--initial");

    requestAnimationFrame(function () {
        mainContent.classList.remove("page-transition--initial");
        mainContent.classList.add("page-transition--entered");
    });

    document.addEventListener("click", function (event) {
        const link = event.target.closest("a[href]");

        if (link === null || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        const href = link.getAttribute("href");
        const destination = new URL(link.href, window.location.href);
        const isSamePage = destination.href === window.location.href;
        const isInternalPage = destination.origin === window.location.origin && destination.pathname !== window.location.pathname;

        if (href === null || href.startsWith("#") || link.target || link.hasAttribute("download") || !isInternalPage || isSamePage) {
            return;
        }

        event.preventDefault();
        mainContent.classList.remove("page-transition--entered");
        mainContent.classList.add("page-transition--leaving");

        window.setTimeout(function () {
            window.location.assign(destination.href);
        }, 200);
    });
}());