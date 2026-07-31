/*
 * Les sections situées après le hero apparaissent au moment où elles entrent dans la zone visible.
 * Le header n'est jamais ciblé.
 */
(function () {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    const sections = document.querySelectorAll("main > section:not(:first-child)");

    if (sections.length === 0) {
        return;
    }

    sections.forEach(function (section) {
        section.classList.add("content-reveal");
    });

    if (!("IntersectionObserver" in window)) {
        sections.forEach(function (section) {
            section.classList.add("is-visible");
        });
        return;
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                observer.unobserve(entry.target);
                window.setTimeout(function () {
                    entry.target.classList.add("is-visible");
                }, 120);
            }
        });
    }, { threshold: 0.12 });

    sections.forEach(function (section) {
        observer.observe(section);
    });
}());