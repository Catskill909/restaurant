# Restaurant CMS Template

A modern, responsive restaurant website with an integrated Content Management System (CMS) that allows for easy menu management and future customization capabilities.

## Important Implementation Notes

### Menu System Clarification
There are two distinct "menu" systems in this project:

1. **Navigation Menu** (`index.html`)
   - Located at the top of the page
   - Modern design with Oswald font
   - Smooth hover animations and active states
   - Responsive scroll-based background changes
   - Clean, minimalist styling with accent underlines
   - Contains links to page sections (Home, About, Menu, Reservation, Location)
   - Part of the core website structure

2. **Restaurant Menu** (managed via `admin.html`)
   - Displays food and drink items
   - Managed through the admin CMS
   - Organized by categories (Appetizers, Main Course, etc.)
   - Uses restaurant-menu-specific classes (`.restaurant-menu-section`, `.restaurant-menu-item`)
   - Data stored in localStorage

This distinction is important for development as these are separate systems with different purposes and styling needs.

## Recent Updates

### About Section Enhancement
- Implemented elegant two-column layout with text and image
- Added smooth scroll-triggered animations
- Created staggered reveal effects for features
- Enhanced typography with Oswald and Playfair Display fonts
- Optimized animation timing for better user experience

## Current Features

### Front-End
- Modern, animated navigation with:
  - Bold Oswald font typography
  - Smooth hover animations with progressive underlines
  - Active state indicators that highlight current section
  - Scroll-based background changes with blur effect
  - Smooth scroll behavior to sections
  - Performance-optimized scroll animations
  - Clean underline effects
  - Mobile-responsive design with:
    - Hamburger menu toggle
    - Dark overlay background
    - Smooth open/close animations
    - Close on link click, outside click, or escape key
- Hero section with:
  - Full-screen background image
  - Overlay with gradient effect
  - Animated headline and subheading
- Dynamic menu display organized by categories
- Interactive map integration
- Modern reservation form with floating labels
- Responsive design (mobile-ready with hamburger menu)
- About Section
  - Modern two-column grid layout
  - Scroll-triggered animations
  - Elegant feature titles with hover effects
  - Responsive design
  - Optimized image loading

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
