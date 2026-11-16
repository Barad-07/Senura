(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Page load sequence
  window.addEventListener('load', () => setTimeout(() => document.body.classList.add('go'), reduce ? 0 : 500));
  $('#yr').textContent = new Date().getFullYear();

  // Nav: solid on scroll, hide on scroll down
  const nav = $('#nav'); let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('solid', y > 40);
    nav.classList.toggle('hide', y > lastY && y > 400 && !$('#menu').classList.contains('open'));
    lastY = y;
    if (!reduce && y < innerHeight) $('.hero__img').style.transform = `translateY(${y * 0.15}px) scale(1.08)`;
  }, { passive: true });

  // Mobile menu
  const burger = $('#burger'), menu = $('#menu');
  const setMenu = open => { menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); document.body.style.overflow = open ? 'hidden' : ''; };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('#menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

  // Image reveals
  if (!('IntersectionObserver' in window)) $$('.reveal-img').forEach(el => el.classList.add('in'));
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .05 }) : null;
  if (io) $$('.reveal-img').forEach(el => io.observe(el));

  // Service cards preselect goal
  $$('[data-goal]').forEach(a => a.addEventListener('click', () => { $('#goal').value = a.dataset.goal; }));

  // Cursor (fine pointers only)
  if (!reduce && matchMedia('(hover:hover)').matches) {
    const c = document.createElement('div'); c.className = 'cursor'; document.body.append(c); document.body.classList.add('has-cursor');
    addEventListener('mousemove', e => { c.classList.add('on'); c.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; }, { passive: true });
    $$('a,button,summary').forEach(el => { el.addEventListener('mouseenter', () => c.classList.add('big')); el.addEventListener('mouseleave', () => c.classList.remove('big')); });
  }

  // Before/after sliders
  $$('.ba').forEach(el => {
    const inp = $('input', el), set = v => { v = Math.max(0, Math.min(100, v)); el.style.setProperty('--pos', v + '%'); inp.value = v; };
    const at = e => { const r = el.getBoundingClientRect(); set((e.clientX - r.left) / r.width * 100); };
    let drag = false; el.addEventListener('dragstart', e => e.preventDefault());
    el.addEventListener('pointerdown', e => { if (document.body.classList.contains('editing')) return; drag = true; el.setPointerCapture(e.pointerId); at(e); });
    el.addEventListener('pointermove', e => { if (drag) at(e); });
    ['pointerup', 'pointercancel'].forEach(t => el.addEventListener(t, () => { drag = false; }));
    inp.addEventListener('input', () => set(+inp.value));
  });

  // Form validation
  const form = $('#form'), err = $('#formErr');
  const msgs = { name: 'full name', email: 'a valid email address', whatsapp: 'your WhatsApp number', age: 'your age', goal: 'a fitness goal', weight: 'your weight', height: 'your height', exp: 'your training experience', struggle: 'what you are struggling with', why: 'why you want to work with Senura', consent: 'consent to be contacted' };
  form.addEventListener('submit', e => {
    e.preventDefault();
    $$('.invalid', form).forEach(el => el.classList.remove('invalid'));
    const bad = $$('[required]', form).filter(el => el.type === 'checkbox' ? !el.checked : !el.checkValidity() || !el.value.trim());
    if (bad.length) {
      bad.forEach(el => el.classList.add('invalid'));
      err.textContent = `Please add ${msgs[bad[0].name] || 'the missing details'}${bad.length > 1 ? ` and ${bad.length - 1} more field${bad.length > 2 ? 's' : ''}` : ''}.`;
      bad[0].focus(); return;
    }
    err.textContent = '';
    const btn = $('.btn--submit'); btn.classList.add('loading'); $('span', btn).textContent = 'Sending';
    // TODO: replace with fetch() to your backend or form service
    setTimeout(() => {
      $('#doneName').textContent = form.name.value.split(' ')[0];
      form.hidden = true; $('#done').hidden = false; $('#done').focus();
      $('#contact').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    }, 1200);
  });
  form.addEventListener('input', e => e.target.classList.remove('invalid'));
})();
