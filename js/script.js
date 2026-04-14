document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Init Lenis Smooth Scroll --- */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    /* --- 2. Custom Cursor --- */
    const cursor = document.getElementById('cursor');
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: 'power2.out'
        });
    });

    // Add expanded active area hover detection
    const hoverTargets = document.querySelectorAll('.hover-target, a, button, input');
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => document.body.classList.add('hover-active'));
        target.addEventListener('mouseleave', () => document.body.classList.remove('hover-active'));
    });

    /* --- 3. Preloader Animation (GSAP) --- */
    const tlLoader = gsap.timeline({
        onComplete: () => {
            document.body.style.overflow = 'auto';
            document.getElementById('preloader').style.display = 'none';
        }
    });

    // Disable scroll during load
    document.body.style.overflow = 'hidden';

    tlLoader.fromTo('#loader-text', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )
    .to('#loader-text', {
        opacity: 0,
        y: -50,
        duration: 0.8,
        delay: 0.5,
        ease: 'power3.in'
    })
    .to('#loader-reveal', {
        scaleY: 1,
        duration: 0.8,
        ease: 'power4.inOut'
    }, "-=0.5")
    .to('#preloader', {
        yPercent: -100,
        duration: 1.2,
        ease: 'power4.inOut'
    })
    /* Intro Hero Animation */
    .to('#t1', { y: 0, duration: 1, ease: 'power4.out' }, "-=0.8")
    .to('#t2', { y: 0, duration: 1, ease: 'power4.out' }, "-=0.8")
    .fromTo('#hero-center-img', 
        { scale: 0.8, opacity: 0, rotation: -5 },
        { scale: 1, opacity: 1, rotation: 0, duration: 1.5, ease: 'power3.out' }, "-=1");

    /* --- 4. Hero Parallax --- */
    gsap.to('#hero-img-wrapper', {
        yPercent: 30, // image moves down 30% while scrolling down
        ease: 'none',
        scrollTrigger: {
            trigger: '.h-screen.relative',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    /* --- 5. Fullscreen Menu Toggle --- */
    const menuBtn = document.getElementById('menu-toggle');
    const closeBtn = document.getElementById('close-menu');
    const fullMenu = document.getElementById('full-menu');
    const menuLinks = document.querySelectorAll('.menu-link');

    const tlMenu = gsap.timeline({ paused: true });
    tlMenu.to(fullMenu, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.5,
        ease: 'power3.inOut'
    })
    .fromTo(menuLinks, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
        "-=0.2"
    );

    menuBtn.addEventListener('click', () => {
        tlMenu.play();
        lenis.stop(); // Stop scroll when menu open
    });

    closeBtn.addEventListener('click', () => {
        tlMenu.reverse();
        lenis.start(); // Resume scroll
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            tlMenu.reverse();
            lenis.start();
            // Smooth scroll to section via lenis
            const targetId = link.getAttribute('href');
            if(targetId.startsWith('#')) {
                e.preventDefault();
                lenis.scrollTo(targetId, { offset: 0, duration: 1.5 });
            }
        });
    });

    /* --- 6. About Story Text Reveal on Scroll --- */
    const revealTexts = document.querySelectorAll('.reveal-text');
    revealTexts.forEach(text => {
        gsap.fromTo(text, 
            { opacity: 0.2, y: 50 },
            { 
                opacity: 1, y: 0, 
                duration: 1, 
                scrollTrigger: {
                    trigger: text,
                    start: 'top 80%',
                    end: 'bottom 50%',
                    scrub: 1
                }
            }
        );
    });

    /* Story Image Parallax (Image moves within its container slightly) */
    gsap.to('.parallax-layer', {
        yPercent: 20, // Move image downwards slightly inside container
        ease: 'none',
        scrollTrigger: {
            trigger: '#about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    /* --- 7. Horizontal Scroll Gallery Section --- */
    const galleryScroll = document.querySelector('.gallery-track');
    
    // We calculate how far it needs to move horizontally
    function getScrollAmount() {
        let trackWidth = galleryScroll.scrollWidth;
        return -(trackWidth - window.innerWidth);
    }

    const tween = gsap.to(galleryScroll, {
        x: getScrollAmount,
        ease: "none"
    });

    ScrollTrigger.create({
        trigger: "#gallery",
        start: "top top",
        end: () => `+=${getScrollAmount() * -1}`, // Scroll distance equals translation length
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true
    });

    /* --- 8. Offerings Stacking Cards Effect --- */
    const cards = document.querySelectorAll('.service-card');
    cards.forEach((card, i) => {
        gsap.to(card, {
            scale: 0.95 - (i * 0.02), // Lower cards scale down more as new cards stack
            opacity: 0.5,
            scrollTrigger: {
                trigger: card,
                start: 'top 15%', // When card reaches sticky point
                endTrigger: '.cards-container', // Until the container ends
                end: 'bottom bottom',
                scrub: true
            }
        });
    });
});
