const UNCOMPLETED_BOOK_ID = "uncompleted-books";
const COMPLETED_BOOK_ID = "completed-books";
const BOOKSID = "itemId";

function addToBookshelf() {
    const uncompletedBooks = document.getElementById(UNCOMPLETED_BOOK_ID);
    const completedBooks = document.getElementById(COMPLETED_BOOK_ID);

    const judul = document.getElementById("inputjudul").value;
    const penulis = document.getElementById("inputpenulis").value;
    const tahun = document.getElementById("inputTahun").value;
    const tahunInt = parseInt(tahun);
    var d = new Date();
    var n = d.getFullYear();
    if (tahunInt > 0 && tahunInt <= n) {
        document.getElementById("inputjudul").value = "";
        document.getElementById("inputpenulis").value = "";
        document.getElementById("inputTahun").value = "";
        if (judul !== null && penulis !== null && tahun !== null) {
            if (document.querySelector('#inputBookIsComplete:checked') !== null) {
                const book = putToBookshelf(judul, penulis, tahun, true);
                const bookObject = composeBookObject(judul, penulis, tahun, true);
                book[BOOKSID] = bookObject.id;
                books.push(bookObject);
                completedBooks.append(book);
                updateDataToStorage();
            } else {
                const book = putToBookshelf(judul, penulis, tahun, false);
                const bookObject = composeBookObject(judul, penulis, tahun, false);
                book[BOOKSID] = bookObject.id;
                books.push(bookObject);
                uncompletedBooks.append(book);
                updateDataToStorage();
            }
        }
        Swal.fire("Book Added To Bookshelf!", "you can find your newly added book down below.", "success");
    } else {
        Swal.fire("Invalid Year", "Please insert a valid year", "error");
    }
}

// buat add to edit

function addDataToEdit(bookElement) {

    // to get the edit id 
    const edits = JSON.parse(localStorage.getItem(EDIT_STORAGE_KEY));

    // add to storage edit 
    const booktemp = findBook(bookElement[BOOKSID]);
    booksEdit.push(booktemp);
    updateDataToStorageEdit();

}

function putToBookshelf(judul, penulis, tahun, isCompleted) {

    const title = document.createElement("a");
    title.href = "edit.html";
    title.innerText = judul;

    title.addEventListener("click", function (event) {
        const bottom1 = event.target.parentElement;
        const bottom2 = bottom1.parentElement;
        addDataToEdit(bottom2)
    });

    const author = document.createElement("p");
    author.classList.add("penulis");
    author.innerText = penulis;

    const year = document.createElement("p");
    year.classList.add("tahun");
    year.innerText = tahun;


    const bottomsSatu = document.createElement("div");
    bottomsSatu.classList.add("bottoms-satu");
    const bottomsDua = document.createElement("div");
    bottomsDua.classList.add("bottoms-dua");

    const bottoms = document.createElement("div");
    bottoms.classList.add("bottoms");
    bottoms.append(bottomsSatu, bottomsDua);

    const box = document.createElement("div");
    box.classList.add("box");
    box.append(title, author, year, bottoms);

    const container = document.createElement("div");
    container.classList.add("box-container")
    container.append(box);
    if (isCompleted) {
        bottomsSatu.append(createUndoButton());
        bottomsDua.append(createTrashButton());
    } else {
        bottomsSatu.append(createCheckButton());
        bottomsDua.append(createTrashButton());
    }
    return container;
}

function createButton(buttonTypeName, eventListener) {
    const span = document.createElement("span");
    span.innerText = buttonTypeName;
    const liquid = document.createElement("div");
    liquid.classList.add("liquid");

    const button = document.createElement("button");
    button.append(span, liquid);
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}

