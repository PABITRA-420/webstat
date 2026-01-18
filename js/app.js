/**
 * SARKAR | Creative Developer Portfolio
 * Main Application Script
 * 
 * Handles all interactive elements, animations (GSAP), and functional logic
 * including the custom cursor, 3D tilt effects, and visitor tracking.
 * 
 * @author SARKAR Design Team (Z-lab)
 * @version 1.0.0 (Gold Master)
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // --- Core Initialization ---
    initCursor();          // Custom cursor logic
    initHeroAnimations();  // Initial hero section animations
    initParallax();        // Scroll-based parallax effects
    initMagneticButtons(); // Magnetic hover effects for buttons
    initRevealAnimations();// Scroll reveal animations for sections
    initNavbarScroll();    // Intelligent navbar behavior
    initMarquee();         // Infinite logo marquee
    initGallery();         // Gallery interactive track
    initNewsletter();      // Newsletter form handling with EmailJS

    // --- Final Polish Features ---
    initModal();           // "Read Full Story" modal logic
    initVisitorCounter();  // Persistent visitor counter
    initGoToTop();         // "Back to Top" button behavior
    initTiltEffect();      // 3D physics-based card tilt
    logSignature();        // Developer console signature
});

/**
 * Custom Cursor Logic
 * Creates a two-part cursor: a small dot (instant) and a trailing outline (delayed).
 * Handles reaction to interactive elements.
 */
function initCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with a slight delay for fluid feel
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Add visual feedback when hovering over interactive elements
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

/**
 * Hero Section Animations
 * Handles the initial load animations for the Hero title, shapes, and floating elements.
 * Includes mouse-move parallax for floating shapes.
 */
function initHeroAnimations() {
    // Fade in Navbar
    gsap.to('.nav-container', {
        opacity: 1, duration: 1, delay: 0.5, ease: 'power2.out'
    });

    // Stagger in title words
    gsap.from('.word-line', {
        y: 100, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out', delay: 0.2
    });

    // Continuous floating animation for background shapes
    gsap.to('.shape-1', {
        y: -30, x: 20, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });

    gsap.to('.shape-2', {
        y: 40, x: -20, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1
    });

    // Mouse interaction for Hero elements (parallax effect)
    const heroSection = document.querySelector('.hero-section');
    heroSection.addEventListener('mousemove', (e) => {
        const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
        const yPos = (e.clientY / window.innerHeight - 0.5) * 20;

        gsap.to('.hero-title', { x: xPos * 2, y: yPos * 2, duration: 1, ease: 'power2.out' });
        gsap.to('.floating-shapes', { x: -xPos * 4, y: -yPos * 4, duration: 1, ease: 'power2.out' });
    });
}

/**
 * Scroll Parallax
 * Applies vertical parallax shift to elements with .parallax class based on data-speed.
 */
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

/**
 * Magnetic Buttons
 * Buttons that physically attract to the cursor when hovered.
 */
function initMagneticButtons() {
    const magnets = document.querySelectorAll('.magnetic-btn, .control-btn');

    magnets.forEach((magnet) => {
        magnet.addEventListener('mousemove', (e) => {
            const bound = magnet.getBoundingClientRect();
            const x = e.clientX - bound.left - bound.width / 2;
            const y = e.clientY - bound.top - bound.height / 2;

            // Move button slightly towards cursor
            gsap.to(magnet, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: 'power2.out' });

            // Move inner text slightly more/less for depth
            const text = magnet.querySelector('.btn-text, span');
            if (text) {
                gsap.to(text, { x: x * 0.1, y: y * 0.1, duration: 0.3, ease: 'power2.out' });
            }
        });

        magnet.addEventListener('mouseleave', () => {
            // Elastic snapback
            gsap.to(magnet, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
            const text = magnet.querySelector('.btn-text, span');
            if (text) {
                gsap.to(text, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
            }
        });
    });
}

/**
 * Scroll Reveal Animations
 * Animates sections and elements into view as the user scrolls down.
 */
function initRevealAnimations() {
    const sections = document.querySelectorAll('section');

    // General section header reveal
    sections.forEach(section => {
        gsap.from(section.querySelectorAll('.section-title, .section-label, .section-desc'), {
            y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: "power2.out",
            scrollTrigger: {
                trigger: section, start: "top 80%", toggleActions: "play none none reverse"
            }
        });
    });

    // Project cards reveal
    gsap.from('.project-card', {
        y: 100, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: '.projects-grid', start: "top 75%" }
    });

    // Bento grid reveal
    gsap.from('.bento-item', {
        y: 60, opacity: 0, duration: 1, stagger: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: '.bento-grid', start: "top 80%" }
    });

    // Testimonials reveal
    gsap.from('.testimonial-card', {
        y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power2.out",
        scrollTrigger: { trigger: '.testimonials-grid', start: "top 80%" }
    });
}

/**
 * Navbar Logic
 * Hides on scroll down, shows on scroll up (smart toggle).
 * Adds glass effect when scrolled.
 */
