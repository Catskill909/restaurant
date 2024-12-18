// Password Protection
const CONFIG = {
    ADMIN_PASSWORD_HASH: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // Hash of 'admin'
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_TIME: 30000, // 30 seconds
    SESSION_DURATION: 1800000 // 30 minutes
};

// Login attempt tracking
let loginAttempts = 0;
let lockoutUntil = 0;

// Hash password using SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate session token
function generateSessionToken() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Check password with rate limiting
async function checkPassword() {
    const now = Date.now();
    if (now < lockoutUntil) {
        const waitSeconds = Math.ceil((lockoutUntil - now) / 1000);
        showToast(`Too many attempts. Try again in ${waitSeconds} seconds`, 'error');
        return false;
    }

    const password = document.getElementById('adminPassword').value;
    const hashedInput = await hashPassword(password);
    
    if (hashedInput === CONFIG.ADMIN_PASSWORD_HASH) {
        // Reset login attempts on success
        loginAttempts = 0;
        
        // Generate and store session token
        const token = generateSessionToken();
        const expiry = Date.now() + CONFIG.SESSION_DURATION;
        
        // Try sessionStorage instead of localStorage for private mode
        sessionStorage.setItem('adminToken', token);
        sessionStorage.setItem('sessionExpiry', expiry.toString());
        
        // Only try to set localStorage if available
        if (StorageManager.isAvailable) {
            localStorage.setItem('adminAuthenticated', 'true');
        }
        
        document.getElementById('loginOverlay').style.display = 'none';
        
        // Initialize components after successful login
        initializeComponents();
        return true;
    } else {
        loginAttempts++;
        if (loginAttempts >= CONFIG.MAX_LOGIN_ATTEMPTS) {
            lockoutUntil = now + CONFIG.LOCKOUT_TIME;
            showToast(`Too many failed attempts. Locked out for ${CONFIG.LOCKOUT_TIME / 1000} seconds`, 'error');
        } else {
            showToast(`Invalid password. ${CONFIG.MAX_LOGIN_ATTEMPTS - loginAttempts} attempts remaining`, 'error');
        }
        return false;
    }
}

// Validate session
function validateSession() {
    const token = sessionStorage.getItem('adminToken');
    const expiry = parseInt(sessionStorage.getItem('sessionExpiry') || '0');
    const now = Date.now();

    if (!token || !expiry || now > expiry) {
        // Session expired or invalid
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('sessionExpiry');
        localStorage.removeItem('adminAuthenticated');
        return false;
    }

    // Extend session on activity
    sessionStorage.setItem('sessionExpiry', (now + CONFIG.SESSION_DURATION).toString());
    return true;
}

// Modal Management
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Modal State Management - Enhancement
const ModalManager = {
    activeModal: null,
    
    show(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            // Preserve existing modal display logic
            if (modal.style.display === 'flex') return;
            
            // Close any open modal first
            if (this.activeModal) {
                this.close();
            }
            
            this.activeModal = modal;
            modal.classList.add('active');
            modal.style.display = 'flex';
            console.log(`Modal ${modalId} shown`);
        }
    },
    
    close() {
        if (this.activeModal) {
            this.activeModal.classList.remove('active');
            this.activeModal.style.display = 'none';
            this.activeModal = null;
        }
    },
    
    init() {
        // Preserve existing click handlers
        const existingModals = document.querySelectorAll('.modal');
        existingModals.forEach(modal => {
            const originalClickHandler = modal.onclick;
            modal.onclick = (e) => {
                if (e.target === modal) {
                    if (originalClickHandler) originalClickHandler(e);
                    this.close();
                }
            };
        });
    }
};

