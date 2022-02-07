import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Book } from './book.entity';
import { Field, ObjectType } from 'type-graphql';

//En los archivos entity creo el modelo de cada tabla de la base de datos como una clase que será del tipo objeto.


@ObjectType()
@Entity()
export class Author {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field(() => String)
    @Column()
    fullName!: string

    @Field(() => [Book], { nullable: true })
    @OneToMany(() => Book, book => book.author, { nullable: true, onDelete: 'CASCADE' })
    books!: Book[]

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string
}