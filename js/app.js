// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger);

    // Init custom cursor
    initCursor();

    // Init animations
    initHeroAnimations();
    initParallax();
    initMagneticButtons();
    initRevealAnimations();
    initNavbarScroll();
    initMarquee();
    initGallery(); // New Gallery Logic
});

// Custom Cursor Logic
function initCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with lag
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effects for cursor
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .interactive-tilt, .bento-item, .gallery-item, .control-btn');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });

        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });
}

// Hero Animations (Floating text)
function initHeroAnimations() {
    gsap.to('.nav-container', {
        opacity: 1, duration: 1, delay: 0.5, ease: 'power2.out'
    });

    gsap.from('.word-line', {
        y: 100, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out', delay: 0.2
    });

    gsap.to('.shape-1', {
        y: -30, x: 20, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });

    gsap.to('.shape-2', {
        y: 40, x: -20, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1
    });

    const heroSection = document.querySelector('.hero-section');
    heroSection.addEventListener('mousemove', (e) => {
        const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 20;

        gsap.to('.hero-title', { x: xPos * 2, y: yPos * 2, duration: 1, ease: 'power2.out' });
        gsap.to('.floating-shapes', { x: -xPos * 4, y: -yPos * 4, duration: 1, ease: 'power2.out' });
    });
}

// Scroll Parallax Elements
function initParallax() {
    gsap.utils.toArray('.parallax').forEach(layer => {
        const depth = layer.getAttribute('data-speed');
        const movement = -(layer.offsetHeight * depth * 0.2);

        gsap.to(layer, {
            y: movement, ease: "none",
            scrollTrigger: {
                trigger: layer, start: "top bottom", end: "bottom top", scrub: true
            }
        });
    });
}

// Magnetic Buttons
function initMagneticButtons() {
    const magnets = document.querySelectorAll('.magnetic-btn, .control-btn');

    magnets.forEach((magnet) => {
        magnet.addEventListener('mousemove', (e) => {
            const bound = magnet.getBoundingClientRect();
            const x = e.clientX - bound.left - bound.width / 2;
            const y = e.clientY - bound.top - bound.height / 2;

            gsap.to(magnet, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: 'power2.out' });

            const text = magnet.querySelector('.btn-text, span');
            if (text) {
                gsap.to(text, { x: x * 0.1, y: y * 0.1, duration: 0.3, ease: 'power2.out' });
            }
        });

        magnet.addEventListener('mouseleave', () => {
            gsap.to(magnet, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
            const text = magnet.querySelector('.btn-text, span');
            if (text) {
                gsap.to(text, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
            }
        });
    });
}

// Reveal on Scroll (Handles new sections automatically)
function initRevealAnimations() {
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        gsap.from(section.querySelectorAll('.section-title, .section-label, .section-desc'), {
            y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: "power2.out",
            scrollTrigger: {
                trigger: section, start: "top 80%", toggleActions: "play none none reverse"
            }
        });
    });

    gsap.from('.project-card', {
        y: 100, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: '.projects-grid', start: "top 75%" }
    });

    gsap.from('.bento-item', {
        y: 60, opacity: 0, duration: 1, stagger: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: '.bento-grid', start: "top 80%" }
    });

    // Testimonials
    gsap.from('.testimonial-card', {
        y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power2.out",
        scrollTrigger: { trigger: '.testimonials-grid', start: "top 80%" }
    });
}

// Smart Navbar Scroll
function initNavbarScroll() {
    const nav = document.querySelector('.nav-container');
    const showAnim = gsap.from(nav, {
        yPercent: -100, paused: true, duration: 0.4, ease: "power2.inOut"
    }).progress(1);

    ScrollTrigger.create({
        start: "top top", end: 99999,
        onUpdate: (self) => {
            if (self.scrollY > 50) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');

            if (self.scrollY < 100) { showAnim.play(); return; }
            if (self.direction === -1) showAnim.play();
            else showAnim.reverse();
        }
    });

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Partners Marquee Logic
function initMarquee() {
    const track = document.querySelector('.marquee-track');
    if (!track) return;

    const tween = gsap.to(track, {
        x: "-50%", repeat: -1, duration: 20, ease: "none"
    });

    document.getElementById('prev-btn')?.addEventListener('click', () => {
        gsap.to(tween, { timeScale: -1.5, duration: 0.5 });
    });

    document.getElementById('next-btn')?.addEventListener('click', () => {
        gsap.to(tween, { timeScale: 1.5, duration: 0.5 });
    });

    track.parentElement.addEventListener('mouseenter', () => {
        gsap.to(tween, { timeScale: 0.2, duration: 0.5 });
    });

    track.parentElement.addEventListener('mouseleave', () => {
        gsap.to(tween, { timeScale: 1, duration: 0.5 });
    });
}

// Gallery Logic (Play/Pause)
function initGallery() {
    const track = document.getElementById('gallery-track');
    const toggleBtn = document.getElementById('gallery-toggle');

    if (!track) return;

    // Infinite scroll for gallery
    const galleryTween = gsap.to(track, {
        x: "-50%", repeat: -1, duration: 30, ease: "none"
    });

    let isPlaying = true;

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (isPlaying) {
                galleryTween.pause();
                toggleBtn.innerHTML = '<span class="icon-play">>></span>'; // Change to Play icon
                isPlaying = false;
            } else {
                galleryTween.play();
                toggleBtn.innerHTML = '<span class="icon-play">||</span>'; // Change to Pause icon
                isPlaying = true;
            }
        });
    }
}