// Preserve existing initialization
const existingDOMContentLoaded = document.body.onload;
document.body.onload = function(e) {
    // Call existing initialization first
    if (existingDOMContentLoaded) existingDOMContentLoaded(e);
    
    // Then initialize modal manager
    ModalManager.init();
    
    // Add enhanced button handlers without removing existing ones
    document.body.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        
        // Only handle specific new buttons
        switch (button.id) {
            case 'site-settings-btn':
                e.preventDefault();
                ModalManager.show('settings-modal');
                break;
        }
    });
};

// Enhance existing modal functions without replacing them
const existingCloseModal = window.closeModal;
window.closeModal = function() {
    if (existingCloseModal) existingCloseModal();
    ModalManager.close();
};

const existingOpenSettingsModal = window.openSettingsModal;
window.openSettingsModal = function() {
    if (existingOpenSettingsModal) existingOpenSettingsModal();
    ModalManager.show('settings-modal');
};

const existingCloseSettingsModal = window.closeSettingsModal;
window.closeSettingsModal = function() {
    if (existingCloseSettingsModal) existingCloseSettingsModal();
    ModalManager.close();
};

// Modal Management
const settingsModal = document.getElementById('settings-modal');
const siteSettingsBtn = document.getElementById('site-settings-btn');

// Open settings modal
siteSettingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'block';
    populateSettingsForm();
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Close modals when clicking close button
document.querySelectorAll('.modal-close').forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        if (modal) modal.style.display = 'none';
    });
});

// Modal State Management
const ModalManagerOriginal = {
    activeModal: null,
    
    show(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            this.activeModal = modal;
            modal.classList.add('active');
            console.log(`Modal ${modalId} shown`);
        }
    },
    
    close() {
        if (this.activeModal) {
            this.activeModal.classList.remove('active');
            this.activeModal = null;
        }
    },
    
    init() {
        // Close on outside click using event delegation
        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.close();
            }
        });
        
        // Add close buttons to all modals
        document.querySelectorAll('.modal').forEach(modal => {
            const content = modal.querySelector('.modal-content');
            if (content && !content.querySelector('.modal-close')) {
                const closeBtn = document.createElement('button');
                closeBtn.className = 'modal-close';
                closeBtn.innerHTML = '&times;';
                closeBtn.onclick = () => this.close();
                content.insertBefore(closeBtn, content.firstChild);
            }
        });
    }
};

// Initialize admin panel
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded - Starting initialization');
    
    // Setup login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            await checkPassword();
        };
    }
    
    // Check authentication
    if (!validateSession()) {
        document.getElementById('loginOverlay').style.display = 'flex';
    } else {
        document.getElementById('loginOverlay').style.display = 'none';
        
        // Initialize components
        ModalManager.init();
        initializeHours();
        displayMenuItems();
        displayCategories();
        populateCategorySelect();
        
        // Add category button handler
        const addCategoryBtn = document.getElementById('add-category-btn');
        if (addCategoryBtn) {
            addCategoryBtn.onclick = (e) => {
                e.preventDefault();
                ModalManager.show('category-modal');
            };
        }
    }
});

// State Management
const StorageManager = {
    isAvailable: false,
    
    checkAvailability() {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            this.isAvailable = true;
            return true;
        } catch (e) {
            this.isAvailable = false;
            console.warn('localStorage is not available:', e);
            return false;
        }
    },
    
    getItem(key, defaultValue = []) {
        if (!this.isAvailable) return defaultValue;
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error(`Error getting ${key} from localStorage:`, e);
            return defaultValue;
        }
    },
    
    setItem(key, value) {
        if (!this.isAvailable) {
            showToast('Warning: Changes will not persist in private/incognito mode', 'warning');
            return false;
        }
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error(`Error saving ${key} to localStorage:`, e);
            showToast('Error saving changes. Storage might be full.', 'error');
            return false;
        }
    }
};

// Initialize storage check
StorageManager.checkAvailability();

let menuItems = StorageManager.getItem('menuItems', []);
let categories = StorageManager.getItem('categories', []);
let editingId = null;
let draggedItem = null;
let draggedCategory = null;

