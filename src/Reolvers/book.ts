import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Book } from "../entity/Book";
import { AppDataSource } from "../data-source";

@Resolver()
export class BookResolver {

    @Query(() => [Book])
    async books() {
        const bookRepository = AppDataSource.getRepository(Book);
        return await bookRepository.find();
    }

    @Query(() => Book, { nullable: true })
    async bookByName(@Arg("name") name: string) {
        const bookRepository = AppDataSource.getRepository(Book);
        return await bookRepository.findOne({ where: { name } });
    }

    @Mutation(() => Book)
    async createBook(
        @Arg("name") name: string,
        @Arg("author") author: string
    ) {
        const bookRepository = AppDataSource.getRepository(Book);
        const book = new Book();
        book.name = name;
        book.author = author;
        return await bookRepository.save(book);
    }

    @Mutation(() => Boolean)
    async deleteBook(@Arg("id") id: string) {
        const bookRepository = AppDataSource.getRepository(Book);
        // @ts-ignore
        const book = await bookRepository.findOneBy({id:id});
        if (!book) return false;
        await bookRepository.remove(book);
        return true;
    }

    @Mutation(() => Boolean)
    async updateBook(
        @Arg("id") id: Number,
        @Arg("name", { nullable: true }) name: string,
        @Arg("author", { nullable: true }) author: string
    ) {
        const bookRepository = AppDataSource.getRepository(Book);
        // @ts-ignore
        const book = await bookRepository.findOneBy({id:id});
        if (!book) return false;
        if (name) book.name = name;
        if (author) book.author = author;
        await bookRepository.save(book);
        return true;
    }
}
