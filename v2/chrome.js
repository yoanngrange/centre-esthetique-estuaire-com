// Header + menu mobile + footer partagés par toutes les pages de /v2.
// `root` est le chemin relatif vers /v2/ depuis la page courante ("." pour
// index.html, ".." pour les pages dans un sous-dossier).
const CEE_CHROME = (() => {
  function header(root) {
    return `
    <div class="chrome-sticky">
      <header class="site-header">
        <a href="${root}/index.html" class="serif" style="font-size:19px;color:var(--navy);white-space:nowrap">Centre Esthétique de l'Estuaire</a>
        <nav class="nav-desktop" style="display:flex;align-items:center;gap:36px;font-size:15px">
          <a class="nav-link" href="${root}/index.html#nos-actes">Opérations &amp; Actes</a>
          <a class="nav-link" href="${root}/index.html#equipe">Équipe</a>
          <a class="nav-link" href="${root}/index.html#cabinet">Cabinet</a>
          <a class="nav-link" href="${root}/index.html#conseils">Conseils</a>
        </nav>
        <div style="display:flex;align-items:center;gap:20px">
          <a href="tel:+33240427459" class="link nav-desktop" style="white-space:nowrap">02 40 42 74 59</a>
          <button type="button" class="burger" id="cee-burger" aria-label="Menu"><span></span><span></span><span></span></button>
        </div>
      </header>
      <div class="nav-mobile" id="cee-nav-mobile">
        <a href="${root}/index.html#nos-actes">Opérations &amp; Actes</a>
        <a href="${root}/index.html#equipe">Équipe</a>
        <a href="${root}/index.html#cabinet">Cabinet</a>
        <a href="${root}/index.html#conseils">Conseils</a>
        <a href="tel:+33240427459" class="link" style="align-self:flex-start">02 40 42 74 59</a>
      </div>
    </div>`;
  }

  function footer(root) {
    return `
    <footer class="site-footer">
      <div class="footer-brand">Centre Esthétique de l'Estuaire</div>
      <div class="footer-links">
        <span>10 rue des Troènes, 44600 Saint-Nazaire</span>
        <a href="tel:+33240427459">02 40 42 74 59</a>
        <a href="${root}/mentions-legales.html">Informations légales</a>
      </div>
    </footer>`;
  }

  function wire() {
    const burger = document.getElementById('cee-burger');
    const panel = document.getElementById('cee-nav-mobile');
    if (!burger || !panel) return;
    burger.addEventListener('click', () => panel.classList.toggle('is-open'));
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => panel.classList.remove('is-open')));
  }

  return { header, footer, wire };
})();
