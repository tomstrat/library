let myLibrary = [];

function Book(title, author, pages, isRead){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;

    this.info = function(){
        let isReadString = isRead ? "read" : "not read yet";
        return `${this.title} by ${this.author}, ${this.pages} pages, ${isReadString}`
    }
}

function addBookToLibrary(){

}

function render(){
    let bookshelf = document.getElementById("bookshelf");
    //Remove the contents of the bookcase
    while(bookshelf.firstChild){
        bookshelf.removeChild(bookshelf.firstChild);
    }
    //Render the bookcase
    myLibrary.forEach(function(book){
        //create book DOM elements
        let domBook = document.createElement('div');
        let domTitle = document.createElement('p');
        let domAuthor = document.createElement('p');
        let domRead = document.createElement('span');
        let domPages = document.createElement('span');
        //Add Classes
        domBook.classList += " book";
        domTitle.classList += " title";
        domAuthor.classList += "author";
        domPages.classList += "pages";
        domRead.classList += book.isRead ? " read" : " notRead";                   
        //Add innerHTML
        domTitle.innerHTML = book.title;
        domAuthor.innerHTML = book.author;
        domPages.innerHTML = book.pages;
        domRead.innerHTML = book.isRead ? "&#10003;" : "X";
        //append children
        domBook.appendChild(domTitle);
        domBook.appendChild(domAuthor);
        domBook.appendChild(domRead);
        domBook.appendChild(domPages);
        bookshelf.appendChild(domBook);
    })
}
let testBook = new Book("Shutter Island", "Dennis Lehane", 562, true);
myLibrary.push(testBook);
myLibrary.push(testBook);
myLibrary.push(testBook);
render();