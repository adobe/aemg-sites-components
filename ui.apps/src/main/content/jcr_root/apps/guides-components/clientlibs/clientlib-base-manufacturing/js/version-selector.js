$(document).ready(function () {
    attachDropdownEvents();

    $(document).on("click", function () {
        $(".toolbar:not(.hidden) .version-selector .dropdown__list").addClass("hidden");
    });

});

function attachDropdownEvents() {
    const activeToolbar = $(".toolbar:not(.hidden) .version-selector");
    if (!activeToolbar.length) return;

    $(document).on("click", ".dropdown__container", function (event) {
        event.stopPropagation();
        const dropdownList = $(this).closest(".version-selector").find(".dropdown__list");
        const dropdownIcon = $(this).closest(".version-selector").find(".dropdown__button svg path");
        dropdownList.toggleClass("hidden");
        updateDropdownIcon(dropdownList, dropdownIcon);
    });

    $(document).on("click", ".dropdown__item", function () {
        const selectedItem = $(this);
        const dropdownList = selectedItem.closest(".version-selector").find(".dropdown__list");
        const dropdownValue = selectedItem.closest(".version-selector").find(".dropdown__value");
        const dropdownIcon = selectedItem.closest(".version-selector").find(".dropdown__button svg path");

        dropdownValue.text(selectedItem.text());
        dropdownList.addClass("hidden");
        updateDropdownIcon(dropdownList, dropdownIcon);

        const link = selectedItem.find("a").attr("href");
        if (link) window.location.href = link;
    });
}

function updateDropdownIcon(dropdownList, dropdownIcon) {
    const isHidden = dropdownList.hasClass("hidden");
    const iconPath = isHidden
        ? "M14.7194 7.27931C14.5417 7.10041 14.3012 7 14.0506 7C13.8 7 13.5596 7.10041 13.3818 7.27931L9.97628 10.6796L6.61816 7.27931C6.44042 7.10041 6.19999 7 5.94938 7C5.69877 7 5.45834 7.10041 5.2806 7.27931C5.19169 7.36861 5.12112 7.47484 5.07296 7.59189C5.0248 7.70894 5 7.83448 5 7.96129C5 8.08809 5.0248 8.21363 5.07296 8.33068C5.12112 8.44773 5.19169 8.55396 5.2806 8.64326L9.30276 12.7159C9.39095 12.8059 9.49587 12.8774 9.61147 12.9261C9.72706 12.9749 9.85105 13 9.97628 13C10.1015 13 10.2255 12.9749 10.3411 12.9261C10.4567 12.8774 10.5616 12.8059 10.6498 12.7159L14.7194 8.64326C14.8083 8.55396 14.8789 8.44773 14.927 8.33068C14.9752 8.21363 15 8.08809 15 7.96129C15 7.83448 14.9752 7.70894 14.927 7.59189C14.8789 7.47484 14.8083 7.36861 14.7194 7.27931Z"
        : "M14.7194 12.7207C14.5416 12.8996 14.3012 13 14.0506 13C13.8 13 13.5595 12.8996 13.3818 12.7207L9.97625 9.32043L6.61813 12.7207C6.44039 12.8996 6.19996 13 5.94935 13C5.69874 13 5.45831 12.8996 5.28057 12.7207C5.19166 12.6314 5.12109 12.5252 5.07292 12.4081C5.02476 12.2911 4.99997 12.1655 4.99997 12.0387C4.99997 11.9119 5.02476 11.7864 5.07292 11.6693C5.12109 11.5523 5.19166 11.446 5.28057 11.3567L9.30273 7.28412C9.39092 7.19409 9.49584 7.12264 9.61143 7.07387C9.72703 7.02511 9.85102 7 9.97625 7C10.1015 7 10.2255 7.02511 10.3411 7.07387C10.4567 7.12264 10.5616 7.19409 10.6498 7.28412L14.7194 11.3567C14.8083 11.446 14.8789 11.5523 14.927 11.6693C14.9752 11.7864 15 11.9119 15 12.0387C15 12.1655 14.9752 12.2911 14.927 12.4081C14.8789 12.5252 14.8083 12.6314 14.7194 12.7207Z";
    isHidden ? dropdownIcon.attr("d", iconPath) : dropdownIcon.attr("d", iconPath)
}
