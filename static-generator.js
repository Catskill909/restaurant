// static-generator.js
const fs = require('fs').promises;
const path = require('path');

async function generateStaticSite() {
    try {
        console.log('Reading CMS data...');
        const cmsData = JSON.parse(await fs.readFile('cms-data.json', 'utf8'));

        // Create output directory structure
        const outputDir = 'static-site';
        await fs.mkdir(outputDir, { recursive: true });
        await fs.mkdir(path.join(outputDir, 'js'), { recursive: true });
        await fs.mkdir(path.join(outputDir, 'images'), { recursive: true });

        // Parse all data
        const menuItems = JSON.parse(cmsData.menuItems || '[]');
        const categories = JSON.parse(cmsData.categories || '[]');
        const settings = JSON.parse(cmsData.restaurantSettings || '{}');

        // Generate menu HTML
        let menuHtml = '';
        categories.forEach(category => {
            const categoryItems = menuItems.filter(item => item.category === category);
            if (categoryItems.length > 0) {
                menuHtml += `
                    <div class="menu-category">
                        <h3>${category}</h3>
                        <div class="menu-items">
                            ${categoryItems.map(item => `
                                <div class="menu-item">
                                    <div class="menu-item-image">
                                        <img src="${item.image}" alt="${item.name}">
                                    </div>
                                    <div class="menu-item-content">
                                        <h3>${item.name}</h3>
                                        <p>${item.description}</p>
                                        <div class="menu-item-footer">
                                            <span class="price">$${item.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        });

        // Create navigation and scroll behavior script
        const navigationJs = `
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
        `;

        // Create map initialization script
        const scriptJs = `
            document.addEventListener('DOMContentLoaded', () => {
                // Initialize map
                const map = L.map('map').setView([40.7128, -74.0060], 15);
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: ' OpenStreetMap contributors'
                }).addTo(map);
                
                const marker = L.marker([40.7128, -74.0060]).addTo(map);
                marker.bindPopup("<strong>${settings.restaurantName || "Joe's Pub"}</strong><br>${settings.address || "123 main st"}").openPopup();

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
        `;

        // Save JavaScript files
        await fs.writeFile(path.join(outputDir, 'js', 'navigation.js'), navigationJs);
        await fs.writeFile(path.join(outputDir, 'js', 'script.js'), scriptJs);

        // Read the template and update content
        let template = await fs.readFile('index.html', 'utf8');

        // Update all content
        template = template
            // Update menu items
            .replace('<!-- Menu items will be dynamically inserted here -->', menuHtml)

            // Update about section image with proper classes
            .replace(
                /<div class="about-image">\s*<img[^>]*>/,
                `<div class="about-image reset-on-scroll active">
                    <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" alt="Our Restaurant Interior">`
            )

            // Update site name
            .replace(/Restaurant Name/g, settings.restaurantName || "Joe's Pub")
            .replace(/Joe's Pub/g, settings.restaurantName || "Joe's Pub")

            // Update contact info
            .replace(/\(555\) 123-4567/g, settings.phone || "212-334-3333")
            .replace(/info@restaurant\.com/g, settings.email || "paul@rarefunk.com")
            .replace(/reservations@restaurant\.com/g, settings.email || "paul@rarefunk.com")
            .replace(/123 Restaurant Street/g, settings.address || "123 main st")

            // Remove admin button
            .replace(/<a href="admin\.html"[^>]*>[\s\S]*?<\/a>/g, '')

            // Fix script paths and remove original map script
            .replace(
                /<script src="(script|navigation|settings).js"><\/script>/g,
                '<script src="js/$1.js"></script>'
            )
            .replace(/<script>\s*document\.addEventListener\('DOMContentLoaded',\s*function\(\)\s*{[\s\S]*?}\);\s*<\/script>/g, '');

        // Save the final HTML
        await fs.writeFile(path.join(outputDir, 'index.html'), template);

        // Copy styles
        await fs.copyFile('styles.css', path.join(outputDir, 'styles.css'));

        // Copy images
        try {
            const images = await fs.readdir('images');
            for (const image of images) {
                await fs.copyFile(
                    path.join('images', image),
                    path.join(outputDir, 'images', image)
                );
            }
        } catch (error) {
            console.log('Note: No additional images to copy');
        }

        console.log('\nStatic site generated successfully!');
        console.log('\nContent updated:');
        console.log('- Menu items');
        console.log('- Restaurant information');
        console.log('- Navigation functionality');
        console.log('- Map integration');

    } catch (error) {
        console.error('Error:', error.message);
    }
}

generateStaticSite();