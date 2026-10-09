(async () => {
  const { esc, markdown, acteBySlug } = CEE;
  const $app = document.getElementById('app');
  const slug = location.pathname.split('/').filter(Boolean).pop().replace(/\.html$/, '');

  let a;
  try {
    a = await acteBySlug(slug);
  } catch (e) {
    $app.innerHTML = `<div style="padding:80px 72px">Impossible de charger le contenu. Réessayez plus tard.</div>`;
    return;
  }
  if (!a) {
    $app.innerHTML = `<div style="padding:80px 72px">Cette page n'existe pas. <a class="link" href="../index.html">Retour à l'accueil</a></div>`;
    return;
  }

  document.title = `${a.nom} — Centre Esthétique de l'Estuaire`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', `${a.nom}${a.sousTitre ? ' — ' + a.sousTitre : ''}, par le Centre Esthétique de l'Estuaire à Saint-Nazaire.`);

  // Deux médecins habilités = ordre tiré au hasard à chaque chargement pour
  // ne favoriser ni l'un ni l'autre.
  const medecins = [...a.medecins];
  if (medecins.length === 2 && Math.random() < 0.5) medecins.reverse();

  const galleryImgs = a.photos || [];

  $app.innerHTML = `
    ${CEE_CHROME.header('..')}

    <div class="page-container">
      <div class="crumb" style="padding:22px 0 0">
        <a href="../index.html">Accueil</a>
        <span>→</span>
        <span><a href="../index.html#nos-actes">${esc(a.categorie?.nom || '')}</a> - <span class="current">${esc(a.nom)}</span></span>
      </div>

      <section style="padding:24px 0 0;display:flex;flex-direction:column;gap:14px">
        <div class="kicker">${esc(a.categorie?.nom || '')}</div>
        <div style="display:flex;align-items:center;gap:28px">
          ${a.esquisse ? `<img src="${esc(a.esquisse)}" alt="" style="width:168px;height:168px;object-fit:contain;background:var(--bg-soft);flex-shrink:0">` : ''}
          <div style="display:flex;flex-direction:column;gap:8px">
            <h1 class="serif" style="margin:0;font-size:46px;color:var(--navy)">${esc(a.nom)}</h1>
            ${a.sousTitre ? `<p class="serif" style="margin:0;font-size:20px;font-weight:400;color:var(--muted)">${esc(a.sousTitre)}</p>` : ''}
          </div>
        </div>
      </section>

      ${a.photo ? `
        <section style="padding:32px 0 0">
          <img src="${esc(a.photo)}" alt="${esc(a.nom)}" style="width:100%;height:480px;object-fit:cover;display:block">
        </section>` : ''}

      <section style="padding:56px 0 0">
        <div style="max-width:680px;display:flex;flex-direction:column;gap:22px;font-size:17px;line-height:1.8;color:var(--ink)">
          ${markdown(a.contenuMd)}
        </div>
      </section>

      ${galleryImgs.length ? `
        <section class="acte-gallery" id="gallery">
          ${galleryImgs.map((src, i) => `
            <button type="button" data-idx="${i}">
              <img src="${esc(src)}" alt="${esc(a.nom)}">
            </button>
          `).join('')}
        </section>
        <div class="lightbox" id="lightbox" style="display:none">
          <img id="lightbox-img" src="" alt="${esc(a.nom)}">
          <button type="button" id="lightbox-close" aria-label="Fermer">&times;</button>
        </div>
      ` : ''}

      <section style="padding:56px 0 120px;display:flex;flex-direction:column;gap:24px;max-width:680px">
        <div class="kicker">Réalisable par</div>
        <div style="display:flex;gap:40px;flex-wrap:wrap;align-items:center">
          ${medecins.map(m => `
            <a href="${esc(m.doctolib || '#')}" style="display:flex;align-items:center;gap:16px">
              <img src="${esc(m.photo || '')}" alt="" style="width:64px;height:64px;object-fit:cover;flex-shrink:0;filter:grayscale(100%) contrast(1.05)">
              <span>
                <span class="serif" style="display:block;font-size:18px;color:var(--navy)">${esc(m.nom)}</span>
                <span class="link" style="font-size:13px;display:inline-block;margin-top:4px">Prendre rendez-vous</span>
              </span>
            </a>
          `).join('')}
          <a href="tel:+33240427459" class="btn-call">Appeler le 02 40 42 74 59</a>
        </div>
      </section>
    </div>

    ${CEE_CHROME.footer('..')}
  `;

  CEE_CHROME.wire();

  if (galleryImgs.length) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const open = (src) => { lightboxImg.src = src; lightbox.style.display = 'flex'; };
    const close = () => { lightbox.style.display = 'none'; lightboxImg.src = ''; };
    document.querySelectorAll('#gallery button').forEach(btn => {
      btn.addEventListener('click', () => open(galleryImgs[Number(btn.dataset.idx)]));
    });
    lightbox.addEventListener('click', close);
    document.getElementById('lightbox-close').addEventListener('click', close);
  }
})();
