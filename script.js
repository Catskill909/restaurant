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
    
    // Sort categories alphabetically
    const sortedCategories = Object.entries(itemsByCategory).sort((a, b) => a[0].localeCompare(b[0]));
    
    // Create a container for each category
    sortedCategories.forEach(([category, items]) => {
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
    menuItem.className = 'restaurant-menu-item';
    menuItem.innerHTML = `
        <div class="restaurant-menu-item-image">
            <img src="${item.image || 'placeholder.jpg'}" alt="${item.name}">
        </div>
        <div class="restaurant-menu-item-content">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="restaurant-menu-item-footer">
                <span class="restaurant-menu-item-price">$${item.price.toFixed(2)}</span>
            </div>
        </div>
    `;
    return menuItem;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayMenuItems();
    initMap();
    
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
