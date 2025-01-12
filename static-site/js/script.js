
            document.addEventListener('DOMContentLoaded', () => {
                // Initialize map
                const map = L.map('map').setView([40.7128, -74.0060], 15);
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: ' OpenStreetMap contributors'
                }).addTo(map);
                
                const marker = L.marker([40.7128, -74.0060]).addTo(map);
                marker.bindPopup("<strong>Joe's Pub</strong><br>123 main st").openPopup();

                // Initialize scroll reveal for general elements
                const revealElements = document.querySelectorAll('.reveal-content, .reveal-stagger');
                const observerOptions = {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                };

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('active');
                        }
                    });
                }, observerOptions);

                revealElements.forEach(el => observer.observe(el));

                // Initialize scroll reveal for about-image
                const aboutImageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('active');
                        } else {
                            entry.target.classList.remove('active'); // Reset animation when out of view
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '-50px'
                });

                // Observe about-image elements
                document.querySelectorAll('.about-image.reset-on-scroll').forEach(img => {
                    aboutImageObserver.observe(img);
                });
            });
        