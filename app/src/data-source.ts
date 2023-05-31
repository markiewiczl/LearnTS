import "reflect-metadata"
import { DataSource } from "typeorm"
import { Book } from "./entity/Book"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 4306,
    username: "luke",
    password: "4112",
    database: "node_js",
    synchronize: true,
    logging: false,
    entities: [Book],
    migrations: [],
    subscribers: [],
})

AppDataSource.initialize()
    .then(() => {
    })
    .catch((error) => console.log(error))
