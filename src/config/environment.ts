import dotenv from 'dotenv';

dotenv.config()

export const environment = {
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    JWT_SECRET: process.env.JWT_SECRET || 'Default', //|| Sirve para indicar que puede venir otro tipo de dato y en este caso le decimos que cuando
                                                    //ello ocurra se devuelva el 'Default'. JWT_SECRET es la palabra secreta
}