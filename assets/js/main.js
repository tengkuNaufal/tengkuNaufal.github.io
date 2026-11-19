(() => {
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  $('#year').textContent = new Date().getFullYear();

  /* Theme */
  $('#themeToggle').addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* Nav: scrolled state, mobile menu, active link */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 20);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  $('#menuBtn').addEventListener('click', () => document.body.classList.toggle('menu-open'));
  $$('#navLinks a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

  const links = $$('#navLinks a');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  /* Cursor spotlight */
  if (!reduced && matchMedia('(pointer:fine)').matches) {
    addEventListener('pointermove', e => {
      root.style.setProperty('--mx', e.clientX + 'px');
      root.style.setProperty('--my', e.clientY + 'px');
    }, { passive: true });
  }

  /* Rotating role text (typewriter) */
  const words = ['full-stack products', 'AI-powered agents', 'reliable backends', 'data pipelines', 'hackathon winners'];
  const rot = $('#rotator');
  if (!reduced) {
    let w = 0, i = words[0].length, del = true;
    const tick = () => {
      const word = words[w];
      rot.textContent = word.slice(0, i);
      if (del) { i--; if (i < 0) { del = false; w = (w + 1) % words.length; i = 0; } }
      else { i++; if (i > words[w].length) { del = true; return setTimeout(tick, 1800); } }
      setTimeout(tick, del ? 40 : 75);
    };
    setTimeout(tick, 2200);
  }

  /* Counters */
  const count = el => {
    const target = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '';
    if (reduced) { el.textContent = target.toFixed(dec) + suf; return; }
    const t0 = performance.now(), dur = 1400;
    const step = t => {
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * e).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* Reveal on scroll */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      $$('[data-count]', e.target).forEach(count);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* Subtle 3D tilt on project screenshots */
  if (!reduced && matchMedia('(pointer:fine)').matches) {
    $$('.project .browser').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* Project filters */
  $$('.chip').forEach(chip => chip.addEventListener('click', () => {
    $$('.chip').forEach(c => c.classList.toggle('active', c === chip));
    const f = chip.dataset.filter;
    $$('.card').forEach(card => card.classList.toggle('hide', f !== 'all' && !card.dataset.cat.split(' ').includes(f)));
  }));

  /* Lightbox galleries */
  const galleries = {
    cogniva: [['cogniva-cover', 'Cogniva — learn by teaching'], ['cogniva-site', 'cogniva.web.id landing page']],
    cekdulu: [['cekdulu-desktop', 'Claim input'], ['cekdulu-report', 'Verification report'], ['cekdulu-sources', 'Official data sources'], ['cekdulu-mobile', 'Mobile view']],
    hirup: [['hirup-home', 'Home — live PM2.5 & trip ticket (demo mode)'], ['hirup-results', 'Routes ranked by inhaled PM2.5 dose'], ['hirup-detail', 'Route detail with exposure per leg'], ['hirup-profile', 'Profile & sensitivity settings']],
    mangrove: [['mangrove-map', 'Study area & Pareto solutions'], ['mangrove-results', 'Results panel'], ['mangrove-validation', 'Validation against published studies']],
    etl: [['etl-dw-erd', 'Data warehouse ERD (star schema)'], ['etl-relational', 'Relational schema'], ['etl-query', 'Query results']],
    cashync: [['cashync-dashboard', 'Manager dashboard'], ['cashync-cashier', 'Cashier transaction']],
    pemilu: [['pemilu', 'E-voting landing page']],
    linearstudio: [['linearstudio', 'Linear system solver']],
  };
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  let cur = [], idx = 0;
  const show = () => {
    const [file, cap] = cur[idx];
    lbImg.src = `assets/img/${file}.webp`; lbImg.alt = cap;
    lbCap.textContent = `${cap}  ·  ${idx + 1} / ${cur.length}`;
    $$('.lb-nav', lb).forEach(b => b.style.visibility = cur.length > 1 ? 'visible' : 'hidden');
  };
  const open = name => { cur = galleries[name]; idx = 0; show(); lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
  const close = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
  const move = d => { idx = (idx + d + cur.length) % cur.length; show(); };
  $$('[data-gallery]').forEach(el => el.addEventListener('click', () => open(el.dataset.gallery)));
  $$('[data-open]').forEach(el => el.addEventListener('click', () => open(el.dataset.open)));
  $('.lb-close', lb).addEventListener('click', close);
  $('.lb-prev', lb).addEventListener('click', () => move(-1));
  $('.lb-next', lb).addEventListener('click', () => move(1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') move(1);
    if (e.key === 'ArrowLeft') move(-1);
  });
})();
