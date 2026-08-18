/* ============================================================
   PulseGuard Case Study — JavaScript
   Scroll reveal animations + counter animation
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Scroll Reveal (Intersection Observer) ---------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ---------- Animated Number Counters ---------- */
  const metricValues = document.querySelectorAll('.metric-value[data-target]');

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  metricValues.forEach((el) => counterObserver.observe(el));

  /* ---------- Navbar Shadow on Scroll ---------- */
  const nav = document.getElementById('main-nav');

  if (nav) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 20) {
            nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)';
          } else {
            nav.style.boxShadow = 'none';
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }
})();
