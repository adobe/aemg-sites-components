$(document).ready(function () {
    let tocLinks = document.querySelectorAll(".tableofcontents ul li a");
    let sections = [];
    let isScrollingByClick = false;
    let scrollTimeout;

    // Function to get the total height of fixed elements (header + breadcrumb)
    function getFixedElementsHeight() {
        let header = document.querySelector(".header");
        let breadcrumb = document.querySelector(".breadcrumb"); // Update selector if needed
        let headerHeight = header ? header.getBoundingClientRect().height : 0;
        let breadcrumbHeight = breadcrumb ? breadcrumb.getBoundingClientRect().height : 0;
        return headerHeight + breadcrumbHeight;
    }

    // Store section elements
    tocLinks.forEach((link) => {
        let target = document.querySelector(link.getAttribute("href"));
        if (target) {
            sections.push(target);
        }

        // Click event
        link.addEventListener("click", function (event) {
            event.preventDefault();
            isScrollingByClick = true;

            // Remove active class from all <li> elements
            document.querySelectorAll(".tableofcontents ul li").forEach(li => li.classList.remove("active"));
            this.parentElement.classList.add("active");

            // Smooth scroll to section
            let targetSection = document.querySelector(this.getAttribute("href"));
            if (targetSection) {
                let fixedElementsHeight = getFixedElementsHeight(); // Get updated height
                let targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - fixedElementsHeight - 10;
                window.scrollTo({ top: targetPosition, behavior: "smooth" });
            }

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrollingByClick = false;
            }, 1000);
        });
    });

    // Intersection Observer for active section highlighting
    let observer = new IntersectionObserver(
        (entries) => {
            if (isScrollingByClick) return;
            let fixedElementsHeight = getFixedElementsHeight(); // Update height dynamically
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    let activeLink = document.querySelector(`.tableofcontents ul li a[href="#${entry.target.id}"]`);
                    if (activeLink) {
                        document.querySelectorAll(".tableofcontents ul li").forEach(li => li.classList.remove("active"));
                        activeLink.parentElement.classList.add("active");
                    }
                }
            });
        },
        { rootMargin: `-${getFixedElementsHeight() + 10}px 0px -80% 0px`, threshold: 0.1 }
    );

    sections.forEach(section => observer.observe(section));

    // Update observer on window resize (in case header or breadcrumb height changes)
    window.addEventListener("resize", () => {
        observer.disconnect(); // Remove old observers
        sections.forEach(section => observer.observe(section)); // Reapply with updated height
    });
});
