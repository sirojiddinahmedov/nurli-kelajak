/* ── TELEGRAM CONFIG ── */
  const TG_TOKEN   = 'YOUR_BOT_TOKEN';  // @BotFather dan oling
  const TG_CHAT_ID = 'YOUR_CHAT_ID';   // @userinfobot dan oling

  async function sendTG(text) {
    if (TG_TOKEN === 'YOUR_BOT_TOKEN') { console.log('📨 TG:\n' + text); return true; }
    try {
      const r = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ chat_id: TG_CHAT_ID, text, parse_mode:'HTML' })
      });
      return r.ok;
    } catch(e) { return false; }
  }

  function buildMsg({ name, phone, course, level }) {
    return `🎓 <b>Yangi ariza — Nurli Kelajak</b>\n\n` +
      `👤 <b>Ism:</b> ${name}\n` +
      `📞 <b>Telefon:</b> +998${phone}\n` +
      `📚 <b>Kurs:</b> ${course}` +
      (level ? `\n📊 <b>Daraja:</b> ${level}` : '') +
      `\n\n⏰ ${new Date().toLocaleString('uz-UZ')}`;
  }

  /* ── PHONE INPUT: faqat raqam, 9 ta son ── */
  function initPhoneInput(inputId, wrapId) {
    const inp  = document.getElementById(inputId);
    const wrap = document.getElementById(wrapId);
    inp.addEventListener('input', () => {
      inp.value = inp.value.replace(/\D/g, '').slice(0, 9);
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && inp.value === '') e.preventDefault();
    });
  }
  initPhoneInput('qf-phone', 'qf-phone-wrap');
  initPhoneInput('m-phone',  'm-phone-wrap');

  /* ── THEME ── */
  const html = document.documentElement;
  const applyTheme = t => { html.setAttribute('data-theme', t); localStorage.setItem('nk-t', t); };
  const saved = localStorage.getItem('nk-t');
  if (saved) applyTheme(saved);
  else if (matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('dark');
  document.getElementById('themeToggle').addEventListener('click', () =>
    applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
  );

  /* ── SIDEBAR ── */
  const sidebar   = document.getElementById('sidebar');
  const sbBg      = document.getElementById('sidebarBackdrop');
  const hamburger = document.getElementById('menuToggle');
  const sbClose   = document.getElementById('sidebarClose');
  const openSB  = () => { sidebar.classList.add('is-active'); sbBg.classList.add('is-active'); hamburger.classList.add('is-active'); document.body.classList.add('no-scroll'); hamburger.setAttribute('aria-expanded','true'); sidebar.removeAttribute('aria-hidden'); sbClose.focus(); };
  const closeSB = () => { sidebar.classList.remove('is-active'); sbBg.classList.remove('is-active'); hamburger.classList.remove('is-active'); document.body.classList.remove('no-scroll'); hamburger.setAttribute('aria-expanded','false'); sidebar.setAttribute('aria-hidden','true'); };
  hamburger.addEventListener('click', openSB);
  sbClose.addEventListener('click', closeSB);
  sbBg.addEventListener('click', closeSB);
  sidebar.querySelectorAll('a').forEach(a => a.addEventListener('click', closeSB));

  /* ── MODAL ── */
  const modal       = document.getElementById('regModal');
  const modBg       = document.getElementById('modalBackdrop');
  const modClose    = document.getElementById('modalClose');
  const modBody     = document.getElementById('modalBody');
  const modSuccess  = document.getElementById('modalSuccess');
  const modSubmit   = document.getElementById('modalSubmit');
  const modSuccClose= document.getElementById('modalSuccessClose');
  let activeCourse  = '';

  const openModal = (course, emoji, price) => {
    activeCourse = course;
    document.getElementById('modalIcon').textContent = emoji;
    document.getElementById('modalSub').textContent  = course + ' kursi uchun ariza';
    document.getElementById('modalPrice').textContent= price + ' / oy';
    document.getElementById('m-name').value  = '';
    document.getElementById('m-phone').value = '';
    document.getElementById('m-level').value = 'beginner';
    clearErr('m-name','m-name-err'); clearPhoneErr('m-phone-wrap','m-phone-err');
    modBody.hidden = false; modSuccess.hidden = true;
    modal.classList.add('is-active'); modBg.classList.add('is-active');
    document.body.classList.add('no-scroll'); modal.removeAttribute('aria-hidden');
    setTimeout(() => document.getElementById('m-name').focus(), 120);
  };
  const closeModal = () => {
    modal.classList.remove('is-active'); modBg.classList.remove('is-active');
    document.body.classList.remove('no-scroll'); modal.setAttribute('aria-hidden','true');
  };

  document.querySelectorAll('[data-open-modal]').forEach(btn =>
    btn.addEventListener('click', () => openModal(btn.dataset.course, btn.dataset.emoji, btn.dataset.price))
  );
  modClose.addEventListener('click', closeModal);
  modBg.addEventListener('click', closeModal);
  modSuccClose.addEventListener('click', closeModal);

  /* ── FORM HELPERS ── */
  function clearErr(inputId, errId) {
    document.getElementById(inputId)?.classList.remove('form-input--error');
    document.getElementById(errId)?.classList.remove('is-visible');
  }
  function showErr(inputId, errId) {
    document.getElementById(inputId)?.classList.add('form-input--error');
    document.getElementById(errId)?.classList.add('is-visible');
  }
  function showPhoneErr(wrapId, errId) {
    document.getElementById(wrapId)?.classList.add('is-error');
    document.getElementById(errId)?.classList.add('is-visible');
  }
  function clearPhoneErr(wrapId, errId) {
    document.getElementById(wrapId)?.classList.remove('is-error');
    document.getElementById(errId)?.classList.remove('is-visible');
  }

  /* ── MODAL SUBMIT ── */
  modSubmit.addEventListener('click', async () => {
    const name  = document.getElementById('m-name').value.trim();
    const phone = document.getElementById('m-phone').value.trim();
    const level = document.getElementById('m-level').value;
    let ok = true;
    clearErr('m-name','m-name-err'); clearPhoneErr('m-phone-wrap','m-phone-err');
    if (name.length < 2)   { showErr('m-name','m-name-err');             ok = false; }
    if (phone.length !== 9){ showPhoneErr('m-phone-wrap','m-phone-err'); ok = false; }
    if (!ok) return;
    modSubmit.textContent = 'Yuborilmoqda...'; modSubmit.disabled = true;
    const lv = { beginner:"Boshlang'ich", intermediate:"O'rta", advanced:"Yuqori" };
    await sendTG(buildMsg({ name, phone, course: activeCourse, level: lv[level] }));
    modSubmit.textContent = 'Arizani yuborish →'; modSubmit.disabled = false;
    modBody.hidden = true; modSuccess.hidden = false;
  });

  /* ── QUICK FORM SUBMIT ── */
  document.getElementById('quickFormSubmit').addEventListener('click', async () => {
    const btn    = document.getElementById('quickFormSubmit');
    const name   = document.getElementById('qf-name').value.trim();
    const phone  = document.getElementById('qf-phone').value.trim();
    const course = document.getElementById('qf-course').value;
    const succ   = document.getElementById('quickFormSuccess');
    let ok = true;
    clearErr('qf-name','qf-name-err'); clearPhoneErr('qf-phone-wrap','qf-phone-err');
    if (name.length < 2)   { showErr('qf-name','qf-name-err');              ok = false; }
    if (phone.length !== 9){ showPhoneErr('qf-phone-wrap','qf-phone-err'); ok = false; }
    if (!ok) return;
    btn.textContent = 'Yuborilmoqda...'; btn.disabled = true;
    const cl = { math:'Matematika', english:'Ingliz tili', it:'IT & Dasturlash', '':'Aniqlanmagan' };
    await sendTG(buildMsg({ name, phone, course: cl[course] || cl[''] }));
    document.getElementById('qf-name').value  = '';
    document.getElementById('qf-phone').value = '';
    document.getElementById('qf-course').value = '';
    succ.classList.add('is-visible');
    btn.textContent = 'Ariza yuborildi ✓';
    setTimeout(() => {
      btn.textContent = 'Ariza yuborish →'; btn.disabled = false;
      succ.classList.remove('is-visible');
    }, 4000);
  });

  /* ── FAQ ACCORDION ── */
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq__item');
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq__item.is-open').forEach(el => {
        el.classList.remove('is-open');
        el.querySelector('.faq__question').setAttribute('aria-expanded','false');
      });
      if (!isOpen) { item.classList.add('is-open'); btn.setAttribute('aria-expanded','true'); }
    });
  });

  /* ── ESCAPE ── */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (modal.classList.contains('is-active'))   closeModal();
    if (sidebar.classList.contains('is-active')) closeSB();
  });

  /* ── SCROLL REVEAL ── */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); ro.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

  /* ── NAVBAR SHADOW ── */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = scrollY > 10 ? 'var(--shadow-md)' : 'none';
  }, { passive: true });