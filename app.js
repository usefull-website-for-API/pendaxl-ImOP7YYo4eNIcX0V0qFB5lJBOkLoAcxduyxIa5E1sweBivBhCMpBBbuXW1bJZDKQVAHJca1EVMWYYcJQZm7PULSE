// ============================================
// CONFIGURATION
// ============================================
const MOVIX_URL = "https://cinepulse.lol/";

// ============================================
// LOGIQUE PRINCIPALE
// ============================================

// On récupère uniquement les éléments qui existent encore dans votre HTML
const serviceFrame = document.getElementById("service-frame");
const loadingOverlay = document.getElementById("loading");

// Fonction pour arrêter le chargement (utilisée plusieurs fois)
const stopLoading = () => {
  if (loadingOverlay && !loadingOverlay.classList.contains("hidden")) {
    loadingOverlay.classList.add("hidden");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Sauvegarde pour la forme (optionnel, évite les erreurs si StorageBridge est absent)
  if (typeof StorageBridge !== 'undefined') {
      StorageBridge.set("last-service", "movix");
  } else {
      // Fallback simple si StorageBridge n'est pas défini
      localStorage.setItem("streamix-last-service", "movix");
  }

  // 2. Lancer le chargement du site
  if (serviceFrame) {
      serviceFrame.src = MOVIX_URL;

      // 3. Gestion de la fin du chargement
      serviceFrame.onload = stopLoading;
      serviceFrame.onerror = stopLoading;
  }

  // 4. SÉCURITÉ : Forcer l'arrêt du chargement après 4 secondes
  // C'est ça qui va empêcher le chargement infini si le site bloque
  setTimeout(() => {
    stopLoading();
    console.log("Chargement forcé terminé (Timeout de sécurité)");
  }, 4000);

});
