// ============================================
// CONFIGURATION
// ============================================
const MOVIX_URL = "https://cinepulse.lol/";

// ============================================
// LOGIQUE PRINCIPALE
// ============================================

const serviceFrame = document.getElementById("service-frame");
const loadingOverlay = document.getElementById("loading");

const stopLoading = () => {
  if (loadingOverlay && !loadingOverlay.classList.contains("hidden")) {
    loadingOverlay.classList.add("hidden");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  
  if (typeof StorageBridge !== 'undefined') {
      StorageBridge.set("last-service", "movix");
  } else {
      localStorage.setItem("streamix-last-service", "movix");
  }

  if (serviceFrame) {
      serviceFrame.src = MOVIX_URL;

      // SOLUTION B : Intercepter les tentatives de connexion
      // Note : À cause des restrictions de sécurité (Same-Origin), 
      // on ne peut pas lire l'URL interne de l'iframe si elle change de domaine.
      // On utilise donc un intervalle pour vérifier si l'iframe tente d'aller chez Google.
      
      const checkGoogleAuth = setInterval(() => {
        try {
          const currentUrl = serviceFrame.contentWindow.location.href;
          if (currentUrl.includes("accounts.google.com")) {
            // On ouvre Google dans un vrai onglet
            window.open(currentUrl, '_blank');
            // On remet l'iframe sur le site d'origine pour éviter l'erreur 403
            serviceFrame.src = MOVIX_URL; 
          }
        } catch (e) {
          // Si on a une erreur ici, c'est souvent parce que l'iframe est 
          // déjà sur un autre domaine (sécurité cross-origin).
          // C'est un signe que la navigation a quitté cinepulse.lol
        }
      }, 500);

      serviceFrame.onload = stopLoading;
      serviceFrame.onerror = stopLoading;
  }

  setTimeout(stopLoading, 4000);
});
