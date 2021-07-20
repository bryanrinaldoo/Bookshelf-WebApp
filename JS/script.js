document.addEventListener("DOMContentLoaded", function () {

    const submitForm = document.getElementById("inputBook");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addToBookshelf();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }

    // navbar close 
    var links = document.querySelectorAll(".navbar-collapse li a:not([href='#'])");
    for (var x = 0; x < links.length; x++) {
        links[x].onclick = function () {
            document.querySelector(".checkbtn").click();
        }
    }

    $('.collapse').collapse()
});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan.");
});
document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
});
