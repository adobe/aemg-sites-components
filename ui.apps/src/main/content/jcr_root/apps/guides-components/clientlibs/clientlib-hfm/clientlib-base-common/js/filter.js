document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.querySelector("input[name='cmp-navigation-filter']");
    const closeIcon = document.querySelector(".cmp-navigation-filter__closeicon");

    // Initially hide the close icon
    if(closeIcon && inputField) {
        closeIcon.style.display = "none";
        closeIcon.addEventListener("click", function () {
            inputField.value = "";
            closeIcon.style.display = "none";
        });
        inputField.addEventListener("input", function () {
            if (inputField.value.trim() !== "") {
                closeIcon.style.display = "inline-block"; // Show when input has value
            } else {
                closeIcon.style.display = "none"; // Hide when input is empty
            }
        });
    }

});
