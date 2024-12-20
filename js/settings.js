// Site Settings Management
const Settings = {
    save: function(settings) {
        localStorage.setItem('restaurantSettings', JSON.stringify(settings));
        this.updateUI(settings);
    },

    load: function() {
        const settings = localStorage.getItem('restaurantSettings');
        return settings ? JSON.parse(settings) : null;
    },

    updateUI: function(settings) {
        // Update frontend elements
        const restaurantName = document.querySelector('.nav-brand');
        if (restaurantName) {
            restaurantName.textContent = settings.restaurantName || 'Restaurant Name';
        }

        // Update page title
        document.title = settings.restaurantName || 'Restaurant Name';

        // Update hero section
        const heroTitle = document.querySelector('.hero-content h1');
        if (heroTitle) {
            heroTitle.textContent = `Welcome to ${settings.restaurantName || 'Our Restaurant'}`;
        }

        // Update tagline
        const tagline = document.querySelector('.hero-content p');
        if (tagline) {
            tagline.textContent = settings.tagline || 'Experience culinary excellence';
        }

        // Dispatch event for other components that might need to update
        window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: settings }));
    }
};

// Initialize settings on page load
document.addEventListener('DOMContentLoaded', () => {
    const settings = Settings.load();
    if (settings) {
        Settings.updateUI(settings);
    }
});
