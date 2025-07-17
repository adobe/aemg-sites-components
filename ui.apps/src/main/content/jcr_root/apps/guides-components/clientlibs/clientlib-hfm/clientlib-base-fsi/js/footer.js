function adjustMainHeight() {
    const main = document.querySelector(".gu-custom-container");

    if (main && main.classList.contains("EDITMODE")) {
        return;
    }

    const header = document.querySelector(".header");
    const footer = document.querySelector(".footer");
    const style = window.getComputedStyle(main);
    const marginTop = parseFloat(style.marginTop) || 0;

    const headerHeight = header ? header.offsetHeight : 0;
    const footerHeight = footer ? footer.offsetHeight : 0;
    const viewportHeight = window.innerHeight;

    const mainHeight = viewportHeight - headerHeight - footerHeight - marginTop;
    main.style.minHeight = `${mainHeight}px`;
}

// Run on page load and when resizing
window.addEventListener("load", adjustMainHeight);
window.addEventListener("resize", adjustMainHeight);
