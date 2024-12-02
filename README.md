# Restaurant CMS Template

A modern, responsive restaurant website with an integrated Content Management System (CMS) that allows for easy menu management and future customization capabilities.

## Current Features

### Front-End
- Modern, animated landing page with sections for:
  - Hero banner with parallax scrolling effect and welcome message
  - About section
  - Menu display
  - Reservation form
  - Location map
- Responsive design that works on all devices
- Dynamic menu display organized by categories
- GSAP animations for enhanced user experience
- Interactive map integration
- Modern reservation form with floating labels

### Admin CMS
- Full menu management system:
  - Add new menu items with name, description, price, and image
  - Edit existing menu items
  - Delete menu items
  - Items organized by categories
- Real-time preview of changes
- Image URL support for menu items
- Local storage persistence for menu data
- User-friendly interface with form validation

## Technical Implementation
- Pure HTML, CSS, and JavaScript
- CSS features:
  - Flexbox for layouts
  - CSS parallax scrolling effect
  - Responsive design
- No framework dependencies
- Local storage for data persistence
- GSAP for animations
- Leaflet.js for map functionality
- Font Awesome for icons
- Google Fonts integration

## Current Structure
- `index.html` - Main customer-facing website
- `admin.html` - Admin CMS interface
- `styles.css` - Shared styles
- `admin.js` - CMS functionality
- `script.js` - Front-end functionality

## Future Goals

### Short-term Improvements
- Enhanced menu item styling in the front-end display
- Better image handling and optimization
- Improved form feedback and validation
- More interactive elements in the front-end

### Long-term Goals
Make most front-end elements customizable through the CMS, including:
- Restaurant name and branding
- Color schemes and styling
- Header content and navigation
- Section content (About, Contact, Hours)
- Social media links
- Map location
- Reservation settings

### Core Elements to Remain Fixed
- Basic page structure and sections
- Menu management functionality
- Front-end and CMS core features
- Data persistence system
- Overall layout and responsive design

## Getting Started

1. Clone this repository
2. Open `index.html` in your browser to view the customer-facing website
3. Open `admin.html` to access the admin CMS
4. Use the CMS to manage your menu items
5. Changes will persist in local storage

## Browser Compatibility
- Tested on modern browsers (Chrome, Firefox, Safari)
- Requires JavaScript enabled
- Local storage support required

## Notes
- Currently using local storage for data persistence
- Images are referenced via URLs
- No server-side implementation required
- Designed for single-restaurant use
