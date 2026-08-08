/*
 * Ce fichier gère le consentement à Google Analytics pour toutes les pages du portfolio.
 * La balise Google n'est jamais chargée tant que le visiteur n'a pas cliqué sur « Accepter ».
 * Le choix est conservé dans le navigateur pour ne pas afficher le bandeau à chaque page.
 */
(function () {
    const measurementId = "G-DEGXVTCYL5";
    const consentStorageKey = "analytics-consent";
    const acceptedChoice = "accepted";
    const refusedChoice = "refused";

    const consentBanner = document.querySelector(".cookie-banner");
    const consentTitle = document.querySelector("#cookie-consent-title");
    const acceptButton = document.querySelector("#cookie-consent-accept");
    const refuseButton = document.querySelector("#cookie-consent-refuse");
    const settingsButton = document.querySelector(".site-footer__cookie-settings");
    const consentStatus = document.querySelector("#cookie-consent-status");
    const contactForm = document.querySelector(".contact-form");

    let analyticsIsLoaded = false;
    let bannerWasOpenedFromSettings = false;

    /*
     * Si le HTML nécessaire manque, aucun suivi n'est lancé.
     * Cette sécurité évite une collecte accidentelle sur une page incomplète.
     */
    if (consentBanner === null || acceptButton === null || refuseButton === null || settingsButton === null) {
        return;
    }

    settingsButton.hidden = false;

    acceptButton.addEventListener("click", function () {
        saveConsentChoice(acceptedChoice);
        hideConsentBanner();
        loadGoogleAnalytics();
        announceConsentChoice("La mesure d'audience a été acceptée.");
    });

    refuseButton.addEventListener("click", function () {
        saveConsentChoice(refusedChoice);
        refuseGoogleAnalytics();
        hideConsentBanner();
        announceConsentChoice("La mesure d'audience a été refusée.");
    });

    /* Ce bouton permet de rouvrir le bandeau et de modifier un choix déjà enregistré. */
    settingsButton.addEventListener("click", function () {
        showConsentBanner(true);
    });

    /*
     * Le formulaire existe uniquement sur la page Contact.
     * L'événement indique qu'une demande a été envoyée sans transmettre le contenu des champs.
     */
    if (contactForm !== null) {
        contactForm.addEventListener("submit", function () {
            sendContactLeadEvent();
        });
    }

    const savedChoice = readConsentChoice();

    if (savedChoice === acceptedChoice) {
        loadGoogleAnalytics();
    } else if (savedChoice === refusedChoice) {
        refuseGoogleAnalytics();
    } else {
        showConsentBanner(false);
    }

    /*
     * Cette fonction lit uniquement la préférence de consentement enregistrée dans le navigateur.
     * Si le stockage local est bloqué, elle renvoie une chaîne vide et le bandeau reste disponible.
     */
    function readConsentChoice() {
        try {
            const storedChoice = window.localStorage.getItem(consentStorageKey);

            if (storedChoice === acceptedChoice || storedChoice === refusedChoice) {
                return storedChoice;
            }
        } catch (error) {
            return "";
        }

        return "";
    }

    /*
     * Le choix est enregistré sans envoyer d'information à un service externe.
     * En cas d'erreur de stockage, le choix reste valable pour la page en cours.
     */
    function saveConsentChoice(choice) {
        try {
            window.localStorage.setItem(consentStorageKey, choice);
        } catch (error) {
            return;
        }
    }

    /*
     * Le paramètre moveFocus vaut true uniquement lorsque le visiteur ouvre lui-même les réglages.
     * Au premier affichage, le bandeau ne vole donc pas le focus pendant la lecture de la page.
     */
    function showConsentBanner(moveFocus) {
        bannerWasOpenedFromSettings = moveFocus;
        consentBanner.hidden = false;

        if (moveFocus && consentTitle !== null) {
            consentTitle.focus();
        }
    }

    function hideConsentBanner() {
        consentBanner.hidden = true;

        if (bannerWasOpenedFromSettings) {
            settingsButton.focus();
        }

        bannerWasOpenedFromSettings = false;
    }

    /* Le message invisible confirme le choix aux personnes utilisant un lecteur d'écran. */
    function announceConsentChoice(message) {
        if (consentStatus !== null) {
            consentStatus.textContent = message;
        }
    }

    /*
     * generate_lead est le nom recommandé par GA4 pour une prise de contact commerciale.
     * La condition empêche tout envoi lorsque la mesure d'audience n'a pas été acceptée.
     */
    function sendContactLeadEvent() {
        if (analyticsIsLoaded && typeof window.gtag === "function" && window["ga-disable-" + measurementId] !== true) {
            window.gtag("event", "generate_lead", {
                method: "contact_form"
            });
        }
    }

    /*
     * La balise externe est créée seulement après l'accord du visiteur.
     * Elle est ajoutée en fin de body pour conserver tous les scripts après le contenu HTML.
     * Les fonctions publicitaires sont désactivées et les cookies expirent au plus tard après treize mois.
     */
    function loadGoogleAnalytics() {
        window["ga-disable-" + measurementId] = false;

        if (analyticsIsLoaded) {
            updateGoogleConsent("granted");
            return;
        }

        analyticsIsLoaded = true;
        window.dataLayer = window.dataLayer || [];
        window.gtag = sendGoogleCommand;

        window.gtag("consent", "default", {
            analytics_storage: "granted",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied"
        });
        window.gtag("js", new Date());
        window.gtag("config", measurementId, {
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
            cookie_expires: 33696000,
            cookie_update: false
        });

        const analyticsScript = document.createElement("script");
        analyticsScript.async = true;
        analyticsScript.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
        analyticsScript.addEventListener("error", function () {
            analyticsIsLoaded = false;
        });
        document.body.appendChild(analyticsScript);
    }

    /* Google lit les commandes placées dans dataLayer lorsque sa balise a fini de charger. */
    function sendGoogleCommand() {
        window.dataLayer.push(arguments);
    }

    /*
     * En cas de refus après une première acceptation, les prochains envois sont bloqués.
     * Les éventuels cookies _ga déjà présents sont ensuite supprimés du navigateur.
     */
    function refuseGoogleAnalytics() {
        window["ga-disable-" + measurementId] = true;
        updateGoogleConsent("denied");
        removeGoogleAnalyticsCookies();
    }

    function updateGoogleConsent(analyticsStorageValue) {
        if (typeof window.gtag === "function") {
            window.gtag("consent", "update", {
                analytics_storage: analyticsStorageValue,
                ad_storage: "denied",
                ad_user_data: "denied",
                ad_personalization: "denied"
            });
        }
    }

    /* La boucle recherche tous les cookies GA4, car leur suffixe dépend de l'identifiant du flux. */
    function removeGoogleAnalyticsCookies() {
        const cookies = document.cookie.split(";");

        for (let index = 0; index < cookies.length; index += 1) {
            const cookieParts = cookies[index].trim().split("=");
            const cookieName = cookieParts[0];

            if (cookieName === "_ga" || cookieName.startsWith("_ga_")) {
                expireAnalyticsCookie(cookieName);
            }
        }
    }

    /*
     * Les deux écritures couvrent le domaine courant et le domaine principal du portfolio.
     * Max-Age=0 demande au navigateur de supprimer immédiatement le cookie correspondant.
     */
    function expireAnalyticsCookie(cookieName) {
        document.cookie = cookieName + "=; Max-Age=0; path=/; SameSite=Lax";
        document.cookie = cookieName + "=; Max-Age=0; path=/; domain=.anthonylepichon.com; SameSite=Lax; Secure";
    }
}());