function addToCompleted(bookElement) {
    const title = bookElement.querySelector(".box > a").innerText;
    const author = bookElement.querySelector(".box > p.penulis ").innerText;
    const year = bookElement.querySelector(".box > p.tahun").innerText;


    const donebook = putToBookshelf(title, author, year, true);
    const book = findBook(bookElement[BOOKSID]);
    book.isCompleted = true;
    donebook[BOOKSID] = book.id;

    const listCompleted = document.getElementById(COMPLETED_BOOK_ID);
    listCompleted.append(donebook);
    bookElement.remove();

    updateDataToStorage();
}

function createCheckButton() {
    return createButton("Add to Done", function (event) {
        const bottom1 = event.target.parentElement;
        const bottom2 = bottom1.parentElement;
        const bottom3 = bottom2.parentElement;
        const bottom4 = bottom3.parentElement;
        const bottom5 = bottom4.parentElement;

        addToCompleted(bottom5);
    });
}

function removeBookFromCompleted(bookElement) {
    const bookPosition = findBookIndex(bookElement[BOOKSID]);
    books.splice(bookPosition, 1);
    bookElement.remove();
    updateDataToStorage();
}

function createTrashButton() {
    return createButton("Remove", function (event) {
        const bottom1 = event.target.parentElement;
        const bottom2 = bottom1.parentElement;
        const bottom3 = bottom2.parentElement;
        const bottom4 = bottom3.parentElement;
        const bottom5 = bottom4.parentElement;

        removeBookFromCompleted(bottom5);
    });
}

function undoBookFromCompleted(bookElement) {
    const listUncompleted = document.getElementById(UNCOMPLETED_BOOK_ID);
    const title = bookElement.querySelector(".box > a").innerText;
    const author = bookElement.querySelector(".box > .penulis ").innerText;
    const year = bookElement.querySelector(".box > .tahun").innerText;

    const undobook = putToBookshelf(title, author, year, false);
    const book = findBook(bookElement[BOOKSID]);
    book.isCompleted = false;
    undobook[BOOKSID] = book.id;

    listUncompleted.append(undobook);
    bookElement.remove();

    updateDataToStorage();
}

function createUndoButton() {
    return createButton("Add to Reading", function (event) {
        const bottom1 = event.target.parentElement;
        const bottom2 = bottom1.parentElement;
        const bottom3 = bottom2.parentElement;
        const bottom4 = bottom3.parentElement;
        const bottom5 = bottom4.parentElement;

        undoBookFromCompleted(bottom5);
    });
}

function submitEdit(params) {

    title.addEventListener("click", function (event) {
        const bottom1 = event.target.parentElement;
        const bottom2 = bottom1.parentElement;
        removeBookFromCompleted(bottom2);
    });
}

function deletelastEditBook() {
    const bookediting = getLastEdit();

    const bookPosition = findBookIndex(bookediting.id);
    if (bookPosition != -1) {
        books.splice(bookPosition, 1);
        updateDataToStorage();
    } else {
        console.log("posisi -1");
    }
}

function addToBookshelfEdit() {

    const judul = document.getElementById("inputjudulEdit").value;
    const penulis = document.getElementById("inputpenulisEdit").value;
    const tahun = document.getElementById("inputTahunEdit").value;
    const tahunInt = parseInt(tahun);
    var d = new Date();
    var n = d.getFullYear();
    if (tahunInt > 0 && tahunInt <= n) {
        if (judul !== null && penulis !== null && tahun !== null) {
            if (document.querySelector('#inputBookIsCompleteEdit:checked') !== null) {
                const bookObject = composeBookObject(judul, penulis, tahun, true)
                books.push(bookObject);
                updateDataToStorage();
            } else {
                const bookObject = composeBookObject(judul, penulis, tahun, false)
                books.push(bookObject);
                updateDataToStorage();
            }
        }
        Swal.fire({
            title: "Edit success!",
            text: "Edited book already added to your bookshelf.",
            icon: "success"
        }).then(function () {
            window.location = "redirectURL";
            location = "index.html";
        });
    }
    else{
        Swal.fire("Invalid Year", "Please insert a valid year", "error");
    }
}