/**
 * 使用类进行面向对象编程
 */
class Book{
    constructor(title, pages, isbn) {
        this.title = title;
        this.pages = pages;
        this.isbn = isbn;
    }
    printIsbn(){
        console.log(this.isbn);
    }
}

let book = new Book('title', 'pag', 'cc');
book.printIsbn();