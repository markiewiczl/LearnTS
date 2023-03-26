import {Request, Response} from "express";
import {AppDataSource} from "./data-source";
import {Book} from "./entity/Book";


const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const util = require("util");
const port = process.env.PORT || 3002;
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const name = null;
const author = null;

const book = AppDataSource.getRepository(Book);

app.get('/', async (req: Request, res: Response) => {
    const books = await book.find();

    if (!books) {
        return res.status(404).send('Book not found');
    }

    return res.render('index', {books: books});
});

app.post('/add', async (req: Request, res: Response) => {
    const newBook = new Book();
    const name = req.body.name;
    const author = req.body.author;
    console.log(name, author)
    newBook.name = name
    newBook.author = author
    await AppDataSource.manager.save(newBook);

    const books = await book.find();

    if (!books) {
        return res.status(404).send('Book not found');
    }

    return res.render('index', {books: books});
});

app.post('/delete/:id', async (req: Request, res: Response) => {

    const bookRepository = AppDataSource.getRepository(Book)
    // @ts-ignore
    const bookRemoved = await bookRepository.findOneBy({id: req.params.id})
    if (bookRemoved?.id)
    await bookRepository.remove(bookRemoved)

    const books = await book.find();

    if (!books) {
        return res.status(404).send('Book not found');
    }

    return res.render('index', {books: books});
});

app.post('/update/:id', async (req: Request, res: Response) => {

    const bookRepository = AppDataSource.getRepository(Book)
    // @ts-ignore
    const bookUpdated = await bookRepository.findOneBy({id: req.params.id})
    const currentPageUrl = req.url;
    const previousPageUrl = req.headers.referer || '/';
    if ('http://localhost:'+ port + currentPageUrl === previousPageUrl) {
        // @ts-ignore
        bookUpdated.name = req.body.name;

        // @ts-ignore
        bookUpdated.author = req.body.author;

        await AppDataSource.manager.save(bookUpdated);

        res.redirect("/");
    }

    return res.render('update_book.ejs', {book: bookUpdated, id: req.params.id, dupa: currentPageUrl, dupa2: previousPageUrl});
});

app.listen(port, () => {
    console.log("App is running")
})