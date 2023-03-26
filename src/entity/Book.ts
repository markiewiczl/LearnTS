import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Book {

    @PrimaryGeneratedColumn()
    id: number | undefined

    @Column({ type: 'varchar', nullable: true })
    name: string | undefined

    @Column({ type: 'varchar', nullable: true })
    author: string | undefined

}
