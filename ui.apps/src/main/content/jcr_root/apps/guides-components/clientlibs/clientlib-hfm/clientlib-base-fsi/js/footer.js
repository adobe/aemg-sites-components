function adjustMainHeight() {
    const header = document.querySelector(".header");
    const footer = document.querySelector(".footer");
    const main = document.querySelector(".gu-custom-container");

    const headerHeight = header ? header.offsetHeight : 0;
    const footerHeight = footer ? footer.offsetHeight : 0;
    const viewportHeight = window.innerHeight;

    const mainHeight = viewportHeight - headerHeight - footerHeight;
    main.style.minHeight = `${mainHeight}px`;
}

// Run on page load and when resizing
window.addEventListener("load", adjustMainHeight);
window.addEventListener("resize", adjustMainHeight);
