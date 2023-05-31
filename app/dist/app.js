"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var data_source_1 = require("./data-source");
var Book_1 = require("./entity/Book");
var book_1 = require("./Reolvers/book");
var apollo_server_express_1 = require("apollo-server-express");
var type_graphql_1 = require("type-graphql");
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var swaggerUi, YAML, swaggerDocument, app, bodyParser, port, book, apolloServer, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                swaggerUi = require('swagger-ui-express');
                YAML = require('yamljs');
                swaggerDocument = YAML.load('swagger.yaml');
                app = (0, express_1.default)();
                bodyParser = require('body-parser');
                port = process.env.PORT || 3001;
                app.use(bodyParser.json());
                app.set('view engine', 'ejs');
                app.use(bodyParser.urlencoded({ extended: true }));
                book = data_source_1.AppDataSource.getRepository(Book_1.Book);
                _a = apollo_server_express_1.ApolloServer.bind;
                _b = {};
                return [4 /*yield*/, (0, type_graphql_1.buildSchema)({
                        resolvers: [book_1.BookResolver],
                        validate: false,
                    })];
            case 1:
                apolloServer = new (_a.apply(apollo_server_express_1.ApolloServer, [void 0, (_b.schema = _c.sent(),
                        _b)]))();
                return [4 /*yield*/, apolloServer.start()];
            case 2:
                _c.sent();
                apolloServer.applyMiddleware({ app: app });
                app.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var books;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, book.find()];
                            case 1:
                                books = _a.sent();
                                if (!books) {
                                    return [2 /*return*/, res.status(404).send('Book not found')];
                                }
                                return [2 /*return*/, res.render('index', { books: books })];
                        }
                    });
                }); });
                app.post('/add', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var newBook, name, author, books;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                newBook = new Book_1.Book();
                                name = req.body.name;
                                author = req.body.author;
                                console.log(name, author);
                                newBook.name = name;
                                newBook.author = author;
                                return [4 /*yield*/, data_source_1.AppDataSource.manager.save(newBook)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, book.find()];
                            case 2:
                                books = _a.sent();
                                if (!books) {
                                    return [2 /*return*/, res.status(404).send('Book not found')];
                                }
                                return [2 /*return*/, res.render('index', { books: books })];
                        }
                    });
                }); });
                app.post('/delete/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var bookRepository, bookRemoved, books;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                bookRepository = data_source_1.AppDataSource.getRepository(Book_1.Book);
                                return [4 /*yield*/, bookRepository.findOneBy({ id: req.params.id })];
                            case 1:
                                bookRemoved = _a.sent();
                                if (!(bookRemoved === null || bookRemoved === void 0 ? void 0 : bookRemoved.id)) return [3 /*break*/, 3];
                                return [4 /*yield*/, bookRepository.remove(bookRemoved)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3: return [4 /*yield*/, book.find()];
                            case 4:
                                books = _a.sent();
                                if (!books) {
                                    return [2 /*return*/, res.status(404).send('Book not found')];
                                }
                                return [2 /*return*/, res.render('index', { books: books })];
                        }
                    });
                }); });
                app.post('/update/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var bookRepository, bookUpdated, currentPageUrl, previousPageUrl;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                bookRepository = data_source_1.AppDataSource.getRepository(Book_1.Book);
                                return [4 /*yield*/, bookRepository.findOneBy({ id: req.params.id })];
                            case 1:
                                bookUpdated = _a.sent();
                                currentPageUrl = req.url;
                                previousPageUrl = req.headers.referer || '/';
                                if (!('http://localhost:' + port + currentPageUrl === previousPageUrl)) return [3 /*break*/, 3];
                                // @ts-ignore
                                bookUpdated.name = req.body.name;
                                // @ts-ignore
                                bookUpdated.author = req.body.author;
                                return [4 /*yield*/, data_source_1.AppDataSource.manager.save(bookUpdated)];
                            case 2:
                                _a.sent();
                                res.redirect("/");
                                _a.label = 3;
                            case 3: return [2 /*return*/, res.render('update_book.ejs', {
                                    book: bookUpdated,
                                    id: req.params.id,
                                    dupa: currentPageUrl,
                                    dupa2: previousPageUrl
                                })];
                        }
                    });
                }); });
                app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
                app.get('/api/books', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var books;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, book.find()];
                            case 1:
                                books = _a.sent();
                                res.json(books);
                                return [2 /*return*/];
                        }
                    });
                }); });
                app.get('/api/books/:name', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var books, searchedBook;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, book.find()];
                            case 1:
                                books = _a.sent();
                                searchedBook = books.find(function (b) { return b.name === req.params.name; });
                                if (searchedBook) {
                                    res.json(searchedBook);
                                }
                                else {
                                    res.status(404).send('Book not found');
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
                app.post('/api/books', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var books, newBook;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, book.find()];
                            case 1:
                                books = _a.sent();
                                newBook = req.body;
                                books.push(newBook);
                                return [4 /*yield*/, book.save(newBook)];
                            case 2:
                                _a.sent();
                                res.json(newBook);
                                return [2 /*return*/];
                        }
                    });
                }); });
                app.put('api/books/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var bookId, _a, name, author, books, error_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                bookId = req.params.id;
                                _a = req.body, name = _a.name, author = _a.author;
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 4, , 5]);
                                return [4 /*yield*/, book.findOneOrFail(bookId)];
                            case 2:
                                books = _b.sent();
                                books.name = name || books.name;
                                books.author = author || books.author;
                                return [4 /*yield*/, book.save(books)];
                            case 3:
                                _b.sent();
                                res.send(book);
                                return [3 /*break*/, 5];
                            case 4:
                                error_1 = _b.sent();
                                console.error(error_1);
                                res.status(404).send({ message: 'Book not found' });
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
                app.delete('/api/books/:name', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var books, bookIndex, deletedBook;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, book.find()];
                            case 1:
                                books = _a.sent();
                                bookIndex = books.findIndex(function (b) { return b.name === req.params.name; });
                                if (!(bookIndex !== -1)) return [3 /*break*/, 3];
                                deletedBook = books.splice(bookIndex, 1)[0];
                                return [4 /*yield*/, book.save(books)];
                            case 2:
                                _a.sent();
                                res.json(deletedBook);
                                return [3 /*break*/, 4];
                            case 3:
                                res.status(404).send('Book not found');
                                _a.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                app.listen(port, function () {
                    console.log("App is running");
                });
                return [2 /*return*/];
        }
    });
}); };
main();
//# sourceMappingURL=app.js.map