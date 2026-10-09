(async () => {
  const { esc, markdown, fmt, articleBySlug } = CEE;
  const $app = document.getElementById('app');
  const slug = location.pathname.split('/').filter(Boolean).pop().replace(/\.html$/, '');

  let a;
  try {
    a = await articleBySlug(slug);
  } catch (e) {
    $app.innerHTML = `<div style="padding:80px 72px">Impossible de charger le contenu. Réessayez plus tard.</div>`;
    return;
  }
  if (!a) {
    $app.innerHTML = `<div style="padding:80px 72px">Cette page n'existe pas. <a class="link" href="../index.html">Retour à l'accueil</a></div>`;
    return;
  }

  document.title = `${a.titre} — Centre Esthétique de l'Estuaire`;
  const auteurs = a.auteurs.map(m => m.nom).join(' & ');

  $app.innerHTML = `
    ${CEE_CHROME.header('..')}

    <div class="page-container">
      <div class="crumb" style="padding:22px 0 0">
        <a href="../index.html">Accueil</a>
        <span>→</span>
        <span><a href="../index.html#conseils">Conseils</a> - <span class="current">${esc(a.titre)}</span></span>
      </div>

      <section style="padding:24px 0 0;display:flex;flex-direction:column;gap:14px;max-width:680px">
        <div class="kicker">${esc(fmt(a.date))}${auteurs ? ` — ${esc(auteurs)}` : ''}</div>
        <h1 class="serif" style="margin:0;font-size:40px;color:var(--navy)">${esc(a.titre)}</h1>
      </section>

      ${a.image ? `
        <section style="padding:32px 0 0">
          <img src="${esc(a.image)}" alt="${esc(a.titre)}" style="width:100%;height:420px;object-fit:cover;display:block">
        </section>` : ''}

      <section style="padding:56px 0 120px">
        <div style="max-width:680px;display:flex;flex-direction:column;gap:22px;font-size:17px;line-height:1.8;color:var(--ink)">
          ${markdown(a.contenuMd)}
        </div>
      </section>
    </div>

    ${CEE_CHROME.footer('..')}
  `;
  CEE_CHROME.wire();
})();
