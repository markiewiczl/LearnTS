import { Book } from "../entity/Book";
export declare class BookResolver {
    books(): Promise<Book[]>;
    bookByName(name: string): Promise<Book | null>;
    createBook(name: string, author: string): Promise<Book>;
    deleteBook(id: string): Promise<boolean>;
    updateBook(id: Number, name: string, author: string): Promise<boolean>;
}
//# sourceMappingURL=book.d.ts.map