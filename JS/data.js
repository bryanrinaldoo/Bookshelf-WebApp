const BOOK_STORAGE_KEY = "BOOKSHELF_APPS";
const EDIT_STORAGE_KEY = "EDIT_BOOKSHELF_APPS";

let books = [];
let booksEdit = [];

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Your browser doesn't support local storage");
        return false
    }
    return true;
}

function saveData(arr, key) {
    const parsed = JSON.stringify(arr);
    localStorage.setItem(key, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(BOOK_STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null)
        books = data;

    document.dispatchEvent(new Event("ondataloaded"));
}

function loadDataFromStorageEdit() {
    const serializedData = localStorage.getItem(EDIT_STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null)
        booksEdit = data;

    document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
    if (isStorageExist())
        saveData(books, BOOK_STORAGE_KEY);
}

function updateDataToStorageEdit() {
    if (isStorageExist())
        saveData(booksEdit, EDIT_STORAGE_KEY);
}

function composeBookObject(title, author, year, isCompleted) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isCompleted
    };
}

function findBook(bookId) {
    for (book of books) {
        if (book.id === bookId)
            return book;
    }
    return null;
}


function findBookIndex(bookId) {
    let index = 0
    for (book of books) {
        if (book.id === bookId)
            return index;

        index++;
    }

    return -1;
}

function refreshDataFromBooks() {
    const listUncompleted = document.getElementById(UNCOMPLETED_BOOK_ID);
    let listCompleted = document.getElementById(COMPLETED_BOOK_ID);


    for (book of books) {
        const bookTemp = putToBookshelf(book.title, book.author, book.year, book.isCompleted);
        bookTemp[BOOKSID] = book.id;


        if (book.isCompleted) {
            listCompleted.append(bookTemp);
        } else {
            listUncompleted.append(bookTemp);
        }
    }
}

function getLastEdit() {
    const edits = JSON.parse(localStorage.getItem(EDIT_STORAGE_KEY));
    const lastEdit = edits.length;
    const bookediting = edits[lastEdit - 1];
    return bookediting;
}
function refreshDataFromEdits() {
    
    const bookediting = getLastEdit();
    document.getElementById("inputjudulEdit").value = bookediting.title;
    document.getElementById("inputpenulisEdit").value = bookediting.author;
    document.getElementById("inputTahunEdit").value = bookediting.year;
    if (bookediting.isCompleted){
        document.querySelector('#inputBookIsCompleteEdit').checked = true;
    }
}