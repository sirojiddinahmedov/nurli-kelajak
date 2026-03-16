
 const TG_TOKEN = 'YOUR_BOT_TOKEN'; // ← shu yerga token
 const TG_CHAT_ID = 'YOUR_CHAT_ID'; // ← shu yerga chat id

 async function sendTelegram(text) {
     if (TG_TOKEN === 'YOUR_BOT_TOKEN') {
         console.log('📨 [Telegram placeholder]:\n' + text);
         return true;
     }
     try {
         const r = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
             method: 'POST',
             headers: {
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify({
                 chat_id: TG_CHAT_ID,
                 text,
                 parse_mode: 'HTML'
             })
         });
         return r.ok;
     } catch (e) {
         console.error(e);
         return false;
     }
 }

 function buildMsg({
     name,
     phone,
     course,
     level,
     msg
 }) {
     return `🎓 <b>Yangi ariza — Nurli Kelajak</b>\n\n` +
         `👤 <b>Ism:</b> ${name}\n📞 <b>Telefon:</b> ${phone}\n📚 <b>Kurs:</b> ${course}` +
         (level ? `\n📊 <b>Daraja:</b> ${level}` : '') +
         (msg ? `\n💬 <b>Xabar:</b> ${msg}` : '') +
         `\n\n⏰ ${new Date().toLocaleString('uz-UZ')}`;
 }

 /* ─── THEME ───────────────────────────────────────── */
 const html = document.documentElement;
 const THEME_KEY = 'nk-theme';
 const applyTheme = t => {
     html.setAttribute('data-theme', t);
     localStorage.setItem(THEME_KEY, t);
 };
 const saved = localStorage.getItem(THEME_KEY);
 if (saved) applyTheme(saved);
 else if (window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('dark');
 document.getElementById('themeToggle').addEventListener('click', () =>
     applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')
 );

 /* ─── SIDEBAR ─────────────────────────────────────── */
 const sidebar = document.getElementById('sidebar');
 const backdrop = document.getElementById('sidebarBackdrop');
 const hamburger = document.getElementById('menuToggle');
 const sbClose = document.getElementById('sidebarClose');

 const openSidebar = () => {
     sidebar.classList.add('is-active');
     backdrop.classList.add('is-active');
     hamburger.classList.add('is-active');
     document.body.classList.add('no-scroll');
     hamburger.setAttribute('aria-expanded', 'true');
     sidebar.removeAttribute('aria-hidden');
     sbClose.focus();
 };
 const closeSidebar = () => {
     sidebar.classList.remove('is-active');
     backdrop.classList.remove('is-active');
     hamburger.classList.remove('is-active');
     document.body.classList.remove('no-scroll');
     hamburger.setAttribute('aria-expanded', 'false');
     sidebar.setAttribute('aria-hidden', 'true');
 };
 hamburger.addEventListener('click', openSidebar);
 sbClose.addEventListener('click', closeSidebar);
 backdrop.addEventListener('click', closeSidebar);
 sidebar.querySelectorAll('a').forEach(a => a.addEventListener('click', closeSidebar));

 /* ─── MODAL ───────────────────────────────────────── */
 const modal = document.getElementById('regModal');
 const modBackdrop = document.getElementById('modalBackdrop');
 const modClose = document.getElementById('modalClose');
 const modBody = document.getElementById('modalBody');
 const modSuccess = document.getElementById('modalSuccess');
 const modSubmit = document.getElementById('modalSubmit');
 const modSuccClose = document.getElementById('modalSuccessClose');
 let activeCourse = '';

 const openModal = (course, emoji, price) => {
     activeCourse = course;
     document.getElementById('modalCourseIcon').textContent = emoji;
     document.getElementById('modalSub').textContent = course + ' kursi uchun ariza';
     document.getElementById('modalPriceTag').textContent = price + ' / oy';
     ['m-name', 'm-phone', 'm-msg'].forEach(id => document.getElementById(id).value = '');
     document.getElementById('m-level').value = 'beginner';
     clearErr('m-name', 'm-name-err', 'm-phone', 'm-phone-err');
     modBody.hidden = false;
     modSuccess.hidden = true;
     modal.classList.add('is-active');
     modBackdrop.classList.add('is-active');
     document.body.classList.add('no-scroll');
     modal.removeAttribute('aria-hidden');
     setTimeout(() => document.getElementById('m-name').focus(), 120);
 };

 const closeModal = () => {
     modal.classList.remove('is-active');
     modBackdrop.classList.remove('is-active');
     document.body.classList.remove('no-scroll');
     modal.setAttribute('aria-hidden', 'true');
 };

 document.querySelectorAll('[data-open-modal]').forEach(btn =>
     btn.addEventListener('click', () => openModal(btn.dataset.course, btn.dataset.emoji, btn.dataset.price))
 );
 modClose.addEventListener('click', closeModal);
 modBackdrop.addEventListener('click', closeModal);
 modSuccClose.addEventListener('click', closeModal);

 /* ─── FORM HELPERS ────────────────────────────────── */
 function clearErr(...ids) {
     for (let i = 0; i < ids.length; i += 2) {
         const inp = document.getElementById(ids[i]);
         const err = document.getElementById(ids[i + 1]);
         if (inp) inp.classList.remove('form-input--error');
         if (err) err.classList.remove('is-visible');
     }
 }

 function showErr(inputId, errId) {
     document.getElementById(inputId)?.classList.add('form-input--error');
     document.getElementById(errId)?.classList.add('is-visible');
 }
 const phoneRe = /[\d]{9,}/;
 const isPhone = v => phoneRe.test(v.replace(/[\s+\-()]/g, ''));

 /* ─── MODAL SUBMIT ────────────────────────────────── */
 modSubmit.addEventListener('click', async () => {
     const name = document.getElementById('m-name').value.trim();
     const phone = document.getElementById('m-phone').value.trim();
     const level = document.getElementById('m-level').value;
     const msg = document.getElementById('m-msg').value.trim();
     clearErr('m-name', 'm-name-err', 'm-phone', 'm-phone-err');
     let ok = true;
     if (name.length < 2) {
         showErr('m-name', 'm-name-err');
         ok = false;
     }
     if (!isPhone(phone)) {
         showErr('m-phone', 'm-phone-err');
         ok = false;
     }
     if (!ok) return;
     modSubmit.textContent = 'Yuborilmoqda...';
     modSubmit.disabled = true;
     const levels = {
         beginner: "Boshlang'ich",
         intermediate: "O'rta",
         advanced: "Yuqori"
     };
     await sendTelegram(buildMsg({
         name,
         phone,
         course: activeCourse,
         level: levels[level],
         msg
     }));
     modSubmit.textContent = 'Arizani yuborish →';
     modSubmit.disabled = false;
     modBody.hidden = true;
     modSuccess.hidden = false;
 });

 /* ─── QUICK FORM SUBMIT ───────────────────────────── */
 document.getElementById('quickFormSubmit').addEventListener('click', async () => {
     const btn = document.getElementById('quickFormSubmit');
     const name = document.getElementById('qf-name').value.trim();
     const phone = document.getElementById('qf-phone').value.trim();
     const course = document.getElementById('qf-course').value;
     const msg = document.getElementById('qf-msg').value.trim();
     const succ = document.getElementById('quickFormSuccess');
     clearErr('qf-name', 'qf-name-err', 'qf-phone', 'qf-phone-err');
     let ok = true;
     if (name.length < 2) {
         showErr('qf-name', 'qf-name-err');
         ok = false;
     }
     if (!isPhone(phone)) {
         showErr('qf-phone', 'qf-phone-err');
         ok = false;
     }
     if (!ok) return;
     btn.textContent = 'Yuborilmoqda...';
     btn.disabled = true;
     const cl = {
         math: 'Matematika',
         english: 'Ingliz tili',
         it: 'IT & Dasturlash',
         '': 'Ko\'rsatilmagan'
     };
     await sendTelegram(buildMsg({
         name,
         phone,
         course: cl[course] || cl[''],
         msg
     }));
     ['qf-name', 'qf-phone', 'qf-msg'].forEach(id => document.getElementById(id).value = '');
     document.getElementById('qf-course').value = '';
     succ.removeAttribute('hidden');
     btn.textContent = 'Ariza yuborildi ✓';
     setTimeout(() => {
         btn.textContent = 'Ariza yuborish →';
         btn.disabled = false;
         succ.setAttribute('hidden', '');
     }, 4000);
 });

 /* ─── FAQ ACCORDION ───────────────────────────────── */
 document.querySelectorAll('.faq__question').forEach(btn => {
     btn.addEventListener('click', () => {
         const item = btn.closest('.faq__item');
         const isOpen = item.classList.contains('is-open');
         document.querySelectorAll('.faq__item.is-open').forEach(el => {
             el.classList.remove('is-open');
             el.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
         });
         if (!isOpen) {
             item.classList.add('is-open');
             btn.setAttribute('aria-expanded', 'true');
         }
     });
 });

 /* ─── ESCAPE KEY ──────────────────────────────────── */
 document.addEventListener('keydown', e => {
     if (e.key !== 'Escape') return;
     if (modal.classList.contains('is-active')) closeModal();
     if (sidebar.classList.contains('is-active')) closeSidebar();
 });

 /* ─── SCROLL REVEAL ───────────────────────────────── */
 const ro = new IntersectionObserver(entries => {
     entries.forEach(e => {
         if (e.isIntersecting) {
             e.target.classList.add('is-visible');
             ro.unobserve(e.target);
         }
     });
 }, {
     threshold: 0.1
 });
 document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

 /* ─── NAVBAR SHADOW ───────────────────────────────── */
 const navbar = document.querySelector('.navbar');
 window.addEventListener('scroll', () => {
     navbar.style.boxShadow = window.scrollY > 10 ? 'var(--shadow-md)' : 'none';
 }, {
     passive: true
 });