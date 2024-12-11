# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2024-12-10

### Added
- Implemented drag and drop functionality for category reordering
- Added visual drop markers between categories
- Real-time order updates with automatic saving
- Improved drag and drop feedback with visual indicators

### Fixed
- Resolved category reordering issues
- Fixed event delegation for drag and drop handlers
- Improved state management for dragged items
- Enhanced drop target detection

### Technical
- Implemented proper event delegation for better performance
- Added cleanup handlers for drag and drop operations
- Improved state management for drag operations
- Enhanced visual feedback system

## [1.0.0] - 2024-12-10

### Added
- Initial release of the restaurant website
- Dynamic menu management system
- Responsive design implementation
- Admin panel for menu management
- Category management with enhanced UX
- Real-time updates using localStorage
- Modern animations and transitions
- Image upload functionality with preview
- Toast notifications for user feedback

### Changed
- Improved menu layout with 4-column grid design
- Enhanced responsive breakpoints for different screen sizes
- Optimized typography and visual hierarchy
- Adjusted spacing and padding for better compactness

### Technical
- Built with HTML5, CSS3, and Vanilla JavaScript
- Implemented localStorage for data persistence
- Added responsive design breakpoints
- Set up version control with Git

## December 11, 2024

### Added
- Admin panel password protection
  - Simple one-word password system
  - Clean login overlay interface
  - Persistent authentication using localStorage
  - Default password: "cascade"
- Category order synchronization
  - Front-end now displays categories in the same order as admin panel
  - Removed alphabetical sorting of categories
  - Real-time updates when category order changes
