/* ============================================================
   PORTFOLIO – KOUAME SILVERE FABRICE ATSE | script.js
   ============================================================ */

// ============================================================
// 1. MATRIX / PARTICLE CANVAS BACKGROUND
// ============================================================
(function initCanvas() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initParticles(); });

  // Matrix rain columns
  const fontSize = 13;
  const chars    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>/\\|{}[]!?01';
  let columns, drops;

  function initParticles() {
    columns = Math.floor(W / fontSize);
    drops   = Array.from({ length: columns }, () => Math.random() * -50);
  }
  initParticles();

  function drawMatrix() {
    ctx.fillStyle = 'rgba(5, 10, 15, 0.04)';
    ctx.fillRect(0, 0, W, H);
    ctx.font = fontSize + 'px Share Tech Mono, monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const bright = Math.random() > 0.96;
      ctx.fillStyle = bright ? '#00f5ff' : `rgba(0,245,255,${0.15 + Math.random() * 0.25})`;
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > H && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 0.5;
    }
  }

  let lastTime = 0;
  function loop(t) {
    if (t - lastTime > 40) { drawMatrix(); lastTime = t; }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();


// ============================================================
// 2. NAVBAR – scroll effect + active link + mobile toggle
// ============================================================
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-links');
  const links   = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile toggle
  toggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
  navMenu.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
      navMenu.classList.remove('open');
    }
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach(s => observer.observe(s));
})();


// ============================================================
// 3. TYPED TEXT ANIMATION (Hero title)
// ============================================================
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Analyste Cybersécurité',
    'Network Security Engineer',
    'Threat Detection Specialist',
    'Infrastructure Protector',
  ];
  let pIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const phrase = phrases[pIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++cIdx);
      if (cIdx === phrase.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 45 : 80);
  }
  setTimeout(type, 1200);
})();


// ============================================================
// 4. AOS – Lightweight scroll reveal
// ============================================================
(function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const delays = {
    '100': 100, '200': 200, '300': 300, '400': 400,
    '500': 500, '600': 600,
  };

  // Apply transition delays
  elements.forEach(el => {
    const delay = el.dataset.aosDelay;
    if (delay && delays[delay] !== undefined) {
      el.style.transitionDelay = delays[delay] + 'ms';
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );
  elements.forEach(el => observer.observe(el));
})();


// ============================================================
// 5. SKILL BARS – animate on visibility
// ============================================================
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const w  = el.dataset.width || '0';
          // Short delay for stagger effect
          setTimeout(() => { el.style.width = w + '%'; }, 200);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );
  fills.forEach(f => observer.observe(f));
})();


// ============================================================
// 6. CONTACT FORM
// ============================================================
(function initForm() {
  const form     = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;

    btn.innerHTML = '<span class="btn-icon">⟳</span> Envoi en cours...';
    btn.disabled  = true;
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    // Simulate async send (replace with real backend / EmailJS)
    setTimeout(() => {
      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        feedback.textContent = '⚠ Veuillez remplir tous les champs.';
        feedback.className   = 'form-feedback error';
      } else {
        feedback.textContent = `✓ Message envoyé avec succès. Merci, ${name} !`;
        feedback.className   = 'form-feedback success';
        form.reset();
      }

      btn.innerHTML = origText;
      btn.disabled  = false;
    }, 1600);
  });
})();


// ============================================================
// 7. SMOOTH SCROLL for anchor links
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ============================================================
// 8. GLITCH EFFECT on hero name (subtle, occasional)
// ============================================================
(function initGlitch() {
  const name = document.querySelector('.hero-name');
  if (!name) return;

  function glitch() {
    name.style.textShadow = `
      2px 0 rgba(0,245,255,0.7),
      -2px 0 rgba(139,92,246,0.7)
    `;
    setTimeout(() => {
      name.style.textShadow = '';
    }, 80);
    setTimeout(() => {
      name.style.textShadow = `
        -3px 0 rgba(0,245,255,0.5),
        3px 0 rgba(139,92,246,0.5)
      `;
    }, 120);
    setTimeout(() => {
      name.style.textShadow = '';
    }, 200);
  }

  // Random glitch every 4–8 seconds
  function scheduleGlitch() {
    const delay = 4000 + Math.random() * 4000;
    setTimeout(() => { glitch(); scheduleGlitch(); }, delay);
  }
  scheduleGlitch();
})();


// ============================================================
// 9. CURSOR GLOW EFFECT
// ============================================================
(function initCursor() {
  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed;
    width: 6px; height: 6px;
    background: rgba(0,245,255,0.9);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px rgba(0,245,255,0.8), 0 0 20px rgba(0,245,255,0.4);
    transition: opacity 0.3s;
  `;
  const ring = document.createElement('div');
  ring.style.cssText = `
    position: fixed;
    width: 28px; height: 28px;
    border: 1px solid rgba(0,245,255,0.4);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    transition: all 0.12s ease;
  `;
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animRing() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  // Enlarge on interactive elements
  document.querySelectorAll('a, button, .tech-badge, .project-card, .cert-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '48px';
      ring.style.height = '48px';
      ring.style.borderColor = 'rgba(139,92,246,0.6)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '28px';
      ring.style.height = '28px';
      ring.style.borderColor = 'rgba(0,245,255,0.4)';
    });
  });

  // Hide on mobile
  if (window.matchMedia('(pointer: coarse)').matches) {
    dot.style.display  = 'none';
    ring.style.display = 'none';
  }
})();


// ============================================================
// 10. SECTION ENTRY ANIMATIONS (extra polish)
// ============================================================
(function initHeroAnims() {
  // Stagger hero elements on load
  const heroEls = document.querySelectorAll('.hero-tag, .hero-description');
  heroEls.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity 0.7s ease ${0.3 + i * 0.15}s, transform 0.7s ease ${0.3 + i * 0.15}s`;
    setTimeout(() => {
      el.style.opacity   = '1';
      el.style.transform = 'none';
    }, 100);
  });
})();
