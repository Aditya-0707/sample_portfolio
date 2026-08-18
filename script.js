/* ============================================
   ADITYA'S PORTFOLIO v4 — IMMERSIVE 3D SCRIPT
   Three.js Particles + GSAP Scroll + 3D Tilt
   ============================================ */

(function () {
    'use strict';

    /* --- Reduced Motion Check --- */
    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    /* ============================================
       THREE.JS — Animated Particle Starfield
       ============================================ */
    function initParticleBackground() {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        /* Accessibility */
        canvas.setAttribute('role', 'img');
        canvas.setAttribute(
            'aria-label',
            'Animated 3D particle starfield background'
        );

        /* --- Create Particles --- */
        var PARTICLE_COUNT = 2000;
        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array(PARTICLE_COUNT * 3);
        var opacities = new Float32Array(PARTICLE_COUNT);

        for (var i = 0; i < PARTICLE_COUNT; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 700;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 700;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 700;
            opacities[i] = Math.random() * 0.5 + 0.3;
        }

        geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3)
        );

        var material = new THREE.PointsMaterial({
            color: 0x00f0ff,
            size: 1.8,
            transparent: true,
            opacity: 0.55,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        var particles = new THREE.Points(geometry, material);
        scene.add(particles);

        /* --- Secondary dimmer particle cluster --- */
        var SECONDARY_COUNT = 800;
        var geo2 = new THREE.BufferGeometry();
        var pos2 = new Float32Array(SECONDARY_COUNT * 3);

        for (var j = 0; j < SECONDARY_COUNT; j++) {
            pos2[j * 3] = (Math.random() - 0.5) * 500;
            pos2[j * 3 + 1] = (Math.random() - 0.5) * 500;
            pos2[j * 3 + 2] = (Math.random() - 0.5) * 500;
        }

        geo2.setAttribute('position', new THREE.BufferAttribute(pos2, 3));

        var mat2 = new THREE.PointsMaterial({
            color: 0x6366f1,
            size: 1.2,
            transparent: true,
            opacity: 0.3,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        var particles2 = new THREE.Points(geo2, mat2);
        scene.add(particles2);

        /* --- Ambient glow sphere --- */
        var glowGeo = new THREE.SphereGeometry(220, 32, 32);
        var glowMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            transparent: true,
            opacity: 0.012,
            side: THREE.BackSide,
        });
        scene.add(new THREE.Mesh(glowGeo, glowMat));

        camera.position.z = 180;

        /* --- Mouse Tracking for Camera Parallax --- */
        var mouseX = 0;
        var mouseY = 0;

        document.addEventListener('mousemove', function (e) {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        /* --- Animation Loop --- */
        function animate() {
            requestAnimationFrame(animate);

            particles.rotation.y += 0.00025;
            particles.rotation.x += 0.0001;
            particles2.rotation.y -= 0.00015;
            particles2.rotation.z += 0.00008;

            /* Subtle mouse-reactive camera drift */
            camera.position.x +=
                (mouseX * 20 - camera.position.x) * 0.015;
            camera.position.y +=
                (-mouseY * 20 - camera.position.y) * 0.015;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        if (!prefersReducedMotion) {
            animate();
        } else {
            /* Render a single static frame */
            renderer.render(scene, camera);
        }

        /* --- Resize Handler --- */
        window.addEventListener('resize', function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            if (prefersReducedMotion) {
                renderer.render(scene, camera);
            }
        });
    }

    /* ============================================
       GSAP — Scroll-Driven Animations
       ============================================ */
    function initScrollAnimations() {
        if (
            typeof gsap === 'undefined' ||
            typeof ScrollTrigger === 'undefined'
        )
            return;
        gsap.registerPlugin(ScrollTrigger);

        if (prefersReducedMotion) return;

        /* --- Hero Entrance Sequence --- */
        var heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });

        heroTl
            .from('.hero-title', {
                opacity: 0,
                y: 80,
                duration: 1.4,
                delay: 0.2,
            })
            .from(
                '.hero-subtitle',
                { opacity: 0, y: 30, duration: 1 },
                '-=0.9'
            )
            .from(
                '.profile-card',
                { opacity: 0, y: 60, scale: 0.95, duration: 1.1 },
                '-=0.7'
            )
            .from(
                '.contact-bar',
                { opacity: 0, y: 20, duration: 0.8 },
                '-=0.5'
            )
            .from(
                '.scroll-indicator',
                { opacity: 0, duration: 0.6 },
                '-=0.3'
            );

        /* --- Section Title Reveals --- */
        gsap.utils.toArray('.section-title').forEach(function (title) {
            gsap.from(title, {
                opacity: 0,
                y: 40,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse',
                },
            });
        });

        /* --- Section Summaries & Stats --- */
        gsap.utils
            .toArray('.section-summary, .section-stats')
            .forEach(function (el) {
                gsap.from(el, {
                    opacity: 0,
                    y: 20,
                    duration: 0.6,
                    ease: 'power1.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse',
                    },
                });
            });

        /* --- Card Stagger Reveals (3D emergence) --- */
        gsap.utils.toArray('.cards-grid').forEach(function (grid) {
            var cards = grid.querySelectorAll('.card-3d');
            gsap.from(cards, {
                opacity: 0,
                y: 60,
                rotateX: -10,
                scale: 0.92,
                duration: 0.75,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
            });
        });

        /* --- Timeline Entry Reveals --- */
        gsap.utils
            .toArray('.timeline-entry')
            .forEach(function (entry, i) {
                gsap.from(entry, {
                    opacity: 0,
                    x: -40,
                    duration: 0.65,
                    ease: 'power2.out',
                    delay: i * 0.06,
                    scrollTrigger: {
                        trigger: entry,
                        start: 'top 88%',
                        toggleActions: 'play none none reverse',
                    },
                });
            });

        /* --- Skill Badge Stagger --- */
        gsap.utils.toArray('.skills-grid').forEach(function (grid) {
            var badges = grid.querySelectorAll('.skill-badge');
            gsap.from(badges, {
                opacity: 0,
                y: 16,
                scale: 0.88,
                duration: 0.4,
                stagger: 0.03,
                ease: 'power1.out',
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse',
                },
            });
        });

        /* --- Footer Reveal --- */
        var footer = document.querySelector('.footer-section');
        if (footer) {
            gsap.from(footer, {
                opacity: 0,
                y: 50,
                duration: 0.9,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: footer,
                    start: 'top 92%',
                    toggleActions: 'play none none reverse',
                },
            });
        }

        /* --- Parallax Depth on Sections --- */
        gsap.utils
            .toArray('.section-wrapper')
            .forEach(function (section) {
                gsap.to(section, {
                    yPercent: -3,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 0.5,
                    },
                });
            });

        /* --- Section Divider Fade --- */
        gsap.utils
            .toArray('.section-divider')
            .forEach(function (divider) {
                gsap.from(divider, {
                    scaleX: 0,
                    duration: 0.8,
                    ease: 'power1.out',
                    scrollTrigger: {
                        trigger: divider,
                        start: 'top 92%',
                        toggleActions: 'play none none reverse',
                    },
                });
            });
    }

    /* ============================================
       3D CARD TILT — Perspective on Pointermove
       ============================================ */
    function initCardTilt() {
        if (prefersReducedMotion) return;

        var cards = document.querySelectorAll('[data-tilt]');

        cards.forEach(function (card) {
            card.addEventListener('pointermove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;

                var rotateX = ((y - centerY) / centerY) * -8;
                var rotateY = ((x - centerX) / centerX) * 8;

                card.style.setProperty('--tilt-x', rotateX.toFixed(2));
                card.style.setProperty('--tilt-y', rotateY.toFixed(2));
            });

            card.addEventListener('pointerleave', function () {
                card.style.setProperty('--tilt-x', '0');
                card.style.setProperty('--tilt-y', '0');
            });
        });
    }

    /* ============================================
       MAGNETIC HOVER — Skill Badges
       ============================================ */
    function initMagneticHover() {
        if (prefersReducedMotion) return;

        var badges = document.querySelectorAll('.skill-badge');

        badges.forEach(function (badge) {
            badge.addEventListener('pointermove', function (e) {
                var rect = badge.getBoundingClientRect();
                var dx =
                    (e.clientX - rect.left - rect.width / 2) * 0.2;
                var dy =
                    (e.clientY - rect.top - rect.height / 2) * 0.2;
                badge.style.transform =
                    'translateY(-2px) scale(1.04) translate(' +
                    dx +
                    'px, ' +
                    dy +
                    'px)';
            });

            badge.addEventListener('pointerleave', function () {
                badge.style.transform = '';
            });
        });
    }

    /* ============================================
       TABS — Skills Section
       ============================================ */
    function initTabs() {
        var tabBtns = document.querySelectorAll('.tab-btn');
        var tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                tabBtns.forEach(function (b) {
                    b.classList.remove('active');
                });
                tabContents.forEach(function (c) {
                    c.classList.remove('active');
                });

                btn.classList.add('active');
                var targetId = btn.getAttribute('data-tab');
                var target = document.getElementById(targetId);
                if (target) target.classList.add('active');
            });
        });
    }

    /* ============================================
       SMOOTH SCROLL — Anchor Links
       ============================================ */
    function initSmoothScroll() {
        document
            .querySelectorAll('a[href^="#"]')
            .forEach(function (anchor) {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    var target = document.querySelector(
                        anchor.getAttribute('href')
                    );
                    if (target) {
                        target.scrollIntoView({
                            behavior: prefersReducedMotion
                                ? 'auto'
                                : 'smooth',
                        });
                    }
                });
            });
    }

    /* ============================================
       INITIALIZE
       ============================================ */
    document.addEventListener('DOMContentLoaded', function () {
        initParticleBackground();
        initScrollAnimations();
        initCardTilt();
        initMagneticHover();
        initTabs();
        initSmoothScroll();
    });
})();
