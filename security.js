(function() {
  // Vérification de la signature "StreamixApp" injectée par l'application
  const isStreamix = navigator.userAgent.includes('StreamixApp');

  // Si la signature est absente, on redirige immédiatement vers la page de refus
  if (!isStreamix) {
    // Stop le chargement du reste de la page
    window.stop(); 
    // Redirection vers la page denied
    window.location.replace('denied.html');
  }
})();
