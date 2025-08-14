    
        // Navigation functionality
        const navigation = document.getElementById('navigation');
        const navToggle = document.getElementById('navToggle');
        const navOverlay = document.getElementById('navOverlay');
        
        // Mobile menu toggle
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navOverlay.classList.toggle('active');
            document.body.style.overflow = navOverlay.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close mobile menu when clicking on links
        navOverlay.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link') || e.target.classList.contains('nav-cta')) {
                navToggle.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Navigation scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navigation.classList.add('scrolled');
            } else {
                navigation.classList.remove('scrolled');
            }
        });
        
        // Animated counters
        function animateCounters() {
            const counters = document.querySelectorAll('.stat-number');
            const options = {
                threshold: 0.7
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counter = entry.target;
                        const target = parseInt(counter.getAttribute('data-target'));
                        const duration = 2000;
                        const step = target / (duration / 16);
                        let current = 0;
                        
                        const timer = setInterval(() => {
                            current += step;
                            if (current >= target) {
                                counter.textContent = target;
                                clearInterval(timer);
                            } else {
                                counter.textContent = Math.floor(current);
                            }
                        }, 16);
                        
                        observer.unobserve(counter);
                    }
                });
            }, options);
            
            counters.forEach(counter => observer.observe(counter));
        }
        
        // Initialize animations when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            animateCounters();
            
            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        const headerOffset = 100;
                        const elementPosition = target.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) {
                navToggle.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
   