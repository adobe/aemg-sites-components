window.addEventListener("DOMContentLoaded", function () {
    let vehicleFilterBtn = document.querySelector(".vehicle_search_btn");
    let vehiclesType = document.querySelector(".vehicles_type .cmp-container");

    vehicleFilterBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        document.querySelector("body").classList.add("vehicles_modal");
    });

    document.querySelector("body").addEventListener("click", function (e) {
        if (!vehiclesType.contains(e.target) && e.target !== vehicleFilterBtn) {
            document.querySelector("body").classList.remove("vehicles_modal");
        }
    });

    vehiclesType.addEventListener('click', function (e) {
        e.stopPropagation();
    });
});
