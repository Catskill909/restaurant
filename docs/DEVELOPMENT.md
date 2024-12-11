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
