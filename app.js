/**
 * Streamix - Logiciel de lecture CinePulse
 * Fichier : app.js
 */

// ============================================
// CONFIGURATION
// ============================================
const MOVIX_URL = "https://cinepulse.lol/";

// ============================================
// ELEMENTS DOM
// ============================================
const serviceFrame = document.getElementById("service-frame");
const loadingOverlay = document.getElementById("loading");

// ============================================
// FONCTIONS UTILES
// ============================================

/**
 * Arrête l'affichage de l'écran de chargement
 */
const stopLoading = () => {
    if (loadingOverlay) {
        loadingOverlay.classList.add("hidden");
    }
};

/**
 * Tente de détecter si l'iframe est bloquée ou sur une page sensible (Google/Captcha)
 * pour proposer une ouverture externe si nécessaire.
 */
const startSecurityMonitor = () => {
    setInterval(() => {
        try {
            // Tentative de lecture de l'URL interne
            const currentUrl = serviceFrame.contentWindow.location.href;

            // Liste des domaines qui échouent souvent en iframe (Google, Captcha)
            const blockedDomains = [
                "accounts.google.com",
                "google.com/recaptcha",
                "api.arkoselabs.com",
                "checkpoint.cloudflare.com"
            ];

            const needsExternal = blockedDomains.some(domain => currentUrl.includes(domain));

            if (needsExternal) {
                console.warn("🔒 Flux sécurisé détecté. Ouverture externe via Electron...");
                // On utilise l'API de ton main.js pour ouvrir dans le vrai navigateur
                window.electronAPI.openExternalLink(currentUrl);
                // On remet l'iframe sur le site principal pour ne pas rester sur une erreur 403
                serviceFrame.src = MOVIX_URL;
            }
        } catch (e) {
            // L'erreur "Cross-Origin" est normale ici quand le site change de domaine.
            // On ne peut rien faire, mais c'est le comportement de sécurité standard.
        }
    }, 1000);
};

// ============================================
// INITIALISATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Gestion de la source initiale
    if (serviceFrame) {
        // Chargement du site cible
        serviceFrame.src = MOVIX_URL;

        // 2. Gestion des événements de chargement
        serviceFrame.onload = () => {
            stopLoading();
            console.log("✅ Page chargée avec succès");
        };

        serviceFrame.onerror = () => {
            stopLoading();
            console.error("❌ Erreur de chargement de la source");
        };

        // 3. Lancer la surveillance des flux bloqués (Option B / Captcha)
        startSecurityMonitor();
    }

    // 4. Timeout de sécurité (évite de rester bloqué sur le spinner indéfiniment)
    setTimeout(() => {
        if (loadingOverlay && !loadingOverlay.classList.contains("hidden")) {
            stopLoading();
            console.log("⏱️ Timeout de chargement atteint.");
        }
    }, 6000);
});

// ============================================
// COMMUNICATION AVEC ELECTRON (main.js)
// ============================================

// Exemple : Si tu as besoin d'envoyer des données vers le "store" d'Electron
const syncToElectron = (key, value) => {
    if (window.electronAPI && window.electronAPI.syncData) {
        window.electronAPI.syncData({
            type: 'update',
            key: key,
            value: value
        });
    }
};
