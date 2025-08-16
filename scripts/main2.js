// ===== NAVIGATION FUNCTIONALITY =====
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('navToggle');
        this.navMobileMenu = document.getElementById('navMobileMenu');
        this.navLinks = document.querySelectorAll('.nav-menu-link, .nav-mobile-menu-link');
        this.lastScrollY = window.scrollY;

        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
        this.setActiveLink();
    }

    bindEvents() {
        // Mobile menu toggle
        this.navToggle?.addEventListener('click', () => this.toggleMobileMenu());

        // Close mobile menu when clicking links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (e.target.closest('.nav-mobile-menu')) {
                    this.closeMobileMenu();
                }
                this.handleLinkClick(e);
            });
        });

        // Scroll events
        window.addEventListener('scroll', () => this.handleScroll());

        // Resize events
        window.addEventListener('resize', () => this.handleResize());

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const isActive = this.navToggle.classList.contains('active');

        if (isActive) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.navToggle.classList.add('active');
        this.navMobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        this.navToggle.classList.remove('active');
        this.navMobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleScroll() {
        const currentScrollY = window.scrollY;

        // Add scrolled class for styling
        if (currentScrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        // Update active link based on scroll position
        this.setActiveLink();

        this.lastScrollY = currentScrollY;
    }

    handleResize() {
        // Close mobile menu on desktop resize
        if (window.innerWidth >= 768) {
            this.closeMobileMenu();
        }
    }

    handleLinkClick(e) {
        const href = e.target.getAttribute('href');

        if (href?.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }

    setActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150; // Offset for better UX

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all links
                this.navLinks.forEach(link => link.classList.remove('active'));

                // Add active class to current section links
                document.querySelectorAll(`[href="#${sectionId}"]`).forEach(link => {
                    link.classList.add('active');
                });
            }
        });
    }
}

// ===== UTILITY FUNCTIONS =====
class Utils {
    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= -offset &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    new Navigation();
    new HeroSection();
    new DashboardAnimation();
    new RoleRotator();
    new EnhancedHeroAnimations();
    new AboutSection();
    new FloatingStats();
    new ServicesSection();
    new CaseStudies();
    new ImageLoader();
    new TestimonialsSlider();
    new FooterInteractions();
    new ScrollAnimations();
    new PerformanceOptimizer();

    // Remove loading class
    document.body.classList.remove('loading');

    console.log('🚀 Christian Idisi Portfolio - All Systems Loaded');
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Preload critical resources
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Preload next sections or images
    });
}

// Service Worker registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(registrationError => console.log('SW registration failed'));
    });
}

// ===== HERO SECTION FUNCTIONALITY =====
class HeroSection {
    constructor() {
        this.heroSection = document.getElementById('hero');
        this.scrollIndicator = document.querySelector('.hero-scroll');
        this.floatingElements = document.querySelectorAll('.hero-float');

        this.init();
    }

    init() {
        this.bindEvents();
        this.animateOnScroll();
    }

