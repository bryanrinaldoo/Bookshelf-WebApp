document.addEventListener("DOMContentLoaded", function () {

    const submitForm = document.getElementById("editBook");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addToBookshelfEdit();
        deletelastEditBook();

    });

    if (isStorageExist()) {
        loadDataFromStorage();
        loadDataFromStorageEdit();
    }
});

document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan.");
});
document.addEventListener("ondataloaded", () => {
    console.log("data nge load");
    refreshDataFromEdits();
});