// Menu items data
const menuItems = [];

// Menu display functionality
function displayMenuItems() {
    const menuGrid = document.getElementById('menu-items');
    if (!menuGrid) return;
    
    // Get menu items and categories from localStorage
    const items = JSON.parse(localStorage.getItem('menuItems')) || [];
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    
    // Clear the menu grid
    menuGrid.innerHTML = '';
    
    // Create wrapper for two-column layout
    const categoriesWrapper = document.createElement('div');
    categoriesWrapper.className = 'menu-categories-wrapper';
    menuGrid.appendChild(categoriesWrapper);
    
    // Group items by category
    const itemsByCategory = items.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});
    
    // Use categories array to maintain admin-defined order
    categories.forEach(category => {
        const items = itemsByCategory[category];
        if (items && items.length > 0) {
            const categorySection = document.createElement('div');
            categorySection.className = 'menu-category';
            
            const categoryTitle = document.createElement('h2');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = category;
            categorySection.appendChild(categoryTitle);

            const menuItemsContainer = document.createElement('div');
            menuItemsContainer.className = 'menu-items';
            
            items.forEach(item => {
                menuItemsContainer.appendChild(createMenuItemElement(item));
            });
            
            categorySection.appendChild(menuItemsContainer);
            categoriesWrapper.appendChild(categorySection);
        }
    });

    // Show a message if no items are available
    if (categoriesWrapper.children.length === 0) {
        menuGrid.innerHTML = '<p class="no-items">No menu items available. Please check back later.</p>';
    }
}

function createMenuItemElement(item) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.innerHTML = `
        <div class="menu-item-image">
            <img src="${item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80'}" alt="${item.name}">
        </div>
        <div class="menu-item-content">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="menu-item-footer">
                <span class="price">$${item.price.toFixed(2)}</span>
            </div>
        </div>
    `;
    return menuItem;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayMenuItems();
    initMap();
    initNavigation();
    initScrollReveal();
    
    // Listen for changes in localStorage
    window.addEventListener('storage', (e) => {
        if (e.key === 'menuItems') {
            displayMenuItems();
        }
    });

    // Handle reservation form
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', handleReservation);
    }
});

function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -25% 0px', // Trigger when element is 25% into viewport
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                // Reset animation when element is out of view
                if (entry.target.classList.contains('reset-on-scroll')) {
                    entry.target.classList.remove('active');
                }
            }
        });
    }, observerOptions);

    // Observe reveal elements
    document.querySelectorAll('.reveal-content, .reveal-stagger, .about-image').forEach(el => {
        el.classList.add('reset-on-scroll'); // Add class to enable animation reset
        observer.observe(el);
    });
}

// Initialize navigation functionality
function initNavigation() {
    const nav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-links a');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    // Update active section on scroll
    function updateActiveSection() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // Add scrolled class when page is scrolled
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    // Add smooth scroll behavior to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
                mobileMenu.classList.remove('active');
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                mobileMenu.classList.remove('active');
            }
        });
    }

    // Add scroll event listener with throttling for better performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial call to set active section
    updateActiveSection();
}

// Initialize the map
function initMap() {
    // Restaurant coordinates (replace with your actual coordinates)
    const lat = 40.7128;
    const lng = -74.0060;
    
    // Create map
    const map = L.map('map').setView([lat, lng], 15);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors'
    }).addTo(map);
    
    // Add marker for restaurant location
    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup('<strong>Our Restaurant</strong><br>123 Restaurant Street').openPopup();
}

// Handle reservation form submission
function handleReservation(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reservationData = Object.fromEntries(formData.entries());
    
    // Simple validation
    if (!isValidPhoneNumber(reservationData.phone)) {
        alert('Please enter a valid phone number');
        return;
    }

    if (!isValidDate(reservationData.date)) {
        alert('Please select a valid date');
        return;
    }

    // Here you would typically send the data to your server
    console.log('Reservation data:', reservationData);
    
    // For demo purposes, show success message
    alert('Reservation submitted successfully! We will confirm your reservation shortly.');
    e.target.reset();
}

// Validation helpers
function isValidPhoneNumber(phone) {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
}

function isValidDate(date) {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
}
