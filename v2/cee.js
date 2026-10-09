// Partagé par toutes les pages de /v2 — lecture Airtable en temps réel, sans
// étape de build. Même pattern que /pain et caracteres-ameriques : un token
// d'accès personnel (PAT) Airtable, lecture seule, scope data.records:read,
// restreint à cette seule base.
const CEE = (() => {
  const AT = {
    // TODO (Yoann) : remplacer par un vrai PAT Airtable en lecture seule,
    // scope data.records:read, restreint à la base appoIhVnpmCvSxyEr.
    // Créer sur https://airtable.com/create/tokens — voir README.md du dossier.
    key: 'REPLACE_WITH_READONLY_AIRTABLE_PAT',
    base: 'appoIhVnpmCvSxyEr',
    tables: {
      accueil: 'tbl4Kl5W7NB3Bc9Kw',
      categories: 'tblG26ymUr0uhaWle',
      actes: 'tblYK0mSWQ5pLMKjA',
      equipe: 'tblVbA2lpdbqnKSqm',
      articles: 'tblhPAfw22t1IWBWX',
      mlPage: 'tbl5zdrPJEkrsZH0N',
      mlArticles: 'tblLW2WRodkCcxnZ2',
    },
  };

  const F = {
    accueil: { champ: 'fldDIIf8YpdgYREvu', photoHero: 'fldrtx7sAtnMb1yPc' },
    cat: { nom: 'fldPPqZsQVULpMP5j', slug: 'fld1YmGweL7DnrwWo', ordre: 'fldsCAEyIjcGMATgZ' },
    acte: {
      nom: 'fldgwgGjWk7HiKnkM', sousTitre: 'fldYwtbvk9IvmaUG0', slug: 'fldLuIb8jQoSpPUim',
      categorie: 'fldYNkTwsUwQkyH3m', contenu: 'fldHpT2diGwQhUPLi', medecins: 'fldfQPcVFy4ADG1NF',
      photo: 'fldDlryLw8NpdjXRJ', photos: 'flddA6LYTZBRo5Q9F', esquisse: 'fldDuR00G9TiLXoS6',
      ordre: 'fld71o45SJLJHjbu1', statut: 'flddhZG1Hevw5A3tm',
    },
    equipe: {
      nom: 'fldCpJERBnOZsqIaI', titre: 'fldP8vQpCg6xO4NCr', bio: 'fldm0WYRSyKMQKb9r',
      photo: 'fldtFlp4jsTO7CWFu', doctolib: 'fldhygoigIsHFpHE7', ordre: 'fld4Zxszo9yjhMFGh',
    },
    article: {
      titre: 'fldR6yyZkemNywf4B', slug: 'fldPhh465oCc8l5SW', contenu: 'fldhRVzqqq0sLgjmo',
      auteur: 'fldrr3GuhySVYpqjK', date: 'fldeqNSNRcxarkhiz', image: 'flduQyO66XvuRZuUg',
    },
    mlPage: { titre: 'fldbWcoukTnA0yFg7' },
    mlArticle: { titre: 'fldrGczjwtXDOVfW9', contenu: 'fldUiHOogudEAXJVG', ordre: 'flds8Urvin8H8Dwdc' },
  };

  async function airtableList(tableId) {
    const qs = new URLSearchParams({ returnFieldsByFieldId: 'true' });
    let records = [], offset;
    do {
      if (offset) qs.set('offset', offset); else qs.delete('offset');
      const res = await fetch(`https://api.airtable.com/v0/${AT.base}/${tableId}?${qs}`, {
        headers: { Authorization: `Bearer ${AT.key}` },
      });
      if (!res.ok) throw new Error('airtable');
      const data = await res.json();
      records = records.concat(data.records);
      offset = data.offset;
    } while (offset);
    return records;
  }

  const att = (list) => (list || []).map(a => a.url);
  const att1 = (list) => (list && list[0]) ? list[0].url : null;

  async function categories() {
    const records = await airtableList(AT.tables.categories);
    return records
      .map(r => ({ id: r.id, nom: r.fields[F.cat.nom] || '', slug: r.fields[F.cat.slug] || '', ordre: Number(r.fields[F.cat.ordre] ?? 999) }))
      .sort((a, b) => a.ordre - b.ordre);
  }

  async function equipe() {
    const records = await airtableList(AT.tables.equipe);
    return records
      .map(r => {
        const f = r.fields;
        return {
          id: r.id,
          nom: f[F.equipe.nom] || '',
          titre: f[F.equipe.titre] || '',
          bio: f[F.equipe.bio] || '',
          photo: att1(f[F.equipe.photo]),
          doctolib: f[F.equipe.doctolib] || '',
          ordre: Number(f[F.equipe.ordre] ?? 999),
        };
      })
      .sort((a, b) => a.ordre - b.ordre);
  }

  async function actes() {
    const [records, cats, team] = await Promise.all([airtableList(AT.tables.actes), categories(), equipe()]);
    const catById = Object.fromEntries(cats.map(c => [c.id, c]));
    const medById = Object.fromEntries(team.map(m => [m.id, m]));
    return records
      .map(r => {
        const f = r.fields;
        const catIds = f[F.acte.categorie] || [];
        const medIds = f[F.acte.medecins] || [];
        return {
          id: r.id,
          nom: f[F.acte.nom] || '',
          sousTitre: f[F.acte.sousTitre] || '',
          slug: f[F.acte.slug] || '',
          categorie: catById[catIds[0]] || null,
          contenuMd: f[F.acte.contenu] || '',
          medecins: medIds.map(id => medById[id]).filter(Boolean),
          photo: att1(f[F.acte.photo]),
          photos: att(f[F.acte.photos]),
          esquisse: att1(f[F.acte.esquisse]),
          ordre: Number(f[F.acte.ordre] ?? 999),
          statut: f[F.acte.statut] || '',
        };
      })
      .filter(a => a.slug)
      .sort((a, b) => (a.categorie?.ordre ?? 999) - (b.categorie?.ordre ?? 999) || a.ordre - b.ordre || a.nom.localeCompare(b.nom, 'fr'));
  }

  async function acteBySlug(slug) {
    const all = await actes();
    return all.find(a => a.slug === slug) || null;
  }

  async function actesParCategorie() {
    const all = await actes();
    const groups = [];
    for (const a of all) {
      let g = groups.find(g => g.categorie?.id === a.categorie?.id);
      if (!g) { g = { categorie: a.categorie, actes: [] }; groups.push(g); }
      g.actes.push(a);
    }
    return groups.sort((a, b) => (a.categorie?.ordre ?? 999) - (b.categorie?.ordre ?? 999));
  }

  async function articles() {
    const [records, team] = await Promise.all([airtableList(AT.tables.articles), equipe()]);
    const medById = Object.fromEntries(team.map(m => [m.id, m]));
    return records
      .map(r => {
        const f = r.fields;
        const authIds = f[F.article.auteur] || [];
        return {
          id: r.id,
          titre: f[F.article.titre] || '',
          slug: f[F.article.slug] || '',
          contenuMd: f[F.article.contenu] || '',
          auteurs: authIds.map(id => medById[id]).filter(Boolean),
          date: f[F.article.date] || '',
          image: att1(f[F.article.image]),
        };
      })
      .filter(a => a.slug)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  async function articleBySlug(slug) {
    const all = await articles();
    return all.find(a => a.slug === slug) || null;
  }

  async function pageAccueil() {
    const records = await airtableList(AT.tables.accueil);
    const r = records[0];
    return { photoHero: r ? att1(r.fields[F.accueil.photoHero]) : null };
  }

  async function mentionsLegales() {
    const [pageRecords, articleRecords] = await Promise.all([
      airtableList(AT.tables.mlPage),
      airtableList(AT.tables.mlArticles),
    ]);
    const titre = pageRecords[0] ? (pageRecords[0].fields[F.mlPage.titre] || '') : '';
    const articlesLegaux = articleRecords
      .map(r => ({
        titre: r.fields[F.mlArticle.titre] || '',
        contenuMd: r.fields[F.mlArticle.contenu] || '',
        ordre: Number(r.fields[F.mlArticle.ordre] ?? 999),
      }))
      .sort((a, b) => a.ordre - b.ordre);
    return { titre, articles: articlesLegaux };
  }

  // Petit moteur Markdown -> HTML pour les champs "Rich text" Airtable (lus
  // en Markdown). Gère gras/italique, listes, titres, paragraphes. Échappe
  // d'abord le texte brut pour qu'aucun HTML injecté dans un champ ne fuite
  // dans la page, puis convertit la syntaxe markdown en vraies balises.
  function markdown(text) {
    if (!text) return '';
    const inline = s => esc(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(?:^|(?<=\s))\*(\S(?:.*?\S)?)\*(?=\s|$)/g, '<em>$1</em>');
    let html = '', list = null;
    const closeList = () => { if (list) { html += `</${list}>`; list = null; } };
    for (const raw of text.split('\n')) {
      const line = raw.trim();
      let m;
      if (!line) { closeList(); }
      else if ((m = line.match(/^#{1,6}\s+(.*)$/))) { closeList(); html += `<h3>${inline(m[1])}</h3>`; }
      else if ((m = line.match(/^[-•]\s+(.*)$/))) {
        if (list !== 'ul') { closeList(); html += '<ul>'; list = 'ul'; }
        html += `<li>${inline(m[1])}</li>`;
      } else if ((m = line.match(/^\d+[.)]\s+(.*)$/))) {
        if (list !== 'ol') { closeList(); html += '<ol>'; list = 'ol'; }
        html += `<li>${inline(m[1])}</li>`;
      } else { closeList(); html += `<p>${inline(line)}</p>`; }
    }
    closeList();
    return html;
  }

  const fmt = ymd => ymd ? new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${ymd}T12:00:00Z`)) : '';
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  return {
    categories, equipe, actes, acteBySlug, actesParCategorie,
    articles, articleBySlug, pageAccueil, mentionsLegales,
    markdown, esc, fmt,
  };
})();
