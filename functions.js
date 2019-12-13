
let firestore = firebase.firestore();
let colRef = firestore.collection("library").where("id", "==", true);
let myLibrary = [];
let dataIterator = 0;

function initialise(){

    //retreive documents from firebase
    firestore.collection("library").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc){
            let docData = doc.data();
            if(docData.title != undefined){
                let newBook = new Book(docData.title, docData.author, docData.pages, docData.isRead, docData.id);
                myLibrary.push(newBook);
                dataIterator = doc.id + 1;
            }
        });
        nowRender();
    });
    function nowRender(){
        console.log(myLibrary);
        render();
    }
}

function Book(title, author, pages, isRead, id){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
    this.id = id;

    this.info = function(){
        let isReadString = isRead ? "read" : "not read yet";
        return `${this.title} by ${this.author}, ${this.pages} pages, ${isReadString}`
    }

    this.readBook = function(){
        this.isRead = this.isRead ? false : true;
    }
}

function showAddBookForm(){
    let formHolder = document.getElementById("formHolder");
    let addBookButton = document.getElementById("addNewBook");
    addBookButton.classList = " hide";
    formHolder.classList = " show";
}

function hideAddBookForm(){
    let formHolder = document.getElementById("formHolder");
    let addBookButton = document.getElementById("addNewBook");
    addBookButton.classList = " show";
    formHolder.classList = " hide";
}

function addBookToLibrary(){
    let inputTitle = document.getElementById("inputTitle").value;
    let inputAuthor = document.getElementById("inputAuthor").value;
    let inputPages = document.getElementById("inputPages").value;
    let inputRead = document.getElementById("inputRead");
    let isInputRead = inputRead.checked ? true : false;

    let newBook = new Book(inputTitle, inputAuthor, inputPages, isInputRead, dataIterator);
    myLibrary.push(newBook);
    dataIterator++;
    render();
}

function render(){
    let bookshelf = document.getElementById("bookshelf");
    //Remove the contents of the bookcase
    while(bookshelf.firstChild){
        bookshelf.removeChild(bookshelf.firstChild);
    }
    //remove documents from firebase
    colRef.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc){
            doc.ref.delete().then(function() {
                console.log("Document successfully deleted!");
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
        });
    });
    //Render the bookcase
    myLibrary.forEach(function(book){
        //create book DOM elements
        let domBook = document.createElement('div');
        let domTitle = document.createElement('p');
        let domAuthor = document.createElement('p');
        let domRead = document.createElement('button');
        let domPages = document.createElement('span');
        let domRemove = document.createElement('button');
        //Add Classes & Data
        domBook.classList += " book";
        domTitle.classList += " title";
        domAuthor.classList += "author";
        domPages.classList += "pages";
        domRead.classList += book.isRead ? " read" : " notRead";
        domRemove.classList += "remove"; 
        domBook.setAttribute("data-id", book.id);                  
        //Add innerHTML
        domTitle.innerHTML = book.title;
        domAuthor.innerHTML = book.author;
        domPages.innerHTML = book.pages;
        domRead.innerHTML = book.isRead ? "&#10003;" : "X";
        domRemove.innerHTML = "X"
        //Add event listeners
        domRemove.addEventListener("click", (e)=>{
            myLibrary = myLibrary.filter(book => book.id != e.target.parentElement.dataset.id);
            render();
        });
        domRead.addEventListener("click", (e)=>{
            myLibrary.forEach(bookID=>{
                if(bookID.id == e.target.parentElement.dataset.id){
                    bookID.readBook();
                }
            })
            render();
        });
        //append children
        domBook.appendChild(domTitle);
        domBook.appendChild(domAuthor);
        domBook.appendChild(domRead);
        domBook.appendChild(domPages);
        domBook.appendChild(domRemove);
        bookshelf.appendChild(domBook);

        //add to firebase
        firestore.collection("library").doc(book.id.toString()).set({
            title: book.title,
            author: book.author,
            pages: book.pages,
            isRead: book.isRead,
            id: book.id
        })
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.log("Error writing document: ", error);
        });
    });
}

//Test JS

//render();