// small helpers
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// year
$('#year').textContent = new Date().getFullYear();

// mobile panel controls
const hambtn = $('#hambtn');
const panelWrap = $('#panelWrap');
const panelClose = $('#panelClose');
const backdrop = panelWrap.querySelector('.backdrop');

function openPanel() {
    hambtn.classList.add('open');
    hambtn.setAttribute('aria-expanded', 'true');
    panelWrap.classList.add('open');
    panelWrap.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}
function closePanel() {
    hambtn.classList.remove('open');
    hambtn.setAttribute('aria-expanded', 'false');
    panelWrap.classList.remove('open');
    panelWrap.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    hambtn.focus();
}

hambtn.addEventListener('click', () => panelWrap.classList.contains('open') ? closePanel() : openPanel());
if (panelClose) panelClose.addEventListener('click', closePanel);
backdrop.addEventListener('click', closePanel);
document.querySelectorAll('.panel nav a').forEach(a => a.addEventListener('click', closePanel));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && panelWrap.classList.contains('open')) closePanel(); });

// reveal on scroll (IntersectionObserver)
const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('inview'); obs.unobserve(en.target); }
    });
}, { threshold: 0.12 });
document.querySelectorAll('.hero-card, .coaching-card, .booking').forEach(n => io.observe(n));

// form submit (placeholder)
const form = $('#bookingForm');
const status = $('#status');
const toast = $('#toast');

function showToast(msg, ok = true) {
    toast.textContent = msg;
    toast.style.background = ok ? 'var(--accent-2)' : '#b00020';
    toast.classList.add('show');
    toast.classList.add('visible');
    toast.classList.add('show');
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 3200);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    status.style.display = 'block';
    status.textContent = 'Sending request... please wait';
    status.style.color = 'var(--muted)';

    const data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        session: form.session.value,
        message: form.message.value.trim()
    };

    try {
        // Replace '/api/book-session' with your real endpoint (Formspree, Netlify, Google Apps Script, etc.)
        const res = await fetch('/api/book-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (res.ok) {
            status.textContent = 'Thanks — your request was received. We will contact you to confirm the date and payment details.';
            status.style.color = 'var(--accent-2)';
            showToast('Request sent — thank you!');
            form.reset();
        } else {
            const txt = await res.text().catch(() => null);
            throw new Error(txt || 'Server error');
        }
    } catch (err) {
        console.error(err);
        status.textContent = 'There was a problem sending your request. Please email hello@example.com';
        status.style.color = '#b00020';
        showToast('Could not send request', false);
    }
});