    bindEvents() {
        // Scroll indicator click
        this.scrollIndicator?.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });

        // Parallax effect on scroll
        window.addEventListener('scroll',
            Utils.throttle(() => this.handleParallax(), 16)
        );

        // Intersection observer for animations
        this.observeHeroElements();
    }

    handleParallax() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const heroHeight = this.heroSection.offsetHeight;

        // Only apply parallax when hero is in view
        if (scrollY < heroHeight) {
            const parallaxSpeed = scrollY * 0.5;

            // Move floating elements
            this.floatingElements.forEach((element, index) => {
                const speed = 0.3 + (index * 0.1);
                element.style.transform = `translateY(${scrollY * speed}px)`;
            });

            // Fade out scroll indicator
            if (this.scrollIndicator) {
                const opacity = Math.max(0, 1 - (scrollY / (windowHeight * 0.3)));
                this.scrollIndicator.style.opacity = opacity;
            }
        }
    }

    observeHeroElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                } else {
                    entry.target.classList.remove('animate-in');
                }
            });
        }, observerOptions);

        // Observe metric cards for staggered animation
        document.querySelectorAll('.hero-metric').forEach((metric, index) => {
            metric.style.animationDelay = `${0.7 + (index * 0.1)}s`;
            observer.observe(metric);
        });

        // Observe dashboard elements
        document.querySelectorAll('.metric-card').forEach(observer.observe.bind(observer));
    }

    animateOnScroll() {
        // Counter animation for metrics
        const animateCounters = () => {
            document.querySelectorAll('.hero-metric-value').forEach(counter => {
                const target = counter.textContent;
                const isPercentage = target.includes('%');
                const isPlus = target.includes('+');
                const isCurrency = target.includes('$') || target.includes('K');

                let endValue = parseFloat(target.replace(/[^\d.]/g, ''));

                if (isCurrency && target.includes('K')) {
                    endValue = endValue;
                } else if (isPercentage) {
                    endValue = endValue;
                }

                this.animateCounter(counter, 0, endValue, 2000, target);
            });
        };

        // Trigger counter animation when hero is in view
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    heroObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        heroObserver.observe(this.heroSection);
    }

    animateCounter(element, start, end, duration, originalText) {
        const startTime = performance.now();
        const isPercentage = originalText.includes('%');
        const isPlus = originalText.includes('+');
        const isCurrency = originalText.includes('$');
        const isK = originalText.includes('K');

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (end - start) * easeOutQuart;

            let displayValue = Math.floor(current);

            if (isCurrency && isK) {
                displayValue = `$${displayValue}K`;
            } else if (isPercentage) {
                displayValue = `${displayValue}%`;
            } else if (isPlus) {
                displayValue = `${displayValue}+`;
            }

            element.textContent = displayValue;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = originalText; // Ensure final value is exact
            }
        };

        requestAnimationFrame(animate);
    }
}

// ===== DASHBOARD ANIMATION =====
class DashboardAnimation {
    constructor() {
        this.dashboard = document.querySelector('.hero-dashboard');
        this.metricCards = document.querySelectorAll('.metric-card');
        this.routeLine = document.querySelector('.route-line');

        if (this.dashboard) {
            this.init();
        }
    }

    init() {
        this.animateMetrics();
        this.animateRoute();
        this.addHoverEffects();
    }

    animateMetrics() {
        // Stagger metric card animations
        this.metricCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 1200 + (index * 150));
        });
    }

    animateRoute() {
        // Animate route progression
        if (this.routeLine) {
            const routeProgress = this.routeLine.querySelector('::before');
            // Animation handled via CSS keyframes
        }
    }

    addHoverEffects() {
        this.metricCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-4px) scale(1.02)';
                card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = '';
            });
        });
    }
}

// ===== TYPING ANIMATION =====
class TypingAnimation {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.options = {
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 1000,
            startDelay: 0,
            loop: true,
            ...options
        };

        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;

        if (this.element) {
            this.init();
        }
    }

    init() {
        setTimeout(() => this.type(), this.options.startDelay);
    }

    type() {
        const currentText = this.texts[this.textIndex];

        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.options.typeSpeed;

        if (this.isDeleting) {
            typeSpeed = this.options.backSpeed;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = this.options.backDelay;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===== PERFORMANCE OPTIMIZATION =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.lazyLoadElements();
        this.preloadCriticalResources();
    }

    optimizeImages() {
        // Add intersection observer for lazy loading images
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    lazyLoadElements() {
        // Lazy load heavy elements
        const elementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    elementObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px'
        });

        document.querySelectorAll('.lazy-load').forEach(el => {
            elementObserver.observe(el);
        });
    }

    preloadCriticalResources() {
        // Preload critical resources
        const criticalResources = [
            '/assets/hero-bg.webp',
            '/assets/dashboard-bg.webp'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = resource;
            document.head.appendChild(link);
        });
    }
}

