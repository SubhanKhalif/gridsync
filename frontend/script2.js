document.addEventListener('DOMContentLoaded', function() {
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    });

    // Disable the Ctrl key
    document.addEventListener('keydown', function(event) {
        // Check if the Ctrl key is pressed
        if (event.ctrlKey) {
            event.preventDefault();
            event.stopImmediatePropagation(); // Prevent it from propagating further
        }

        // Prevent F12 (Developer Tools)
        if (event.key === 'F12') {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    });
});
