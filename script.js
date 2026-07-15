/* ═══ SHARED PORTFOLIO ENGINE ═══ */
/* Theme color is set per-version via CSS custom property --accent */

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initTyping();
    initCanvas();
    initReveal();
    initCounters();
    initForm();
    initParallax();
});

function initNav() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.pageYOffset > 60), { passive: true });
    toggle.addEventListener('click', () => { toggle.classList.toggle('active'); links.classList.toggle('active'); });
    links.querySelectorAll('a').forEach(l => l.addEventListener('click', () => { toggle.classList.remove('active'); links.classList.remove('active'); }));
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const t = document.querySelector(a.getAttribute('href'));
            if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
        });
    });
}

function initTyping() {
    const roles = ['Operations Strategist', 'F&B Systems Specialist', 'Menu Engineer', 'Restaurant Systems Designer'];
    const el = document.getElementById('typedRole');
    if (!el) return;
    let ri = 0, ci = 0, del = false, spd = 70;
    function tick() {
        const r = roles[ri];
        if (del) { el.textContent = r.substring(0, --ci); spd = 30; }
        else { el.textContent = r.substring(0, ++ci); spd = 70; }
        if (!del && ci === r.length) { spd = 2500; del = true; }
        else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; spd = 400; }
        setTimeout(tick, spd);
    }
    setTimeout(tick, 800);
}

function initCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // Read accent color from CSS
    const style = getComputedStyle(document.documentElement);
    const accentRaw = style.getPropertyValue('--accent-rgb').trim() || '0,180,255';
    let particles = [], af, mouse = { x: null, y: null };
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
    const count = Math.min(80, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < count; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.5 + 0.1 });
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
            if (mouse.x !== null) { const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.sqrt(dx*dx+dy*dy); if (d < 180) { p.x -= dx * 0.005; p.y -= dy * 0.005; } }
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${accentRaw}, ${p.opacity})`; ctx.fill();
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j], dx = p.x - p2.x, dy = p.y - p2.y, d = Math.sqrt(dx*dx+dy*dy);
                if (d < 140) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.strokeStyle = `rgba(${accentRaw}, ${(1 - d/140)*0.12})`; ctx.lineWidth = 0.5; ctx.stroke(); }
            }
        });
        af = requestAnimationFrame(draw);
    }
    draw();
    document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(af); else draw(); });
}

function initReveal() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

function initCounters() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { animC(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-target]').forEach(c => obs.observe(c));
}

function animC(el) {
    const target = parseInt(el.getAttribute('data-target')), dur = 2000, start = performance.now();
    function upd(ts) {
        const p = Math.min((ts - start) / dur, 1), ep = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.floor(ep * target);
        if (p < 1) requestAnimationFrame(upd); else el.textContent = target;
    }
    requestAnimationFrame(upd);
}

function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const orig = btn.innerHTML;
        btn.innerHTML = '<span>Sent ✓</span>';
        btn.style.opacity = '0.7';
        setTimeout(() => { btn.innerHTML = orig; btn.style.opacity = ''; form.reset(); }, 3000);
    });
}

function initParallax() {
    const hi = document.querySelector('.hero-bg-img'), pi = document.querySelector('.phil-bg-img');
    if (!hi && !pi) return;
    window.addEventListener('scroll', () => {
        const s = window.pageYOffset;
        if (hi && s < window.innerHeight) hi.style.transform = `translateY(${s * 0.25}px) scale(1.1)`;
        if (pi) { const r = document.querySelector('.philosophy-section').getBoundingClientRect(); if (r.top < window.innerHeight && r.bottom > 0) pi.style.transform = `translateY(${(r.top/window.innerHeight)*30}px) scale(1.1)`; }
    }, { passive: true });
}
