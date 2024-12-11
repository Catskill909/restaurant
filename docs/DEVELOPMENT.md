# Development Guide

## Architecture Overview

### Data Storage
- Uses localStorage for all data
- Key-value structure for menu items and categories
- Session management for admin authentication
- Extended to include site settings

### Security Implementation
- SHA-256 password hashing
- 30-minute session timeout
- Rate limiting (5 attempts, 30s lockout)
- Client-side authentication

### Component Structure
1. **Public Interface** (`index.html`, `script.js`)
   - Menu display
   - Category organization
   - Dynamic content loading

2. **Admin Interface** (`admin.html`, `admin.js`)
   - Content management
   - Image handling
   - Authentication
   - Form validation
   - Site settings management

## Development Log

### Security Update (2024-12-11)
✅ Implemented:
- Password hashing
- Session management
- Rate limiting
- Improved error handling

### Menu System (2024-12-10)
✅ Completed:
- Category drag-and-drop
- Real-time updates
- Image preview
- Toast notifications

## Upcoming Features

### CMS Enhancements
1. Header customization
2. Social media links
3. Business hours editor
4. Contact information management

### Technical Improvements
1. Form validation
2. Image optimization
3. Performance monitoring
4. Error logging

## Current System Audit (2024-12-11)

### Storage System
- ✅ localStorage implementation
  - Menu items
  - Categories
  - Admin authentication
  - Session tokens
- ✅ Data persistence
- ✅ State management

### UI Components
- ✅ Admin Panel
  - Form system
  - Image handling
  - Toast notifications
  - Modal system
- ✅ Drag and Drop
  - Category reordering
  - Visual indicators
  - Auto-save

### Functions
- ✅ Authentication
  - Password hashing (SHA-256)
  - Session management
  - Rate limiting
- ✅ Data Management
  - CRUD operations
  - Validation
  - Error handling
- ✅ UI Updates
  - Real-time sync
  - Preview system
  - Responsive design

## CMS Enhancement Needs

### Can Use Existing
1. Form System
   - Reuse for site settings
   - Already handles validation
   - Has preview capability

2. Storage Pattern
   - Extend current localStorage
   - Use same CRUD pattern
   - Keep data structure consistent

3. UI Components
   - Modal system for editing
   - Toast notifications
   - Image upload system

### Need to Add
1. New Data Fields
   - Restaurant info
   - Contact details
   - Business hours
   - Social links

2. UI Extensions
   - Settings section in admin
   - Hours editor
   - Contact form

3. Sync Updates
   - Real-time preview
   - Front-page updates

## Implementation Plan

### Phase 1: Extend Current System
1. Add new fields to existing forms
2. Reuse modal system for editing
3. Extend current localStorage pattern

### Phase 2: UI Updates
1. Add settings tab to admin
2. Reuse form components
3. Add preview functionality

### Phase 3: Testing
1. Validate all fields
2. Test data persistence
3. Verify UI updates

## CMS Enhancement Plan

### Phase 1: Extend Existing System
- [ ] Add siteSettings to existing localStorage
- [ ] Create settings management functions
- [ ] Design unified settings interface
- [ ] Implement settings sync mechanism

### Current localStorage Structure
```javascript
// Existing Storage
{
    'menuItems': [...],
    'categories': [...],
    'adminAuthenticated': 'true'
}

// New siteSettings to Add
{
    'siteSettings': {
        'version': '1.0',
        'lastUpdated': '2024-12-11T16:06:16.000Z',
        'brand': {
            'name': 'Restaurant Name',
            'tagline': 'Experience culinary excellence'
        },
        'contact': {
            'phone': '(555) 123-4567',
            'email': 'info@restaurant.com',
            'address': '123 Main St'
        },
        'hours': {
            'regular': {
                'monday': '11:30 AM - 10:00 PM',
                // ... other days
            },
            'special': []
        }
    }
}
```

### Implementation Steps

#### Step 1: Extend Current System
1. Add siteSettings management to admin.js:
   ```javascript
   // Load settings
   function loadSiteSettings() {
       return JSON.parse(localStorage.getItem('siteSettings')) || defaultSettings;
   }
   
   // Save settings
   function saveSiteSettings(settings) {
       settings.lastUpdated = new Date().toISOString();
       localStorage.setItem('siteSettings', JSON.stringify(settings));
       updateUI();
   }
   ```

2. Use existing admin interface patterns:
   - Similar to menu item editor
   - Consistent UI/UX
   - Reuse validation patterns

3. Add settings UI to admin panel:
   - Settings grid layout
   - Edit forms
   - Live preview

### Phase 2: Basic Information (Current Focus)
- [ ] Restaurant Name
- [ ] Contact Information
  - Phone
  - Email
  - Address
- [ ] Business Hours
  - Regular hours
  - Special dates

### Phase 3: Content Management
- [ ] About Section
  - Story text
  - Features list
  - Images
- [ ] Hero Section
  - Welcome message
  - Background image
- [ ] Footer content

### Phase 4: Advanced Features
- [ ] Social Media Integration
- [ ] Reservation System
- [ ] Map Location
- [ ] Custom Styling

### Data Structure

