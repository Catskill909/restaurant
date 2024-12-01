// State Management
let menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || ['Appetizers', 'Main Course', 'Desserts', 'Drinks'];
let editingId = null;

// DOM Elements
const menuForm = document.getElementById('menu-form');
const menuCategories = document.getElementById('menu-categories');
const categoryModal = document.getElementById('category-modal');
const categoryForm = document.getElementById('category-form');
const categoriesList = document.getElementById('categories-list');
const addCategoryBtn = document.getElementById('add-category-btn');
const cancelEditBtn = document.getElementById('cancel-edit');
const formTitle = document.getElementById('form-title');
const imageInput = document.getElementById('item-image');
const imagePreview = document.getElementById('image-preview').querySelector('img');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateCategorySelect();
    displayMenuItems();
    displayCategories();
});

// Image Preview
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Add/Edit Menu Item
menuForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        id: editingId || Date.now().toString(),
        name: document.getElementById('item-name').value,
        category: document.getElementById('item-category').value,
        price: parseFloat(document.getElementById('item-price').value),
        description: document.getElementById('item-description').value,
        image: imagePreview.src
    };

    if (editingId) {
        // Update existing item
        const index = menuItems.findIndex(item => item.id === editingId);
        if (index !== -1) {
            menuItems[index] = formData;
            showToast('Item updated successfully!', 'success');
        }
    } else {
        // Add new item
        menuItems.push(formData);
        showToast('Item added successfully!', 'success');
    }

    // Save and reset
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    
    // Trigger storage event for other windows
    const event = new Event('storage');
    event.key = 'menuItems';
    event.newValue = JSON.stringify(menuItems);
    window.dispatchEvent(event);
    
    resetForm();
    displayMenuItems();
});

// Display Functions
function displayMenuItems() {
    menuCategories.innerHTML = '';
    
    // Group items by category
    const itemsByCategory = menuItems.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});
    
    // Create category sections
    Object.entries(itemsByCategory).forEach(([category, items]) => {
        if (items.length > 0) {
            const section = document.createElement('div');
            section.className = 'menu-category';
            
            section.innerHTML = `
                <h3>${category} (${items.length})</h3>
                <div class="menu-items">
                    ${items.map(item => `
                        <div class="menu-item">
                            <div class="menu-item-image">
                                <img src="${item.image}" alt="${item.name}" loading="lazy">
                            </div>
                            <div class="menu-item-content">
                                <h4>${item.name}</h4>
                                <p class="description">${item.description}</p>
                                <p class="price">$${item.price.toFixed(2)}</p>
                            </div>
                            <div class="item-actions">
                                <button onclick="editMenuItem('${item.id}')" class="action-btn edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteMenuItem('${item.id}')" class="action-btn delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            menuCategories.appendChild(section);
        }
    });
}

function displayCategories() {
    categoriesList.innerHTML = categories.map(category => `
        <div class="category-item">
            <span>${category}</span>
            ${category !== 'Appetizers' && category !== 'Main Course' && category !== 'Desserts' && category !== 'Drinks' ? 
                `<button onclick="deleteCategory('${category}')" class="action-btn delete">
                    <i class="fas fa-trash"></i>
                </button>` : ''
            }
        </div>
    `).join('');
}

function populateCategorySelect() {
    const select = document.getElementById('item-category');
    select.innerHTML = `
        <option value="">Select Category</option>
        ${categories.map(category => 
            `<option value="${category}">${category}</option>`
        ).join('')}
    `;
}

// Edit and Delete Functions
function editMenuItem(id) {
    const item = menuItems.find(item => item.id === id);
    if (item) {
        editingId = id;
        formTitle.textContent = 'Edit Menu Item';
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-category').value = item.category;
        document.getElementById('item-price').value = item.price;
        document.getElementById('item-description').value = item.description;
        imagePreview.src = item.image;
        cancelEditBtn.style.display = 'block';
        menuForm.scrollIntoView({ behavior: 'smooth' });
    }
}

function deleteMenuItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        menuItems = menuItems.filter(item => item.id !== id);
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        
        // Trigger storage event for other windows
        const event = new Event('storage');
        event.key = 'menuItems';
        event.newValue = JSON.stringify(menuItems);
        window.dispatchEvent(event);
        
        displayMenuItems();
        showToast('Item deleted successfully!', 'success');
    }
}

// Category Management
function deleteCategory(category) {
    if (confirm(`Delete category "${category}"? This will not delete the items in this category.`)) {
        categories = categories.filter(c => c !== category);
        localStorage.setItem('categories', JSON.stringify(categories));
        populateCategorySelect();
        displayCategories();
        showToast('Category deleted successfully!', 'success');
    }
}

// Utility Functions
function resetForm() {
    editingId = null;
    formTitle.textContent = 'Add Menu Item';
    menuForm.reset();
    imagePreview.src = 'https://via.placeholder.com/150';
    cancelEditBtn.style.display = 'none';
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type} show`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function closeModal() {
    categoryModal.classList.remove('active');
}

// Event Listeners
cancelEditBtn.addEventListener('click', resetForm);

// Close modal when clicking outside
categoryModal.addEventListener('click', (e) => {
    if (e.target === categoryModal) {
        closeModal();
    }
});