function initNavbarScroll() {
    const nav = document.querySelector('.nav-container');
    const showAnim = gsap.from(nav, {
        yPercent: -100, paused: true, duration: 0.4, ease: "power2.inOut"
    }).progress(1);

    ScrollTrigger.create({
        start: "top top", end: 99999,
        onUpdate: (self) => {
            // Toggle glass effect
            if (self.scrollY > 50) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');

            // Smart show/hide
            if (self.scrollY < 100) { showAnim.play(); return; }
            if (self.direction === -1) showAnim.play(); // Scroll Up
            else showAnim.reverse(); // Scroll Down
        }
    });

    // Smooth scroll for anchor links
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

/**
 * Marquee Animation
 * Infinite scrolling track for partners.
 */
function initMarquee() {
    const track = document.querySelector('.marquee-track');
    if (!track) return;

    const tween = gsap.to(track, {
        x: "-50%", repeat: -1, duration: 20, ease: "none"
    });

    // Controls (optional interaction)
    document.getElementById('prev-btn')?.addEventListener('click', () => {
        gsap.to(tween, { timeScale: -1.5, duration: 0.5 });
    });

    document.getElementById('next-btn')?.addEventListener('click', () => {
        gsap.to(tween, { timeScale: 1.5, duration: 0.5 });
    });

    // Slow down on hover
    track.parentElement.addEventListener('mouseenter', () => {
        gsap.to(tween, { timeScale: 0.2, duration: 0.5 });
    });

    track.parentElement.addEventListener('mouseleave', () => {
        gsap.to(tween, { timeScale: 1, duration: 0.5 });
    });
}

/**
 * Gallery Manual Scroll & Play/Pause
 */
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
                toggleBtn.innerHTML = '<span class="icon-play">>></span>'; // Play icon
                isPlaying = false;
            } else {
                galleryTween.play();
                toggleBtn.innerHTML = '<span class="icon-play">||</span>'; // Pause icon
                isPlaying = true;
            }
        });
    }
}

/**
 * Newsletter Form Handling
 * Uses EmailJS to send subscriptions.
 */
function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Sending...';

        emailjs.sendForm('service_lfgsh7a', 'template_59v8rld', this)
            .then(() => {
                btn.innerText = 'Subscribed!';
                alert('Thank you for subscribing to the Anti-Gravity Digest!');
                form.reset();
                setTimeout(() => {
                    btn.innerText = originalText;
                }, 3000);
            }, (error) => {
                btn.innerText = 'Error';
                alert('Failed to subscribe. Please try again later.');
                console.error('FAILED...', error);
                setTimeout(() => {
                    btn.innerText = originalText;
                }, 3000);
            });
    });
}

/**
 * Story Modal Logic
 * Handles opening and closing of the "Read Full Story" modal.
 */
function initModal() {
    const modal = document.getElementById('story-modal');
    const openBtns = document.querySelectorAll('.read-more'); // Using the 'Read Full Story' link
    const closeBtn = document.querySelector('.close-modal');

    if (!modal) return;

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            gsap.to(modal, { opacity: 1, visibility: 'visible', duration: 0.4 });
            gsap.fromTo(modal.querySelector('.modal-content'),
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: 'back.out(1.7)' }
            );
        });
    });

    closeBtn?.addEventListener('click', () => {
        gsap.to(modal, { opacity: 0, visibility: 'hidden', duration: 0.3 });
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            gsap.to(modal, { opacity: 0, visibility: 'hidden', duration: 0.3 });
        }
    });
}

/**
 * Visitor Counter
 * Simulates a visitor count using LocalStorage.
 */
function initVisitorCounter() {
    const counterEl = document.getElementById('visitor-count');
    if (!counterEl) return;

    let count = localStorage.getItem('visitorCount');

    if (!count) {
        count = 14203; // Base starting count
    } else {
        count = parseInt(count) + 1;
    }

    localStorage.setItem('visitorCount', count);

    // Animate number count up
    const startObj = { val: count - 100 };
    gsap.to(startObj, {
        val: count,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
            counterEl.innerText = Math.floor(startObj.val).toLocaleString();
        }
    });
}

/**
 * Go To Top Button
 * Shows button when scrolled down, scrolls to top on click.
 */
function initGoToTop() {
    const btn = document.getElementById('go-top-btn');
    if (!btn) return;

    // Show/Hide on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            gsap.to(btn, { opacity: 1, y: 0, duration: 0.3, pointerEvents: 'all' });
        } else {
            gsap.to(btn, { opacity: 0, y: 20, duration: 0.3, pointerEvents: 'none' });
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * 3D Interactive Tilt
 * Applies a CSS transform dependent on mouse position relative to the element center.
 */
function initTiltEffect() {
    const cards = document.querySelectorAll('.interactive-tilt');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation (max 10deg)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            gsap.to(card, {
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        // Reset on mouse leave
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

/**
 * Developer Signature
 * Logs a styled message to the console.
 */
function logSignature() {
    console.log(
        '%c SARKAR %c Designed in Z-lab ',
        'background: #fff; color: #000; padding: 5px 10px; border-radius: 3px 0 0 3px; font-weight: bold;',
        'background: #000; color: #fff; padding: 5px 10px; border-radius: 0 3px 3px 0;'
    );
}