// ===== HERO ROLE ROTATION =====
class RoleRotator {
    constructor() {
        this.roles = document.querySelectorAll('.role-text');
        this.currentIndex = 0;
        this.intervalTime = 3000;

        if (this.roles.length > 0) {
            this.init();
        }
    }

    init() {
        // Set first role as active
        if (this.roles.length > 0) {
            this.roles[0].classList.add('active');
        }
        this.startRotation();
    }

    startRotation() {
        setInterval(() => {
            this.roles[this.currentIndex].classList.remove('active');
            this.currentIndex = (this.currentIndex + 1) % this.roles.length;
            this.roles[this.currentIndex].classList.add('active');
        }, this.intervalTime);
    }
}

// ===== ENHANCED HERO ANIMATIONS =====
class EnhancedHeroAnimations {
    constructor() {
        this.initCounterAnimations();
        this.initPersonalTouch();
        this.initImageAnimations();
    }

    initCounterAnimations() {
        // Animate the highlight numbers
        const highlightNumbers = document.querySelectorAll('.highlight-number');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = target.textContent;
                    const isK = finalValue.includes('K');
                    const isPercent = finalValue.includes('%');
                    const isDollar = finalValue.includes('$');

                    let numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));

                    this.animateCounter(target, 0, numericValue, 2000, finalValue);
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });

        highlightNumbers.forEach(num => observer.observe(num));
    }

    animateCounter(element, start, end, duration, originalText) {
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (end - start) * easeOutQuart;

            if (originalText.includes('$') && originalText.includes('K')) {
                element.textContent = `$${Math.floor(current)}K`;
            } else if (originalText.includes('%')) {
                element.textContent = `${Math.floor(current)}%`;
            } else if (originalText.includes('+')) {
                element.textContent = `${Math.floor(current)}+`;
            } else {
                element.textContent = Math.floor(current);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = originalText;
            }
        };

        requestAnimationFrame(animate);
    }

    initPersonalTouch() {
        // Profile card hover effect
        const profileCard = document.querySelector('.profile-card');
        if (profileCard) {
            profileCard.addEventListener('mouseenter', () => {
                profileCard.style.transform = 'translateY(-8px) scale(1.05)';
                profileCard.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
            });

            profileCard.addEventListener('mouseleave', () => {
                profileCard.style.transform = 'translateY(0) scale(1)';
                profileCard.style.boxShadow = '';
            });
        }

        // Interactive skill tags
        document.querySelectorAll('.skill-tag').forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'scale(1.1)';
                tag.style.backgroundColor = 'rgba(102, 126, 234, 0.2)';
                tag.style.borderColor = 'rgba(102, 126, 234, 0.4)';
            });

            tag.addEventListener('mouseleave', () => {
                tag.style.transform = 'scale(1)';
                tag.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
                tag.style.borderColor = 'rgba(102, 126, 234, 0.2)';
            });
        });

        // Highlight items hover
        document.querySelectorAll('.highlight-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-4px) scale(1.02)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    initImageAnimations() {
        // Add subtle parallax to image accents
        const imageAccents = document.querySelectorAll('.image-accent-1, .image-accent-2');

        window.addEventListener('scroll', Utils.throttle(() => {
            const scrollY = window.scrollY;

            imageAccents.forEach((accent, index) => {
                const speed = (index + 1) * 0.1;
                accent.style.transform = `translateY(${scrollY * speed}px)`;
            });
        }, 16));
    }
}

// ===== ABOUT SECTION FUNCTIONALITY =====
class AboutSection {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.aboutSection = document.getElementById('about');
        this.animated = false;

        this.init();
    }

    init() {
        this.observeSection();
    }

    observeSection() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animateSkills();
                    this.animated = true;
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });

        observer.observe(this.aboutSection);
    }

    animateSkills() {
        this.skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            }, index * 200); // Stagger animation
        });
    }
}

