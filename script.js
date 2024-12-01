// Menu items data
const menuItems = [];

// Menu display functionality
function displayMenuItems() {
    const menuGrid = document.getElementById('menu-items');
    if (!menuGrid) return;
    
    // Get menu items from localStorage (temporary solution until we have a server)
    const items = JSON.parse(localStorage.getItem('menuItems')) || [];
    
    // Clear the menu grid
    menuGrid.innerHTML = '';
    
    // Group items by category
    const itemsByCategory = items.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});
    
    // Create a container for each category
    Object.entries(itemsByCategory).forEach(([category, items]) => {
        if (items && items.length > 0) {
            const categorySection = document.createElement('div');
            categorySection.className = 'menu-category';
            
            categorySection.innerHTML = `
                <h2 class="category-title">${category}</h2>
                <div class="menu-items">
                    ${items.map(item => `
                        <div class="menu-item">
                            <div class="menu-item-image">
                                <img src="${item.image}" 
                                     alt="${item.name}" 
                                     loading="lazy"
                                     onerror="this.src='https://via.placeholder.com/150'">
                            </div>
                            <div class="menu-item-content">
                                <h3 class="item-name">${item.name}</h3>
                                <p class="description">${item.description || ''}</p>
                                <p class="price">$${parseFloat(item.price).toFixed(2)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            menuGrid.appendChild(categorySection);
        }
    });

    // Show a message if no items are available
    if (menuGrid.children.length === 0) {
        menuGrid.innerHTML = '<p class="no-items">No menu items available. Please check back later.</p>';
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Clear any old menu data from previous versions
    const oldKeys = ['menuData', 'menu', 'items'];
    oldKeys.forEach(key => localStorage.removeItem(key));
    
    displayMenuItems();
    
    // Initialize map if it exists
    const mapElement = document.getElementById('map');
    if (mapElement) {
        const map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: ' OpenStreetMap contributors'
        }).addTo(map);
        
        // Add marker
        L.marker([51.505, -0.09]).addTo(map)
            .bindPopup('Our Restaurant<br>123 Restaurant Street')
            .openPopup();
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Handle contact form submission
    document.querySelector('.contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });

    // Listen for changes in localStorage
    window.addEventListener('storage', function(e) {
        if (e.key === 'menuItems') {
            displayMenuItems();
        }
    });
});