// DOM Elements
const menuForm = document.getElementById('menu-form');
const menuCategories = document.getElementById('menu-categories');
const categoryModal = document.getElementById('category-modal');
const categoryForm = document.getElementById('category-form');
const categoriesList = document.getElementById('categories-list');
const cancelEditBtn = document.getElementById('cancel-edit');
const formTitle = document.getElementById('form-title');
const imageInput = document.getElementById('item-image');
const imagePreview = document.getElementById('image-preview').querySelector('img');

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
    StorageManager.setItem('menuItems', menuItems);
    
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
    
    // Group items by category while preserving order
    const itemsByCategory = {};
    categories.forEach(category => {
        // Get items for this category in their current order
        itemsByCategory[category] = menuItems.filter(item => item.category === category);
    });
    
    // Display categories in order
    categories.forEach(category => {
        const items = itemsByCategory[category];
        if (items && items.length > 0) {
            const section = document.createElement('div');
            section.className = 'menu-category';
            
            section.innerHTML = `
                <h3>${category} <span class="category-count">(${items.length})</span></h3>
                <div class="menu-items" data-category="${category}">
                    ${items.map((item, index) => `
                        <div class="menu-item" draggable="true" data-item-id="${item.id}" data-category="${item.category}" data-index="${index}">
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
    categoriesList.innerHTML = `
        <div class="categories-header">
            <h3>Current Categories</h3>
            <button id="saveCategoriesBtn" class="primary-btn" style="background: #E6C9A8; color: #1a1a1a; font-weight: 600;">
                <i class="fas fa-save"></i> Save Order
            </button>
        </div>
        <div class="categories-list">
            ${categories.map((category, index) => `
                <div class="category-item" draggable="true" data-category="${category}">
                    <div class="category-content">
                        <div class="drag-handle">
                            <i class="fas fa-grip-vertical"></i>
                        </div>
                        <span>${category}</span>
                        <button onclick="handleDeleteCategory('${category}')" class="action-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Add save button listener
    const saveBtn = document.getElementById('saveCategoriesBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            StorageManager.setItem('categories', categories);
            populateCategorySelect();
            displayMenuItems();
            closeModal();
            showToast('Categories saved successfully!', 'success');
        });
    }
}

function addNewCategory() {
    const input = document.getElementById('new-category-name');
    const newCategory = input.value.trim();
    
    if (newCategory) {
        if (categories.includes(newCategory)) {
            showToast('Category already exists!', 'error');
            return;
        }
        
        categories.push(newCategory);
        input.value = '';
        displayCategories();
        showToast('Category added successfully!', 'success');
    }
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
        StorageManager.setItem('menuItems', menuItems);
        
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
function handleDeleteCategory(category) {
    if (confirm(`Delete category "${category}"? This will not delete the items in this category.`)) {
        categories = categories.filter(c => c !== category);
        StorageManager.setItem('categories', categories);
        populateCategorySelect();
        displayCategories();
        showToast('Category deleted successfully!', 'success');
    }
}

function handleSaveCategories() {
    StorageManager.setItem('categories', categories);
    populateCategorySelect();
    displayMenuItems();
    closeModal();
    showToast('Categories saved successfully!', 'success');
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

// Event Listeners
cancelEditBtn.addEventListener('click', resetForm);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('category-modal');
    if (e.target === modal) {
        closeModal();
    }
});

// Add close button to modal
const modalContent = document.querySelector('.modal-content');
if (modalContent && !modalContent.querySelector('.modal-close')) {
    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = closeModal;
    modalContent.insertBefore(closeButton, modalContent.firstChild);
}

// Category Drag and Drop Functions
function handleCategoryDragStart(e) {
    const categoryItem = e.target.closest('.category-item');
    if (!categoryItem) return;

    draggedCategory = categoryItem;
    draggedCategory.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', draggedCategory.dataset.category);
}

