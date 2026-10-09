(async () => {
  const { esc, pageAccueil, equipe, actesParCategorie, articles, fmt } = CEE;
  const IMG = '../img';
  const $app = document.getElementById('app');

  function acteCard(a) {
    const href = `actes/${esc(a.slug)}.html`;
    return `
      <a class="acte-card" href="${href}">
        <div class="thumb">${a.photo ? `<img class="photo" src="${esc(a.photo)}" alt="${esc(a.nom)}">` : ''}</div>
        <div class="name-row">
          ${a.esquisse ? `<img class="esquisse" src="${esc(a.esquisse)}" alt="">` : ''}
          <div>
            <div class="serif" style="font-size:17px;color:var(--navy)">${esc(a.nom)}</div>
            ${a.sousTitre ? `<div class="kicker">${esc(a.sousTitre)}</div>` : ''}
          </div>
        </div>
      </a>`;
  }

  function doctorRow(m) {
    return `
      <div style="display:flex;align-items:center;gap:18px">
        <img src="${esc(m.photo || '')}" alt="${esc(m.nom)}" style="width:96px;height:96px;object-fit:cover;flex-shrink:0;filter:grayscale(100%) contrast(1.05)">
        <div>
          <div class="serif" style="font-size:19px;color:var(--navy)">${esc(m.nom)}</div>
          <div class="kicker" style="margin:3px 0 10px">${esc(m.titre)}</div>
          ${m.doctolib ? `<a href="${esc(m.doctolib)}" class="link" style="font-size:13px">Prendre rendez-vous</a>` : ''}
        </div>
      </div>`;
  }

  function conseilCard(a) {
    const auteurs = a.auteurs.map(m => m.nom).join(' & ');
    return `
      <a href="conseils/${esc(a.slug)}.html" style="display:flex;flex-direction:column;gap:18px">
        ${a.image ? `<img src="${esc(a.image)}" alt="" style="width:100%;aspect-ratio:4/3;object-fit:cover">` : ''}
        <div style="display:flex;flex-direction:column;gap:8px">
          <div class="kicker">${esc(fmt(a.date))}${auteurs ? ` — ${esc(auteurs)}` : ''}</div>
          <h3 class="serif" style="margin:0;font-size:20px;font-weight:500;color:var(--navy);line-height:1.3">${esc(a.titre)}</h3>
        </div>
      </a>`;
  }

  let hero, team, groups, posts;
  try {
    [hero, team, groups, posts] = await Promise.all([pageAccueil(), equipe(), actesParCategorie(), articles()]);
  } catch (e) {
    $app.innerHTML = `<div style="padding:80px 72px">Impossible de charger le contenu. Réessayez plus tard.</div>`;
    return;
  }

  // Deux premiers membres = les deux chirurgiens : ordre tiré au hasard à
  // chaque chargement pour ne favoriser ni l'un ni l'autre. Le reste de
  // l'équipe (assistante médicale…) garde son ordre.
  const doctors = team.slice(0, 2);
  const rest = team.slice(2);
  if (Math.random() < 0.5) doctors.reverse();
  const teamOrdered = [...doctors, ...rest];

  $app.innerHTML = `
    ${CEE_CHROME.header('.')}

    <section class="hero-grid">
      <h1 style="grid-area:h1;margin:0;font-weight:400;font-family:'Inter',system-ui,sans-serif;font-size:21px;color:var(--muted)">Chirurgie et médecine esthétique<span class="kicker-sep"> — </span><br class="kicker-mobile-break">La Baule · Saint-Nazaire</h1>
      <div class="hero-photo-wrap" style="grid-area:photo">
        ${hero.photoHero ? `<img src="${esc(hero.photoHero)}" alt="" style="width:100%;aspect-ratio:3/4;object-fit:cover;display:block">` : ''}
      </div>
      <p class="serif" style="grid-area:p;margin:0;font-size:44px;line-height:1.25;color:var(--navy);max-width:520px">Bien dans son corps,<br>dans sa tête<br>et dans le regard des autres.</p>
      <a href="tel:+33240427459" class="btn-call" style="grid-area:cta;justify-self:start;margin-top:6px">Appeler le 02 40 42 74 59</a>
    </section>

    <section style="width:100%;box-sizing:border-box;padding:100px 72px;background:var(--navy);display:flex;flex-direction:column;align-items:center;gap:52px">
      <img src="${IMG}/logos/logo-cee-bg-bleu.svg" alt="Centre Esthétique de l'Estuaire" style="height:112px;width:auto">
      <h2 class="serif h2-nowrap" style="margin:0;text-align:center;font-size:26px;font-weight:400;line-height:1.55;color:#F2F5F8">Votre centre de chirurgie esthétique à Saint-Nazaire / La Baule</h2>
    </section>

    <section id="nos-actes" style="width:100%;box-sizing:border-box;padding:112px 72px;display:flex;flex-direction:column;gap:8px">
      <h2 class="serif h2-nowrap" style="margin:0 0 24px;font-size:32px;color:var(--navy)">Opérations de chirurgie esthétique et actes médicaux</h2>
      ${groups.map(g => `
        <div class="acte-category">
          <h3 class="serif" style="margin:0;font-size:22px;font-weight:500;color:var(--navy)">${esc(g.categorie?.nom || '')}</h3>
          <div class="acte-grid">${g.actes.map(acteCard).join('')}</div>
        </div>
      `).join('')}
    </section>

    <section id="equipe" style="width:100%;box-sizing:border-box;padding:112px 72px;background:var(--bg-soft);display:flex;flex-direction:column;gap:56px">
      <h2 class="serif h2-nowrap" style="margin:0;font-size:32px;color:var(--navy)">L'équipe du Centre Esthétique de l'Estuaire</h2>
      <div class="equipe-grid">${teamOrdered.map(doctorRow).join('')}</div>
    </section>

    <section id="cabinet" style="width:100%;box-sizing:border-box;padding:112px 72px;display:flex;flex-direction:column;gap:56px">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:40px;flex-wrap:wrap">
        <div style="display:flex;flex-direction:column;gap:10px">
          <div class="kicker">Saint-Nazaire</div>
          <h2 class="serif h2-nowrap" style="margin:0;font-size:36px;color:var(--navy)">Centre Esthétique de l'Estuaire</h2>
          <p style="margin:0;font-size:16px;color:var(--ink)">Bâtiment CAP Santé — 10 rue des Troènes, 44600 Saint-Nazaire</p>
          <p style="margin:0;font-size:13px;color:var(--muted)">Au 3e étage. L'entrée se situe entre le laboratoire d'analyses médicales et l'opticien.</p>
          <a href="https://www.google.com/maps?q=10+rue+des+Tro%C3%ABnes,+44600+Saint-Nazaire" target="_blank" rel="noopener" class="link" style="display:inline-flex;align-items:center;gap:8px;margin-top:4px;width:fit-content">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
            Itinéraire
          </a>
        </div>
      </div>
      <div class="cabinet-grid">
        <img src="${IMG}/locaux/cabinet.png" alt="Cabinet" style="grid-column:span 3;grid-row:span 2">
        <img src="${IMG}/locaux/accueil.png" alt="Accueil du cabinet" style="grid-column:span 2">
        <img src="${IMG}/locaux/salle-attente.png" alt="Salle d'attente" style="grid-column:span 1">
        <img src="${IMG}/locaux/cabinet-2.png" alt="Cabinet" style="grid-column:span 1">
        <img src="${IMG}/locaux/table-auscultation.png" alt="Table d'auscultation" style="grid-column:span 2">
      </div>
    </section>

    <section id="conseils" style="width:100%;box-sizing:border-box;padding:112px 72px 96px;display:flex;flex-direction:column;gap:56px">
      <h2 class="serif h2-nowrap" style="margin:0;font-size:36px;color:var(--navy)">Conseils</h2>
      <div class="conseils-grid">${posts.map(conseilCard).join('')}</div>
    </section>

    ${CEE_CHROME.footer('.')}
  `;

  CEE_CHROME.wire();
})();
