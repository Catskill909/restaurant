# Restaurant Website

A modern, responsive restaurant website with menu management capabilities.

## Features

### Customer View
- Clean, modern interface
- Responsive design for all devices
- Dynamic menu display with categories
- Smooth animations and transitions
- Real-time menu updates

### Admin Panel
- Menu item management (Add/Edit/Delete)
- Category management with drag and drop reordering
  - Visual drop markers and indicators
  - Smooth animations and transitions
  - Automatic order saving
  - Real-time updates
- Image upload with preview
- User-friendly interface
- Toast notifications

## Technical Details

### Built With
- HTML5
  - Drag and Drop API
- CSS3
  - Modern animations
  - Smooth transitions
- Vanilla JavaScript
  - Event delegation
  - Clean state management
- localStorage for data persistence

### Key Components
1. **Menu Management**
   - Dynamic category system
   - CRUD operations for menu items
   - Real-time updates

2. **User Interface**
   - Responsive design
   - Modern animations
   - Intuitive navigation

3. **Admin Features**
   - Secure admin panel
   - Image handling
   - Form validation
   - Visual feedback system

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/restaurant.git
   ```

2. Open index.html in your browser to view the customer interface
3. Navigate to admin.html for the management interface

## Usage

### Customer Interface
- Browse menu items by category
- View item details and prices
- Responsive layout adapts to your device

### Admin Interface
1. Access admin panel through admin.html
2. Add/Edit menu items:
   - Fill in item details
   - Upload images
   - Select category
3. Manage categories:
   - Add new categories
   - View success confirmations
   - See real-time updates

## Admin Access

The admin panel is protected with a simple password system. To access the admin area:

1. Navigate to `admin.html`
2. Enter the password: `cascade`
3. Click Login or press Enter

The authentication status persists across page refreshes until you clear your browser data.

To change the admin password:
1. Open `admin.js`
2. Locate the `ADMIN_PASSWORD` constant at the top of the file
3. Change the value to your desired password

## Category Management

Categories can be reordered in the admin panel using drag and drop. The order is automatically synchronized with the front-end display. Changes made in the admin panel are immediately reflected on the main page.

## Development

### Current Status
- Core features implemented
- Enhanced UX for category management
- Responsive design complete

### Roadmap
1. Authentication system
2. Database integration
3. Order management
4. Online reservations

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License
This project is licensed under the MIT License.
