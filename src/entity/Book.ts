import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import {Field, ID, InputType, ObjectType} from 'type-graphql';

@Entity()
@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export class Book {

    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number | undefined

    @Column({ type: 'varchar', nullable: true })
    @Field(() => String)
    name: string | undefined

    @Column({ type: 'varchar', nullable: true })
    @Field(() => String)
    author: string | undefined

}