// ===== FLOATING ELEMENTS PARALLAX =====
class FloatingStats {
    constructor() {
        this.stats = document.querySelectorAll('.floating-stat');
        this.aboutSection = document.getElementById('about');

        this.init();
    }

    init() {
        if (window.innerWidth > 768) {
            this.bindScrollEvents();
        }
    }

    bindScrollEvents() {
        window.addEventListener('scroll',
            Utils.throttle(() => this.handleParallax(), 16)
        );
    }

    handleParallax() {
        const scrolled = window.pageYOffset;
        const aboutTop = this.aboutSection.offsetTop;
        const aboutHeight = this.aboutSection.offsetHeight;

        // Only apply parallax when about section is in view
        if (scrolled + window.innerHeight > aboutTop && scrolled < aboutTop + aboutHeight) {
            this.stats.forEach((stat, index) => {
                const speed = 0.5 + (index * 0.2);
                const yPos = -(scrolled - aboutTop) * speed;
                stat.style.transform = `translateY(${yPos}px)`;
            });
        }
    }
}
// ===== SERVICES SECTION FUNCTIONALITY =====
class ServicesSection {
    constructor() {
        this.serviceItems = document.querySelectorAll('.service-item');
        this.resultMetrics = document.querySelectorAll('.result-metric');
        this.animated = new Set();

        this.init();
    }

    init() {
        this.initAOS();
        this.observeMetrics();
        this.addInteractivity();
    }

    initAOS() {
        // Simple AOS-like functionality
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-aos-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                    }, parseInt(delay));
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('[data-aos]').forEach(el => {
            observer.observe(el);
        });
    }

    observeMetrics() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animateMetric(entry.target);
                    this.animated.add(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        this.resultMetrics.forEach(metric => {
            observer.observe(metric);
        });
    }

    animateMetric(element) {
        const finalValue = element.textContent;
        const isPercentage = finalValue.includes('%');
        const isPlus = finalValue.includes('+');
        const numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));

        let currentValue = 0;
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            currentValue = numericValue * easeOutQuart;

            let displayValue = Math.floor(currentValue);

            if (isPercentage) {
                displayValue = displayValue + '%';
            } else if (isPlus) {
                displayValue = displayValue + '+';
            }

            element.textContent = displayValue;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = finalValue;
            }
        };

        requestAnimationFrame(animate);
    }

    addInteractivity() {
        // Add hover effects to service items
        this.serviceItems.forEach(item => {
            const image = item.querySelector('.service-image');
            const content = item.querySelector('.service-content');

            item.addEventListener('mouseenter', () => {
                image.style.transform = 'scale(1.02)';
                content.style.transform = 'translateY(-5px)';
            });

            item.addEventListener('mouseleave', () => {
                image.style.transform = 'scale(1)';
                content.style.transform = 'translateY(0)';
            });
        });

        // Add parallax effect to service badges
        this.addParallaxToBadges();
    }

    addParallaxToBadges() {
        const badges = document.querySelectorAll('.service-badge');

        window.addEventListener('scroll', Utils.throttle(() => {
            const scrolled = window.pageYOffset;

            badges.forEach(badge => {
                const rect = badge.getBoundingClientRect();
                const speed = 0.5;

                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const yPos = scrolled * speed;
                    badge.style.transform = `translateY(${yPos * 0.1}px)`;
                }
            });
        }, 16));
    }
}

// ===== IMAGE LAZY LOADING WITH BLUR EFFECT =====
class ImageLoader {
    constructor() {
        this.images = document.querySelectorAll('.service-image img');
        this.init();
    }

    init() {
        this.images.forEach(img => {
            // Add loading effect
            img.style.filter = 'blur(5px)';
            img.style.transition = 'filter 0.5s ease';

            img.addEventListener('load', () => {
                img.style.filter = 'blur(0)';
            });

            // Add error handling
            img.addEventListener('error', () => {
                img.src = 'assets/placeholder-service.jpg';
                img.style.filter = 'blur(0)';
            });
        });
    }
}
// ===== CASE STUDIES FUNCTIONALITY =====
class CaseStudies {
    constructor() {
        this.expandButtons = document.querySelectorAll('.case-expand-btn');
        this.caseDetails = document.querySelectorAll('.case-details');

        this.init();
    }

