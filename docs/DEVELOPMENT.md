# Development Guide

## Architecture Overview

### Data Storage
- Uses localStorage for all data
- Key-value structure for menu items and categories
- Session management for admin authentication

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
