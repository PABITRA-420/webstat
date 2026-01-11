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
    initMarquee(); // New Marquee
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
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .interactive-tilt, .bento-item, .gallery-item, .click-trigger');

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
    // Reveal Nav
    gsap.to('.nav-container', {
        opacity: 1,
        duration: 1,
        delay: 0.5,
        ease: 'power2.out'
    });

    // Reveal Hero Text
    gsap.from('.word-line', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.2
    });

    // Continuous Floating Animation for Shapes
    gsap.to('.shape-1', {
        y: -30,
        x: 20,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    gsap.to('.shape-2', {
        y: 40,
        x: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1
    });

    // Mouse Move Parallax for Hero
    const heroSection = document.querySelector('.hero-section');
    heroSection.addEventListener('mousemove', (e) => {
        const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 20;

        gsap.to('.hero-title', {
            x: xPos * 2,
            y: yPos * 2,
            duration: 1,
            ease: 'power2.out'
        });

        gsap.to('.floating-shapes', {
            x: -xPos * 4,
            y: -yPos * 4,
            duration: 1,
            ease: 'power2.out'
        });
    });
}

// Scroll Parallax Elements
function initParallax() {
    // Parallax for About Cards
    gsap.utils.toArray('.parallax').forEach(layer => {
        const depth = layer.getAttribute('data-speed');
        const movement = -(layer.offsetHeight * depth * 0.2); // Adjust strength

        gsap.to(layer, {
            y: movement,
            ease: "none",
            scrollTrigger: {
                trigger: layer,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });
}

// Magnetic Buttons
function initMagneticButtons() {
    const magnets = document.querySelectorAll('.magnetic-btn');

    magnets.forEach((magnet) => {
        magnet.addEventListener('mousemove', (e) => {
            const bound = magnet.getBoundingClientRect();
            const x = e.clientX - bound.left - bound.width / 2;
            const y = e.clientY - bound.top - bound.height / 2;

            gsap.to(magnet, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.3,
                ease: 'power2.out'
            });

            // Move text inside slightly more
            const text = magnet.querySelector('.btn-text, span');
            if (text) {
                gsap.to(text, {
                    x: x * 0.1,
                    y: y * 0.1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });

        magnet.addEventListener('mouseleave', () => {
            gsap.to(magnet, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });

            const text = magnet.querySelector('.btn-text, span');
            if (text) {
                gsap.to(text, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)'
                });
            }
        });
    });
}

// Reveal on Scroll
function initRevealAnimations() {
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        gsap.from(section.querySelectorAll('.section-title, .section-label'), {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Stagger projects
    gsap.from('.project-card', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: '.projects-grid',
            start: "top 75%"
        }
    });

    // Bento Grid Reveal
    gsap.from('.bento-item', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: '.bento-grid',
            start: "top 80%"
        }
    });

    // Gallery Items
    gsap.from('.gallery-item', {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: '.gallery-track',
            start: "top 85%"
        }
    });
}

// Smart Navbar Scroll
function initNavbarScroll() {
    const nav = document.querySelector('.nav-container');

    // Hide/Show on scroll direction
    const showAnim = gsap.from(nav, {
        yPercent: -100,
        paused: true,
        duration: 0.4,
        ease: "power2.inOut"
    }).progress(1); // Start revealed

    ScrollTrigger.create({
        start: "top top",
        end: 99999,
        onUpdate: (self) => {
            const scrollThreshold = 100;

            // Add background glass effect
            if (self.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            // Logic for hide/show
            if (self.scrollY < scrollThreshold) {
                showAnim.play();
                return;
            }

            if (self.direction === -1) {
                showAnim.play();
            } else {
                showAnim.reverse();
            }
        }
    });
}

// Partners Marquee Logic
function initMarquee() {
    const track = document.querySelector('.marquee-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (!track) return;

    // We used CSS animation for the marquee. 
    // We can interact with it by checking if it exists, or overriding with GSAP.
    // Let's use GSAP for smoother control especially with buttons.

    // 1. Pause CSS animation
    track.style.animation = 'none';

    // 2. Setup GSAP Loop
    // The content is already duplicated in HTML for the visual fill.
    // We just need to move it -50% and repeat.

    const tween = gsap.to(track, {
        x: "-50%",
        repeat: -1,
        duration: 20,
        ease: "none"
    });

    if (prevBtn && nextBtn) {
        // Reverse
        prevBtn.addEventListener('click', () => {
            gsap.to(tween, { timeScale: -1.5, duration: 0.5 });
            // Return to normal after a bit? Or toggle? Let's toggle direction.
        });

        // Forward
        nextBtn.addEventListener('click', () => {
            gsap.to(tween, { timeScale: 1.5, duration: 0.5 });
        });

        // Reset speed on hover out of controls
        const controls = document.querySelector('.marquee-controls');
        controls.addEventListener('mouseleave', () => {
            gsap.to(tween, { timeScale: 1, duration: 1 });
        });
    }

    // Interactive: Slow down on hover
    track.parentElement.addEventListener('mouseenter', () => {
        gsap.to(tween, { timeScale: 0.2, duration: 0.5 });
    });

    track.parentElement.addEventListener('mouseleave', () => {
        gsap.to(tween, { timeScale: 1, duration: 0.5 });
    });
}
