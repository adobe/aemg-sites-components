window.onload = function () {

    // Function to set theme (always updates html/body; icon updates gated by presence)
    function setTheme(theme) {
        const btn = document.querySelector('.toolbar:not(.hidden) #gu_theme-icon');
        const lightIcon = btn && btn.querySelector('.gu-theme_icon.light');
        const darkIcon  = btn && btn.querySelector('.gu-theme_icon.dark');

        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
            document.body.classList.add('dark');
            document.body.classList.remove('light');
            if (lightIcon) lightIcon.style.display = 'none';
            if (darkIcon)  darkIcon.style.display  = 'block';
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
            document.body.classList.add('light');
            document.body.classList.remove('dark');
            if (darkIcon)  darkIcon.style.display  = 'none';
            if (lightIcon) lightIcon.style.display = 'block';
        }

        try { document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light'; } catch(e) {}
        localStorage.setItem('theme', theme);
    }

    // Load saved theme or default to light
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    // Delegate click event for dynamically added elements
    document.addEventListener("click", function (event) {
        if (event.target.closest("#gu_theme-icon")) {
            const isDarkMode = document.body.classList.contains("dark");
            setTheme(isDarkMode ? "light" : "dark");
        }
    });

};