```javascript
// localStorage Schema
{
  "menuItems": [...],
  "categories": [...],
  "adminAuthenticated": "true",
  "siteSettings": {
    "version": "1.0",
    "lastUpdated": "2024-12-11T16:06:16.000Z",
    "brand": {
      "name": "Restaurant Name",
      "tagline": "Experience culinary excellence"
    },
    "contact": {
      "phone": "(555) 123-4567",
      "email": "info@restaurant.com",
      "address": "123 Main St"
    },
    "hours": {
      "regular": {
        "monday": "11:30 AM - 10:00 PM",
        // ... other days
      },
      "special": []
    }
  }
}
```

### Progress Tracking

#### Completed
- [x] Initial admin authentication
- [x] Menu management system
- [x] Basic site structure

#### In Progress
- [ ] Settings infrastructure (Step 1)
- [ ] Basic information editors

#### Up Next
- Content management tools
- Social media integration
- Advanced features

### Testing Plan
1. Unit tests for settings management
2. UI testing for admin interface
3. Data validation checks
4. Cross-browser compatibility

## Known Issues (To Fix Later)

#### Category Management (2024-12-11)
1. New categories not appearing immediately after addition
2. New menu items not being added properly
3. Possible state management issue between localStorage and UI updates

Root Cause (Initial Analysis):
- Likely disconnect between state updates and UI refresh
- Possible race condition in localStorage operations
- Event handler chain may be broken

To Fix Later:
```javascript
// TODO: Implement proper state management
1. Add state validation
2. Force UI refresh after state changes
3. Add error boundaries around category operations
4. Implement proper event propagation
```

Priority: Medium
Impact: New content additions
Workaround: Refresh page after adding new categories/items

## Best Practices

### 1. Code Organization
- Keep functions small and focused
- Use clear, descriptive names
- Comment complex logic
- Maintain consistent formatting

### 2. Data Management
- Validate all inputs
- Handle errors gracefully
- Use consistent data structures
- Regular localStorage cleanup

### 3. User Experience
- Provide feedback for actions
- Maintain responsive design
- Keep interfaces intuitive
- Test across browsers

## Troubleshooting Guide

### Common Issues
1. **Login Problems**
   - Check password hash
   - Verify session storage
   - Clear browser cache

2. **Menu Updates**
   - Validate localStorage
   - Check event listeners
   - Verify data structure

3. **Image Handling**
   - Check file size limits
   - Verify format support
   - Test preview function

### Failed Approaches - Learning Log

#### CMS Implementation Attempt 2 - Failed (2024-12-11)
Problem: Multiple DOMContentLoaded event listeners causing race conditions and initialization failures

What We Tried:
```javascript
// Failed approach - Don't repeat
1. Consolidated all DOMContentLoaded listeners into one
2. Added error handling and logging
3. Tried to initialize modal handlers separately
```

Why It Failed:
1. Race condition between auth check and UI initialization
2. Modal elements not found because they're initialized after auth check
3. Multiple DOMContentLoaded listeners still executing in unknown order
4. Lost event listeners during DOM manipulation

Root Cause Analysis:
1. Authentication and UI initialization are tightly coupled
2. DOM elements are queried before they're ready
3. Event delegation not properly implemented
4. Modal state management is inconsistent

Better Approach Needed:
1. Use event delegation for dynamic elements
2. Implement proper state management for modals
3. Separate auth flow from UI initialization
4. Use a single source of truth for DOM ready state

Example of Correct Pattern:
```javascript
// Single event listener with proper delegation
document.addEventListener('DOMContentLoaded', () => {
    // Auth check first
    if (!validateSession()) {
        showLoginOverlay();
        return;
    }
    
    // Event delegation for dynamic elements
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('#add-category-btn')) {
            showModal('category-modal');
        }
    });
});

// State management
const modalState = {
    currentModal: null,
    show(modalId) {
        this.currentModal = document.getElementById(modalId);
        if (this.currentModal) {
            this.currentModal.classList.add('active');
        }
    }
};
```

#### CMS Implementation Attempt 3 - Failed (2024-12-11)
Problem: Lost all CMS content when trying to improve modal and authentication

What We Tried:
```javascript
// Failed approach - Don't repeat
1. Moved state management around
2. Changed initialization order
3. Rewrote event handlers
4. Modified existing working code instead of extending it
```

Why It Failed:
1. Broke existing working code by moving it around
2. Lost critical event handlers for CMS functionality
3. Disrupted the working order of operations
4. Modified core functionality instead of extending it

Root Cause Analysis:
1. Violated the "If it works, don't fix it" principle
2. Made too many changes at once
3. Didn't properly test existing functionality
4. Failed to follow incremental development

Correct Approach:
1. Never modify working code - only extend it
2. Add new features alongside existing ones
3. Test each small change before moving forward
4. Keep initialization order intact

Example of Correct Pattern:
```javascript
// Extend existing functionality - don't replace it
const existingInit = window.initFunction;
window.initFunction = function() {
    // Call existing init first
    existingInit();
    
    // Then add new features
    addNewFeature();
};
```

Key Lessons:
1. Always preserve working code
2. Make incremental changes
3. Test after each small change
4. Add features by extending, not replacing

Next Steps:
1. Implement event delegation pattern
2. Create modal state manager
3. Separate auth and UI initialization
4. Add proper error boundaries
