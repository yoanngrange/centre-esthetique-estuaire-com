(async () => {
  const { esc, markdown, mentionsLegales } = CEE;
  const $app = document.getElementById('app');

  let page;
  try {
    page = await mentionsLegales();
  } catch (e) {
    $app.innerHTML = `<div style="padding:80px 72px">Impossible de charger le contenu. Réessayez plus tard.</div>`;
    return;
  }

  document.title = `${page.titre || 'Informations légales'} — Centre Esthétique de l'Estuaire`;

  $app.innerHTML = `
    ${CEE_CHROME.header('.')}

    <div class="page-container">
      <div class="crumb" style="padding:22px 0 0">
        <a href="index.html">Accueil</a>
        <span>→</span>
        <span class="current">${esc(page.titre || 'Informations légales')}</span>
      </div>

      <section style="padding:24px 0 56px">
        <h1 class="serif" style="margin:0;font-size:40px;color:var(--navy)">${esc(page.titre || 'Informations légales')}</h1>
      </section>

      <section style="padding:0 0 120px;display:flex;flex-direction:column;gap:56px;max-width:720px">
        ${page.articles.map(a => `
          <div>
            <h2 class="serif" style="margin:0 0 16px;font-size:24px;color:var(--navy)">${esc(a.titre)}</h2>
            <div style="font-size:16px;line-height:1.8;color:var(--ink)">${markdown(a.contenuMd)}</div>
          </div>
        `).join('')}
      </section>
    </div>

    ${CEE_CHROME.footer('.')}
  `;
  CEE_CHROME.wire();
})();
