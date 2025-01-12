
            document.addEventListener('DOMContentLoaded', () => {
                const nav = document.querySelector('.main-nav');
                const navLinks = document.querySelectorAll('.nav-links a');
                const hamburger = document.querySelector('.hamburger');
                const mobileMenu = document.querySelector('.mobile-menu');
                
                // Handle scroll for nav background
                const handleScroll = () => {
                    if (window.scrollY > 50) {
                        nav.classList.add('scrolled');
                    } else {
                        nav.classList.remove('scrolled');
                    }
                    
                    // Update active section
                    const sections = document.querySelectorAll('section');
                    let currentSection = '';
                    sections.forEach(section => {
                        const sectionTop = section.offsetTop - 100;
                        const sectionHeight = section.clientHeight;
                        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                            currentSection = section.getAttribute('id');
                        }
                    });

                    // Update active navigation link
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href').substring(1) === currentSection) {
                            link.classList.add('active');
                        }
                    });
                };

                // Mobile menu toggle
                if (hamburger && mobileMenu) {
                    hamburger.addEventListener('click', () => {
                        mobileMenu.classList.toggle('active');
                    });

                    // Close menu when clicking outside
                    document.addEventListener('click', (e) => {
                        if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
                            mobileMenu.classList.remove('active');
                        }
                    });
                }

                // Smooth scroll behavior
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetId = anchor.getAttribute('href').substring(1);
                        const targetSection = document.getElementById(targetId);
                        
                        if (targetSection) {
                            targetSection.scrollIntoView({
                                behavior: 'smooth'
                            });
                            mobileMenu.classList.remove('active');
                        }
                    });
                });

                // Initial call and scroll listener
                handleScroll();
                window.addEventListener('scroll', handleScroll);
            });
        