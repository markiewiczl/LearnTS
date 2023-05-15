import express, { Request, Response, Express } from "express";
import { AppDataSource } from "./data-source";
import { Book } from "./entity/Book";
import { BookResolver } from "./Reolvers/book";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

const main = async () => {
    const swaggerUi = require('swagger-ui-express');
    const YAML = require('yamljs');
    const swaggerDocument = YAML.load('swagger.yaml');

    const app: Express = express();
    const bodyParser = require('body-parser');
    const port = process.env.PORT || 3000;
    app.use(bodyParser.json());
    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true }));

    const book = AppDataSource.getRepository(Book);

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [BookResolver],
            validate: false,
        }),
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app });

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
        if ('http://localhost:' + port + currentPageUrl === previousPageUrl) {
            // @ts-ignore
            bookUpdated.name = req.body.name;

            // @ts-ignore
            bookUpdated.author = req.body.author;

            await AppDataSource.manager.save(bookUpdated);

            res.redirect("/");
        }

        return res.render('update_book.ejs', {
            book: bookUpdated,
            id: req.params.id,
            dupa: currentPageUrl,
            dupa2: previousPageUrl
        });
    });

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    app.get('/api/books', async (req: Request, res: Response) => {
        const books = await book.find();

        res.json(books);
    });

    app.get('/api/books/:name', async (req: Request, res: Response) => {

        const books = await book.find();

        const searchedBook = books.find(b => b.name === req.params.name);
        if (searchedBook) {
            res.json(searchedBook);
        } else {
            res.status(404).send('Book not found');
        }
    });

    app.post('/api/books', async (req: Request, res: Response) => {
        const books = await book.find();

        const newBook: Book = req.body;
        books.push(newBook);
        await book.save(newBook);
        res.json(newBook);
    });

    app.put('/api/books/:id', async (req: Request, res: Response) => {
        const bookId = req.params.id;
        const { name, author } = req.body;

            // @ts-ignore
            const books = await book.findOneBy({id:bookId});
            if(books) {
                books.name = name || books.name;
                books.author = author || books.author;

                await book.save(books);
                res.send(books);
            } else {
                res.status(404).send('Book not found');
            }
    });

    app.delete('/api/books/:name', async (req: Request, res: Response) => {
        const books = await book.find();

        const deletedBook = await book.delete({ name: req.params.name });
        if (deletedBook) {
            res.json(deletedBook);
        } else {
            res.status(404).send('Book not found');
        }
    });


    app.listen(port, () => {
        console.log("App is running")
    })
}

main()