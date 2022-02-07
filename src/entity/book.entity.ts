import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Author } from './author.entity';
import { Field, ObjectType } from 'type-graphql';

//En los archivos entity creo el modelo de cada tabla de la base de datos como una clase que será del tipo objeto.


@ObjectType()
@Entity()
export class Book {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field()
    @Column()
    title!: string

    @Field(() => Author)
    @ManyToOne(() => Author, author => author.books, { onDelete: 'CASCADE' })
    author!: Author

    @Field()
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string
}