function handleCategoryDragEnd(e) {
    if (draggedCategory) {
        draggedCategory.classList.remove('dragging');
        draggedCategory = null;
    }
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('drop-target');
    });
    document.querySelectorAll('.drop-marker').forEach(marker => {
        marker.remove();
    });
}

function handleCategoryDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const item = e.target.closest('.category-item');
    if (!item || item === draggedCategory) return;
    
    const rect = item.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    
    // Remove existing markers
    document.querySelectorAll('.drop-marker').forEach(m => m.remove());
    
    // Create and position marker
    const marker = document.createElement('div');
    marker.className = 'drop-marker';
    
    if (y < height / 2) {
        item.parentNode.insertBefore(marker, item);
    } else {
        item.parentNode.insertBefore(marker, item.nextSibling);
    }
}

function handleCategoryDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const marker = document.querySelector('.drop-marker');
    if (!marker || !draggedCategory) return;
    
    const dropTarget = marker.nextElementSibling;
    const draggedCategoryName = draggedCategory.dataset.category;
    
    // Get indices
    const fromIndex = categories.indexOf(draggedCategoryName);
    let toIndex = dropTarget ? 
        categories.indexOf(dropTarget.dataset.category) : 
        categories.length;
    
    if (fromIndex === -1) return;
    if (toIndex === -1) toIndex = categories.length;
    
    // Remove dragged item
    categories.splice(fromIndex, 1);
    
    // If dropping after the original position, we need to adjust the insert position
    if (toIndex > fromIndex) toIndex--;
    
    // Insert at new position
    categories.splice(toIndex, 0, draggedCategoryName);
    
    // Clean up
    marker.remove();
    draggedCategory = null;
    
    // Update display and save
    displayCategories();
    StorageManager.setItem('categories', categories);
    showToast('Category order updated', 'success');
}

// Initialize category drag and drop
document.addEventListener('DOMContentLoaded', () => {
    const categoriesList = document.getElementById('categories-list');
    if (categoriesList) {
        categoriesList.addEventListener('dragstart', handleCategoryDragStart);
        categoriesList.addEventListener('dragend', handleCategoryDragEnd);
        categoriesList.addEventListener('dragover', handleCategoryDragOver);
        categoriesList.addEventListener('drop', handleCategoryDrop);
    }
});

// Drag and drop handlers
function initializeDragAndDrop() {
    // Menu items drag and drop only
    document.addEventListener('dragstart', (e) => {
        const menuItem = e.target.closest('.menu-item');
        if (menuItem) {
            handleDragStart(e);
        }
    });

    document.addEventListener('dragend', (e) => {
        const menuItem = e.target.closest('.menu-item');
        if (menuItem) {
            handleDragEnd(e);
        }
    });

    document.addEventListener('dragover', (e) => {
        const menuItem = e.target.closest('.menu-item');
        if (menuItem) {
            handleDragOver(e);
        }
    });

    document.addEventListener('drop', (e) => {
        const menuItem = e.target.closest('.menu-item');
        if (menuItem) {
            handleDrop(e);
        }
    });
}

function handleDragStart(e) {
    const menuItem = e.target.closest('.menu-item');
    if (!menuItem) return;

    draggedItem = menuItem;
    e.dataTransfer.effectAllowed = 'move';
    menuItem.classList.add('dragging');

    // Set the item's ID as the drag data
    e.dataTransfer.setData('text/plain', menuItem.dataset.itemId);
}

