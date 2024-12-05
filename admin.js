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
    
    // Sort categories alphabetically
    const sortedCategories = Object.keys(itemsByCategory).sort();
    
    // Create category sections
    sortedCategories.forEach(category => {
        const items = itemsByCategory[category];
        if (items.length > 0) {
            const section = document.createElement('div');
            section.className = 'menu-category';
            
            section.innerHTML = `
                <h3>${category} <span class="category-count">(${items.length})</span></h3>
                <div class="menu-items">
                    ${items.map(item => `
                        <div class="menu-item" data-category="${item.category}">
                            <div class="menu-item-image">
                                <img 
                                    src="${item.image || 'placeholder.jpg'}" 
                                    alt="${item.name}"
                                    loading="lazy"
                                    onerror="this.src='placeholder.jpg'; this.classList.add('placeholder');"
                                >
                            </div>
                            <div class="menu-item-content">
                                <div class="menu-item-info">
                                    <div class="menu-item-name" title="${item.name}">${item.name}</div>
                                    <div class="menu-item-description" title="${item.description}">${item.description}</div>
                                </div>
                                <div class="menu-item-footer">
                                    <div class="menu-item-price">$${item.price.toFixed(2)}</div>
                                    <div class="menu-item-actions">
                                        <button onclick="editMenuItem('${item.id}')" class="edit-btn" title="Edit item">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button onclick="deleteMenuItem('${item.id}')" class="delete-btn" title="Delete item">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            menuCategories.appendChild(section);
        }
    });
    
    // Show empty state if no items
    if (menuItems.length === 0) {
        menuCategories.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-utensils"></i>
                <h3>No menu items yet</h3>
                <p>Start by adding your first menu item using the form on the left.</p>
            </div>
        `;
    }
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

// Add Category Button
addCategoryBtn.addEventListener('click', () => {
    categoryModal.classList.add('active');
});

// Category Form Submission
categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const categoryName = document.getElementById('category-name').value.trim();
    
    if (!categoryName) {
        showToast('Please enter a category name', 'warning');
        return;
    }
    
    if (categories.includes(categoryName)) {
        showToast('Category already exists!', 'warning');
        return;
    }

    // Add the category to both state and localStorage
    categories = [...categories, categoryName];
    localStorage.setItem('categories', JSON.stringify(categories));
    
    // Update UI elements
    populateCategorySelect();
    displayMenuItems();
    
    // Show success message in modal
    const modalContent = document.querySelector('.modal-content');
    modalContent.innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <h4>Category Added!</h4>
            <p>The category "${categoryName}" has been added successfully.</p>
            <button onclick="closeModal()" class="btn primary">Done</button>
        </div>
    `;

    // Auto close after 2 seconds
    setTimeout(() => {
        closeModal();
        // Reset the modal content after it's closed
        setTimeout(() => {
            modalContent.innerHTML = `
                <h3>Add Category</h3>
                <form id="category-form">
                    <div class="form-group">
                        <label for="category-name">Category Name</label>
                        <input type="text" id="category-name" class="form-control" required>
                    </div>
                    <button type="submit" class="btn primary">Add Category</button>
                </form>
            `;
            // Reattach event listener to the new form
            document.getElementById('category-form').addEventListener('submit', categoryForm.onsubmit);
        }, 300);
    }, 2000);
});

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