    init() {
        this.bindEvents();
        this.observeElements();
    }

    bindEvents() {
        this.expandButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const caseId = button.getAttribute('data-case');
                this.toggleCase(caseId, button);
            });
        });
    }

    toggleCase(caseId, button) {
        const details = document.querySelector(`.case-details[data-case="${caseId}"]`);
        const isExpanded = details.classList.contains('expanded');

        // Close all other cases
        this.caseDetails.forEach(detail => {
            if (detail !== details) {
                detail.classList.remove('expanded');
            }
        });

        this.expandButtons.forEach(btn => {
            if (btn !== button) {
                btn.classList.remove('expanded');
            }
        });

        // Toggle current case
        if (isExpanded) {
            details.classList.remove('expanded');
            button.classList.remove('expanded');
        } else {
            details.classList.add('expanded');
            button.classList.add('expanded');

            // Smooth scroll to expanded content after animation
            setTimeout(() => {
                details.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 300);
        }
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe case study items for staggered animation
        document.querySelectorAll('.case-study-item').forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
            item.style.animationPlayState = 'paused';
            observer.observe(item);
        });
    }
}

// ===== CASE STUDIES METRICS ANIMATION =====
class CaseMetricsAnimation {
    constructor() {
        this.metrics = document.querySelectorAll('.metric-value');
        this.animatedMetrics = new Set();

        this.init();
    }

    init() {
        this.observeMetrics();
    }

    observeMetrics() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedMetrics.has(entry.target)) {
                    this.animateMetric(entry.target);
                    this.animatedMetrics.add(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        this.metrics.forEach(metric => observer.observe(metric));
    }

    animateMetric(element) {
        const finalValue = element.textContent;
        const isPercentage = finalValue.includes('%');
        const isCurrency = finalValue.includes('$') || finalValue.includes('₦') || finalValue.includes('K');
        const isPlus = finalValue.includes('+');

        let numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));

        if (isNaN(numericValue)) {
            return; // Skip non-numeric values
        }

        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = numericValue * easeOutQuart;

            let displayValue = Math.floor(currentValue);

            // Format the value based on original format
            if (isCurrency && finalValue.includes('K')) {
                displayValue = `$${displayValue}K`;
            } else if (isCurrency && finalValue.includes('₦')) {
                displayValue = `₦${displayValue}M${isPlus ? '+' : ''}`;
            } else if (isPercentage) {
                displayValue = `${displayValue}%`;
            } else if (isPlus) {
                displayValue = `${displayValue}+`;
            } else if (finalValue.includes('/')) {
                displayValue = `${displayValue}/7`;
            }

            element.textContent = displayValue;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = finalValue; // Ensure final value is exact
            }
        };

        requestAnimationFrame(animate);
    }
}

// ===== SMOOTH SCROLLING FOR CASE STUDIES =====
class CaseStudiesScrolling {
    constructor() {
        this.caseStudiesSection = document.getElementById('case-studies');
        this.init();
    }

    init() {
        this.handleSmoothScrolling();
        this.addScrollIndicators();
    }