function handleDragEnd(e) {
    const menuItem = e.target.closest('.menu-item');
    if (!menuItem) return;

    menuItem.classList.remove('dragging');
    draggedItem = null;

    // Remove drag-over class from all containers
    document.querySelectorAll('.menu-items').forEach(container => {
        container.classList.remove('drag-over');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();

    const container = e.target.closest('.menu-items');
    if (!container || !draggedItem) return;

    e.preventDefault();
    e.stopPropagation();

    // Remove drag-over class from all containers
    document.querySelectorAll('.menu-items').forEach(el => {
        el.classList.remove('drag-over');
    });

    // Add drag-over class to current container
    container.classList.add('drag-over');
    e.dataTransfer.dropEffect = 'move';

    // Find the closest menu item
    const closestItem = e.target.closest('.menu-item');
    if (!closestItem || closestItem === draggedItem) return;

    // Get mouse position relative to the item
    const rect = closestItem.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const threshold = rect.height * 0.25;
    
    // Remove existing markers
    container.querySelectorAll('.drop-marker').forEach(marker => marker.remove());

    // Create and position drop marker
    const marker = document.createElement('div');
    marker.className = 'drop-marker';
    
    if (mouseY > threshold) {
        closestItem.parentNode.insertBefore(marker, closestItem.nextSibling);
    } else {
        closestItem.parentNode.insertBefore(marker, closestItem);
    }
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const container = e.target.closest('.menu-items');
    if (!container || !draggedItem) return;

    const newCategory = container.dataset.category;
    const itemId = draggedItem.dataset.itemId;
    const oldCategory = draggedItem.dataset.category;

    // Get the item being dropped on
    const targetItem = e.target.closest('.menu-item');
    
    // Find the dragged item in the menuItems array
    const draggedItemIndex = menuItems.findIndex(item => item.id === itemId);
    if (draggedItemIndex === -1) return;

    // Remove the item from its current position
    const [movedItem] = menuItems.splice(draggedItemIndex, 1);
    movedItem.category = newCategory;

    // If dropping directly on a category container (not on an item)
    if (!targetItem) {
        // Add to the end of the category
        const lastCategoryItemIndex = menuItems.findLastIndex(item => item.category === newCategory);
        const insertIndex = lastCategoryItemIndex === -1 ? menuItems.length : lastCategoryItemIndex + 1;
        menuItems.splice(insertIndex, 0, movedItem);
    } else {
        // Get the target item's position
        const targetItemId = targetItem.dataset.itemId;
        const targetIndex = menuItems.findIndex(item => item.id === targetItemId);
        
        // Get mouse position relative to the target item
        const rect = targetItem.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;
        const threshold = rect.height * 0.75;
        
        // Insert before or after based on mouse position
        let insertIndex;
        if (mouseY <= threshold) {
            insertIndex = targetIndex;
        } else {
            insertIndex = targetIndex + 1;
        }

        // Adjust index if we're moving within the same category and moving down
        if (oldCategory === newCategory && draggedItemIndex < targetIndex) {
            insertIndex--;
        }

        menuItems.splice(insertIndex, 0, movedItem);
    }

    // Update localStorage and refresh display
    StorageManager.setItem('menuItems', menuItems);
    displayMenuItems();
}

function addDropMarkerStyle() {
    const style = document.createElement('style');
    style.textContent = `
        .modal-content {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE/Edge */
        }
        
        .modal-content::-webkit-scrollbar {
            display: none;
        }
        
        .modal-content:hover {
            scrollbar-width: thin;
            -ms-overflow-style: auto;
        }
        
        .modal-content:hover::-webkit-scrollbar {
            display: block;
            width: 8px;
        }
        
        .modal-content:hover::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
        }
        
        .modal-content:hover::-webkit-scrollbar-thumb {
            background: var(--accent);
            border-radius: 4px;
        }
        
        .modal-content:hover::-webkit-scrollbar-thumb:hover {
            background: #fff;
        }
        
        .modal-close {
            position: absolute;
            right: 15px;
            top: 15px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #E6C9A8;
            padding: 5px;
            line-height: 1;
            z-index: 1000;
        }
        .modal-close:hover {
            color: #fff;
        }
        .drop-marker {
            height: 2px;
            background-color: #E6C9A8;
            margin: 4px 0;
            transition: all 0.2s ease;
            position: relative;
        }
        .drop-marker::before {
            content: '';
            position: absolute;
            left: 0;
            top: -3px;
            width: 8px;
            height: 8px;
            background-color: #E6C9A8;
            border-radius: 50%;
        }
        .category-item.dragging {
            opacity: 0.5;
            cursor: move;
        }
        .category-item.drop-target {
            border: 2px dashed #E6C9A8;
            background: rgba(230, 201, 168, 0.1);
        }
        .category-item {
            cursor: move;
            user-select: none;
            margin: 4px 0;
            padding: 8px;
            background: var(--dark-bg);
            border-radius: 4px;
            transition: all 0.2s ease;
        }
    `;
    document.head.appendChild(style);
}

// Category Form Submission
document.getElementById('category-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const categoryName = document.getElementById('category-name').value.trim();
    
    if (categoryName) {
        // Add new category
        categories.push({
            id: Date.now().toString(),
            name: categoryName,
            items: []
        });
        
        // Save to localStorage
        StorageManager.setItem('categories', categories);
        
        // Update UI
        displayCategories();
        populateCategorySelect();
        
        // Reset form and close modal
        document.getElementById('category-name').value = '';
        ModalManager.close();
        
        showToast('Category added successfully');
    }
});

// Site Settings Management
const defaultSettings = {
    restaurant: {
        name: 'Bistro Cascade',
        tagline: 'Modern American Cuisine'
    },
    contact: {
        phone: '(555) 123-4567',
        email: 'info@bistrocascade.com',
        address: '123 Main Street, Anytown, USA'
    },
    hours: {
        monday: { open: '11:30', close: '22:00' },
        tuesday: { open: '11:30', close: '22:00' },
        wednesday: { open: '11:30', close: '22:00' },
        thursday: { open: '11:30', close: '22:00' },
        friday: { open: '11:30', close: '23:00' },
        saturday: { open: '11:30', close: '23:00' },
        sunday: { open: '11:30', close: '21:00' }
    },
    story: {
        title: 'Our Story',
        lead: 'A Culinary Journey',
        content: 'Founded in 2020, Bistro Cascade brings together traditional flavors and modern techniques. Our chefs are passionate about creating memorable dining experiences using locally-sourced ingredients.'
    }
};

// Load site settings with defaults
function loadSiteSettings() {
    const savedSettings = StorageManager.getItem('siteSettings');
    if (!savedSettings) {
        // If no settings exist, use defaults
        saveSiteSettings(defaultSettings);
        return defaultSettings;
    }
    return savedSettings;
}

// Save settings to localStorage
function saveSiteSettings(settings) {
    StorageManager.setItem('siteSettings', settings);
    showToast('Settings saved successfully');
    updateSiteContent();
}

// Update site content with new settings
function updateSiteContent() {
    const settings = loadSiteSettings();
    
    // Update page title and nav brand
    document.title = settings.restaurant.name;
    const navBrand = document.querySelector('.nav-brand');
    if (navBrand) {
        navBrand.textContent = settings.restaurant.name;
    }
    
    // Update hero section
    const heroTitle = document.querySelector('.hero-content h1');
    const heroTagline = document.querySelector('.hero-content p');
    if (heroTitle) {
        heroTitle.textContent = settings.restaurant.name;
    }
    if (heroTagline) {
        heroTagline.textContent = settings.restaurant.tagline;
    }
    
    // Update contact information
    const phoneElement = document.querySelector('.contact-box .fa-phone')?.parentElement;
    const emailElement = document.querySelector('.contact-box .fa-envelope')?.parentElement;
    const addressElement = document.querySelector('.contact-box .fa-map-marker-alt')?.parentElement;
    
    if (phoneElement) {
        phoneElement.innerHTML = `<i class="fas fa-phone"></i> ${settings.contact.phone}`;
    }
    if (emailElement) {
        emailElement.innerHTML = `<i class="fas fa-envelope"></i> ${settings.contact.email}`;
    }
    if (addressElement) {
        addressElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${settings.contact.address}`;
    }
    
    // Update business hours
    const hoursList = document.querySelector('.hours-list');
    if (hoursList && settings.hours) {
        const daysMap = {
            monday: 'Monday',
            tuesday: 'Tuesday',
            wednesday: 'Wednesday',
            thursday: 'Thursday',
            friday: 'Friday',
            saturday: 'Saturday',
            sunday: 'Sunday'
        };
        
        let hoursHTML = '';
        Object.entries(settings.hours).forEach(([day, times]) => {
            if (times.open && times.close) {
                hoursHTML += `<li><span>${daysMap[day]}:</span> ${formatTime(times.open)} - ${formatTime(times.close)}</li>`;
            }
        });
        
        if (hoursHTML) {
            hoursList.innerHTML = hoursHTML;
        }
    }
}

// Function to format time in 12-hour format
function formatTime(time) {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// Function to format time for input fields
function formatTimeForInput(time) {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}

// Initialize hours inputs with default values
function initializeHours() {
    console.log('Initializing hours...');
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const container = document.getElementById('hours-container');
    const settings = loadSiteSettings();
    
    if (!container) {
        console.error('Hours container not found!');
        return;
    }

    container.innerHTML = ''; // Clear existing content
    
    days.forEach(day => {
        const hours = settings.hours[day] || { open: '11:30', close: '22:00' };
        const row = document.createElement('div');
        row.className = 'hours-row';
        row.innerHTML = `
            <label>${day.charAt(0).toUpperCase() + day.slice(1)}</label>
            <div class="time-inputs">
                <div class="time-input-wrapper">
                    <input type="time" 
                           class="form-control time-input" 
                           id="${day}-open"
                           value="${hours.open}"
                           required>
                    <button type="button" 
                            class="time-picker-trigger" 
                            data-input="${day}-open"
                            onclick="showTimePicker(this)">🕒</button>
                </div>
                <span>to</span>
                <div class="time-input-wrapper">
                    <input type="time" 
                           class="form-control time-input" 
                           id="${day}-close"
                           value="${hours.close}"
                           required>
                    <button type="button" 
                            class="time-picker-trigger" 
                            data-input="${day}-close"
                            onclick="showTimePicker(this)">🕒</button>
                </div>
            </div>
        `;
        container.appendChild(row);
    });
}

// Simple function to show time picker
function showTimePicker(button) {
    try {
        console.log('showTimePicker called');
        const inputId = button.getAttribute('data-input');
        console.log('Input ID:', inputId);
        
        if (!inputId) {
            console.error('No input ID found on button');
            return;
        }

        const wrapper = button.closest('.time-input-wrapper');
        if (!wrapper) {
            console.error('Could not find wrapper');
            return;
        }

        // Remove any existing picker
        const existingPicker = document.querySelector('.time-picker-popup');
        if (existingPicker) {
            console.log('Removing existing picker');
            existingPicker.remove();
        }

        // Create time picker
        const picker = document.createElement('div');
        picker.className = 'time-picker-popup';
        
        // Add common times
        const commonTimes = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
            '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
            '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
            '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
        ];
        
        let pickerHTML = '<div class="time-options">';
        commonTimes.forEach(time => {
            const [hours, minutes] = time.split(':');
            const hour = parseInt(hours);
            const displayHour = hour % 12 || 12;
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayTime = `${displayHour}:${minutes} ${ampm}`;
            pickerHTML += `
                <div class="time-option" data-value="${time}">
                    ${displayTime}
                </div>
            `;
        });
        pickerHTML += '</div>';
        picker.innerHTML = pickerHTML;
        
        // Insert picker after the input
        wrapper.appendChild(picker);
        console.log('Picker added to wrapper:', wrapper);

        // Add click handlers
        picker.addEventListener('click', (e) => {
            const option = e.target.closest('.time-option');
            if (option) {
                const value = option.getAttribute('data-value');
                const input = document.getElementById(inputId);
                if (input) {
                    input.value = value;
                    picker.remove();
                }
            }
        });

        // Close when clicking outside
        document.addEventListener('click', function closePicker(e) {
            if (!picker.contains(e.target) && e.target !== button) {
                picker.remove();
                document.removeEventListener('click', closePicker);
            }
        });

    } catch (error) {
        console.error('Error in showTimePicker:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing hours...');
    initializeHours();
});

// Handle settings form submission
document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const settings = {
        restaurant: {
            name: document.getElementById('restaurant-name').value,
            tagline: document.getElementById('restaurant-tagline').value
        },
        contact: {
            phone: document.getElementById('restaurant-phone').value,
            email: document.getElementById('restaurant-email').value,
            address: document.getElementById('restaurant-address').value
        },
        hours: {},
        story: {
            title: document.getElementById('story-title').value,
            lead: document.getElementById('story-lead').value,
            content: document.getElementById('story-content').value
        }
    };
    
    // Collect hours
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    days.forEach(day => {
        const openInput = document.querySelector(`input[data-day="${day}"][data-type="open"]`);
        const closeInput = document.querySelector(`input[data-day="${day}"][data-type="close"]`);
        
        if (openInput && closeInput) {
            settings.hours[day] = {
                open: openInput.value,
                close: closeInput.value
            };
        }
    });
    
    saveSiteSettings(settings);
    updateHoursDisplay();
    showToast('Settings saved successfully');
    closeSettingsModal();
});

// Populate form with current settings
function populateSettingsForm() {
    const settings = loadSiteSettings();
    
    // Restaurant info
    document.getElementById('restaurant-name').value = settings.restaurant.name || '';
    document.getElementById('restaurant-tagline').value = settings.restaurant.tagline || '';
    
    // Story section
    document.getElementById('story-title').value = settings.story.title || '';
    document.getElementById('story-lead').value = settings.story.lead || '';
    document.getElementById('story-content').value = settings.story.content || '';
    
    // Contact info
    document.getElementById('restaurant-phone').value = settings.contact.phone || '';
    document.getElementById('restaurant-email').value = settings.contact.email || '';
    document.getElementById('restaurant-address').value = settings.contact.address || '';
    
    // Initialize hours
    initializeHours();
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close time picker when clicking outside
    document.addEventListener('click', (e) => {
        const timePicker = document.querySelector('.time-picker-popup');
        if (timePicker && !timePicker.contains(e.target) && 
            !e.target.classList.contains('time-picker-trigger') && 
            !e.target.classList.contains('time-input')) {
            timePicker.remove();
        }
    });
});

// Update front-end hours display
function updateHoursDisplay() {
    const settings = loadSiteSettings();
    const hoursList = document.querySelector('.hours-list');
    
    if (!hoursList || !settings.hours) return;
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    let hoursHTML = '';
    
    days.forEach(day => {
        const hours = settings.hours[day];
        if (hours && hours.open && hours.close) {
            hoursHTML += `<li><span>${day.charAt(0).toUpperCase() + day.slice(1)}:</span> ${formatTime(hours.open)} - ${formatTime(hours.close)}</li>`;
        }
    });
    
    hoursList.innerHTML = hoursHTML;
}

// Add a function to initialize components
async function initializeComponents() {
    try {
        await Promise.all([
            displayMenuItems(),
            displayCategories(),
            populateCategorySelect(),
            initializeHours()
        ]);
        
        // Show storage warning if in private mode
        if (!StorageManager.isAvailable) {
            showToast('Private/Incognito Mode: Changes will not be saved', 'warning');
        }
    } catch (error) {
        console.error('Error initializing components:', error);
        showToast('Error loading content. Please try again.', 'error');
    }
}
