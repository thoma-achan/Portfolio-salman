/* ═══════════════════════════════════════════════════════════════
   SALMAN UL FARISI — PORTFOLIO V2
   NEON RED INTERACTIVE ENGINE
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initNavigation();
    initHeroTyping();
    initHeroCanvas();
    initRevealAnimations();
    initAnimatedCounters();
    initContactForm();
    initParallax();
});

/* ═══════════════════════════════════════════════════════════════
   CURSOR GLOW — Neon red ambient light following cursor
   ═══════════════════════════════════════════════════════════════ */

function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || window.innerWidth < 768) return;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glow.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
        glow.classList.remove('active');
    });

    function animate() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animate);
    }
    animate();
}

/* ═══════════════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════════════ */

function initNavigation() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.pageYOffset > 60);
    }, { passive: true });

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('active');
    });

    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('active');
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - offset,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ═══════════════════════════════════════════════════════════════
   HERO TYPING — Neon role switcher
   ═══════════════════════════════════════════════════════════════ */

function initHeroTyping() {
    const roles = [
        'Operations Strategist',
        'F&B Systems Specialist',
        'Menu Engineer',
        'Restaurant Systems Designer'
    ];

    const el = document.getElementById('typedRole');
    if (!el) return;

    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let speed = 70;

    function tick() {
        const current = roles[roleIdx];

        if (deleting) {
            el.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            speed = 30;
        } else {
            el.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            speed = 70;
        }

        if (!deleting && charIdx === current.length) {
            speed = 2800;
            deleting = true;
        } else if (deleting && charIdx === 0) {
            deleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            speed = 400;
        }

        setTimeout(tick, speed);
    }

    setTimeout(tick, 800);
}

/* ═══════════════════════════════════════════════════════════════
   HERO CANVAS — Neon red particle network
   ═══════════════════════════════════════════════════════════════ */

function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;
    let mouse = { x: null, y: null };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    const count = Math.min(90, Math.floor(window.innerWidth / 18));
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.6 + 0.1
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Mouse repulsion
            if (mouse.x !== null) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180) {
                    const force = (180 - dist) / 180;
                    p.x -= dx * force * 0.008;
                    p.y -= dy * force * 0.008;
                }
            }

            // Draw particle with neon glow
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 0, 51, ${p.opacity})`;
            ctx.shadowColor = 'rgba(255, 0, 51, 0.3)';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Connections
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 140) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    const alpha = (1 - dist / 140) * 0.12;
                    ctx.strokeStyle = `rgba(255, 0, 51, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            // Mouse connections
            if (mouse.x !== null) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 200) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    const alpha = (1 - dist / 200) * 0.15;
                    ctx.strokeStyle = `rgba(255, 26, 71, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        animFrame = requestAnimationFrame(draw);
    }

    draw();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(animFrame);
        else draw();
    });
}

/* ═══════════════════════════════════════════════════════════════
   REVEAL ON SCROLL
   ═══════════════════════════════════════════════════════════════ */

function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATED COUNTERS
   ═══════════════════════════════════════════════════════════════ */

function initAnimatedCounters() {
    const counters = document.querySelectorAll('.hs-value');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

function animateCount(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2200;
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 4);

    function update(ts) {
        const progress = Math.min((ts - start) / duration, 1);
        el.textContent = Math.floor(easeOut(progress) * target);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

/* ═══════════════════════════════════════════════════════════════
   CONTACT FORM
   ═══════════════════════════════════════════════════════════════ */

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('.btn-neon');
        const original = btn.innerHTML;

        btn.innerHTML = `
            <span class="btn-text">Message Sent ✓</span>
            <span class="btn-glow"></span>
        `;
        btn.style.background = '#00c853';
        btn.style.boxShadow = '0 0 30px rgba(0, 200, 83, 0.4)';

        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
            btn.style.boxShadow = '';
            form.reset();
        }, 3000);
    });
}

/* ═══════════════════════════════════════════════════════════════
   PARALLAX
   ═══════════════════════════════════════════════════════════════ */

function initParallax() {
    const heroImg = document.querySelector('.hero-bg-img');
    const philImg = document.querySelector('.phil-bg-img');

    if (!heroImg && !philImg) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        if (heroImg && scrollY < window.innerHeight) {
            heroImg.style.transform = `translateY(${scrollY * 0.25}px) scale(1.1)`;
        }

        if (philImg) {
            const section = document.querySelector('.philosophy-break');
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const offset = (rect.top / window.innerHeight) * 30;
                philImg.style.transform = `translateY(${offset}px) scale(1.1)`;
            }
        }
    }, { passive: true });
}