    handleSmoothScrolling() {
        // Add smooth scrolling behavior for internal links
        document.querySelectorAll('a[href^="#case-studies"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.caseStudiesSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }

    addScrollIndicators() {
        // Add scroll progress indicator for case studies section
        const progressBar = document.createElement('div');
        progressBar.className = 'case-studies-progress';
        progressBar.innerHTML = '<div class="progress-fill"></div>';

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
           .case-studies-progress {
               position: fixed;
               top: 4rem;
               left: 0;
               width: 100%;
               height: 2px;
               background: rgba(255, 255, 255, 0.1);
               z-index: 1000;
               opacity: 0;
               transition: opacity 0.3s ease;
           }
           .case-studies-progress.active {
               opacity: 1;
           }
           .progress-fill {
               height: 100%;
               background: linear-gradient(90deg, #667eea, #764ba2);
               width: 0%;
               transition: width 0.1s ease;
           }
       `;
        document.head.appendChild(style);
        document.body.appendChild(progressBar);

        const progressFill = progressBar.querySelector('.progress-fill');

        // Update progress on scroll
        window.addEventListener('scroll', Utils.throttle(() => {
            const sectionTop = this.caseStudiesSection.offsetTop - 100;
            const sectionHeight = this.caseStudiesSection.offsetHeight;
            const scrolled = window.scrollY;

            if (scrolled >= sectionTop && scrolled <= sectionTop + sectionHeight) {
                progressBar.classList.add('active');
                const progress = ((scrolled - sectionTop) / sectionHeight) * 100;
                progressFill.style.width = `${Math.min(progress, 100)}%`;
            } else {
                progressBar.classList.remove('active');
            }
        }, 10));
    }
}

// ===== CASE STUDIES FILTER (OPTIONAL ENHANCEMENT) =====
class CaseStudiesFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.case-filter-btn');
        this.caseItems = document.querySelectorAll('.case-study-item');

        if (this.filterButtons.length > 0) {
            this.init();
        }
    }

    init() {
        this.bindFilterEvents();
    }

    bindFilterEvents() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = button.getAttribute('data-filter');
                this.filterCases(filter);
                this.updateActiveButton(button);
            });
        });
    }

    filterCases(filter) {
        this.caseItems.forEach(item => {
            const tags = Array.from(item.querySelectorAll('.tag')).map(tag =>
                tag.textContent.toLowerCase().replace(/\s+/g, '-')
            );

            if (filter === 'all' || tags.includes(filter)) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.6s ease-out';
            } else {
                item.style.display = 'none';
            }
        });
    }

    updateActiveButton(activeButton) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
class CaseStudiesPerformance {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeAnimations();
    }

    lazyLoadImages() {
        // Lazy load any images in case studies
        const images = document.querySelectorAll('.case-studies img[data-src]');

        if (images.length > 0) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    optimizeAnimations() {
        // Pause animations when not in view to save performance
        const animatedElements = document.querySelectorAll('.case-studies [class*="animate"]');

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const element = entry.target;
                if (entry.isIntersecting) {
                    element.style.animationPlayState = 'running';
                } else {
                    element.style.animationPlayState = 'paused';
                }
            });
        });

        animatedElements.forEach(el => animationObserver.observe(el));
    }
}

// ===== UTILITY: Enhanced scroll performance =====
Utils.throttle = function (func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ===== ACCESSIBILITY ENHANCEMENTS =====
document.addEventListener('keydown', (e) => {
    // Allow keyboard navigation for case study expansion
    if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target;
        if (target.classList.contains('case-expand-btn')) {
            e.preventDefault();
            target.click();
        }
    }
});

// ===== MOBILE TOUCH ENHANCEMENTS =====
if ('ontouchstart' in window) {
    document.querySelectorAll('.case-study-item').forEach(item => {
        item.addEventListener('touchstart', () => {
            item.style.transform = 'translateY(-2px)';
        });

        item.addEventListener('touchend', () => {
            setTimeout(() => {
                item.style.transform = '';
            }, 150);
        });
    });
}

// ===== TESTIMONIALS SLIDER =====
class TestimonialsSlider {
    constructor() {
        this.slides = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.nav-dot');
        this.prevBtn = document.getElementById('testimonialPrev');
        this.nextBtn = document.getElementById('testimonialNext');
        this.currentSlide = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;

        if (this.slides.length > 0) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
        this.updateButtons();
        this.startAutoplay();
    }

    bindEvents() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => {
            this.previousSlide();
            this.restartAutoplay();
        });

        this.nextBtn?.addEventListener('click', () => {
            this.nextSlide();
            this.restartAutoplay();
        });

        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.restartAutoplay();
            });
        });

        // Pause autoplay on hover
        const slider = document.querySelector('.testimonials-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => this.stopAutoplay());
            slider.addEventListener('mouseleave', () => this.startAutoplay());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
                this.restartAutoplay();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
                this.restartAutoplay();
            }
        });
    }

    goToSlide(index) {
        // Hide current slide
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');

        // Update current slide index
        this.currentSlide = index;

        // Show new slide
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');

        this.updateButtons();
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }

    updateButtons() {
        // Enable/disable navigation buttons based on current slide
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = this.currentSlide === this.slides.length - 1;
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    restartAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
}

// ===== FOOTER FUNCTIONALITY =====
class FooterInteractions {
    constructor() {
        this.backToTopBtn = document.getElementById('backToTop');
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        // Back to top button
        this.backToTopBtn?.addEventListener('click', () => {
            this.scrollToTop();
        });

        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll',
            Utils.throttle(() => this.handleScroll(), 100)
        );

        // Smooth scroll for footer links
        document.querySelectorAll('.footer-link').forEach(link => {
            if (link.getAttribute('href')?.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(link.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }
        });
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;

        // Show back to top button when scrolled down
        if (scrolled > windowHeight * 0.3) {
            this.backToTopBtn?.classList.add('visible');
        } else {
            this.backToTopBtn?.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.setupObserver();
    }

    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');

                    // Special handling for testimonials
                    if (entry.target.classList.contains('testimonials')) {
                        this.animateTestimonials();
                    }
                }
            });
        }, this.observerOptions);

        // Observe sections
        document.querySelectorAll('.testimonials, .footer').forEach(section => {
            observer.observe(section);
        });
    }

    animateTestimonials() {
        const elements = document.querySelectorAll('.testimonials-header > *');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
}

// ===== TESTIMONIALS DATA (for future dynamic loading) =====
const testimonialsData = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Operations Director",
        company: "Global Supply Chain Inc.",
        avatar: "assets/testimonials/avatar-1.jpg",
        rating: 5,
        quote: "Christian's strategic approach to logistics optimization transformed our operations completely. His ability to analyze complex supply chain challenges and implement data-driven solutions resulted in significant cost savings and improved efficiency across all departments."
    },
    {
        id: 2,
        name: "Michael Rodriguez",
        role: "Fleet Operations Manager",
        company: "TransLogistics USA",
        avatar: null,
        rating: 5,
        quote: "Working with Christian was a game-changer for our fleet management. His expertise in TMS implementation and carrier relationship building helped us achieve 99% on-time delivery while reducing operational costs by 25%. A true professional."
    },
    {
        id: 3,
        name: "Amanda Chen",
        role: "Senior Business Analyst",
        company: "Logistics Solutions Corp",
        avatar: null,
        rating: 5,
        quote: "Christian's leadership skills are exceptional. He managed our remote logistics team with precision and built processes that scaled our operations seamlessly. His analytical mindset and problem-solving abilities are truly impressive."
    }
];

// ===== ENHANCED PERFORMANCE =====
class PerformanceEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeAnimations();
        this.preloadCriticalAssets();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    optimizeAnimations() {
        // Reduce animations for users who prefer reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-fast', '0.01s');
            document.documentElement.style.setProperty('--transition-base', '0.01s');
            document.documentElement.style.setProperty('--transition-slow', '0.01s');
        }
    }

    preloadCriticalAssets() {
        // Preload testimonial avatars
        testimonialsData.forEach(testimonial => {
            if (testimonial.avatar) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = testimonial.avatar;
                document.head.appendChild(link);
            }
        });
    }
}

// ===== ADDITIONAL UTILITY FUNCTIONS =====
Utils.formatPhoneNumber = function (phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
};

Utils.validateEmail = function (email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

Utils.copyToClipboard = function (text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Copied to clipboard:', text);
    });

};
