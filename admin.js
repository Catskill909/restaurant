// Password Protection
const ADMIN_PASSWORD = 'cascade';  // Change this to your desired password

function checkPassword() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('adminAuthenticated', 'true');
        document.getElementById('loginOverlay').style.display = 'none';
    } else {
        document.getElementById('loginError').style.display = 'block';
        setTimeout(() => {
            document.getElementById('loginError').style.display = 'none';
        }, 3000);
    }
}

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
        document.getElementById('loginOverlay').style.display = 'flex';
    } else {
        document.getElementById('loginOverlay').style.display = 'none';
    }
});

// State Management
let menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || [];
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Get the button directly
    const addCategoryBtn = document.getElementById('add-category-btn');
    const categoryModal = document.getElementById('category-modal');
    const manageCategoriesBtn = document.getElementById('manageCategoriesBtn');
    
    console.log('Add Category Button:', addCategoryBtn);
    console.log('Category Modal:', categoryModal);
    
    // Add Category Button
    if (addCategoryBtn) {
        console.log('Adding click listener to Add Category button');
        addCategoryBtn.addEventListener('click', function() {
            console.log('Add Category button clicked');
            if (categoryModal) {
                categoryModal.classList.add('active');
                console.log('Added active class to modal');
            } else {
                console.error('Category modal not found');
            }
        });
    } else {
        console.error('Add Category button not found!');
    }

    // Manage Categories Button
    if (manageCategoriesBtn) {
        manageCategoriesBtn.addEventListener('click', () => {
            displayCategories();
            categoryModal.classList.add('active');
        });
    }

    populateCategorySelect();
    displayMenuItems();
    displayCategories();
    initializeDragAndDrop();
    addDropMarkerStyle();

    // Add close button
    const modalContent = document.querySelector('.modal-content');
    if (modalContent && !modalContent.querySelector('.modal-close')) {
        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close';
        closeButton.innerHTML = '&times;';
        closeButton.onclick = closeModal;
        modalContent.insertBefore(closeButton, modalContent.firstChild);
    }

    // Click outside to close
    const modal = document.getElementById('category-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
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
            localStorage.setItem('categories', JSON.stringify(categories));
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

function closeModal() {
    const modal = document.getElementById('category-modal');
    if (modal) {
        modal.classList.remove('active');
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
function handleDeleteCategory(category) {
    if (confirm(`Delete category "${category}"? This will not delete the items in this category.`)) {
        categories = categories.filter(c => c !== category);
        localStorage.setItem('categories', JSON.stringify(categories));
        populateCategorySelect();
        displayCategories();
        showToast('Category deleted successfully!', 'success');
    }
}

function handleSaveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
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
    localStorage.setItem('categories', JSON.stringify(categories));
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
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
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
