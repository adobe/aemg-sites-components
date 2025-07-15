window.onload = function () {
  // Function to set theme
  function setTheme(theme) {
    const $themIcon = document.querySelector(
      ".toolbar:not(.hidden) #gu_theme-icon"
    );

    if (!$themIcon) return; // Ensure element exists

    const $lightIcon = $themIcon.querySelector(".gu-theme_icon.light");
    const $darkIcon = $themIcon.querySelector(".gu-theme_icon.dark");

    // Select the dark theme icon and update its src
    $darkIcon.src =
      "/content/dam/guides/common-images/icons/manufacturing-dark-theme.svg";

    // Select the light theme icon and update its src
    $lightIcon.src =
      "/content/dam/guides/common-images/icons/manufacturing-light-theme.svg";

    if (theme === "dark") {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
      if ($lightIcon) $lightIcon.style.display = "none";
      if ($darkIcon) $darkIcon.style.display = "block";
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
      if ($darkIcon) $darkIcon.style.display = "none";
      if ($lightIcon) $lightIcon.style.display = "block";
    }

    localStorage.setItem("theme", theme);
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
