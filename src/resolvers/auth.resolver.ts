import { IsEmail, Length } from "class-validator"; //sirve para hacer validaciones del tipo de datos que queremos ingresen a la base y las inconsistencias que podrían generar 
import { Arg, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";
import { getRepository, Repository } from "typeorm";
import { User } from "../entity/user.entity";
import { hash, compareSync } from 'bcryptjs'; //esta librería sirve para encriptar. En este caso vamos a usarlo para encriptar la password
import { sign } from "jsonwebtoken";
import { environment } from '../config/environment';

@InputType()
class UserInput {

    @Field()
    @Length(3, 64)
    fullName!: string

    @Field()
    @IsEmail()
    email!: string

    @Field()
    @Length(8, 254)
    password!: string

}

@InputType()
class LoginInput {

    @Field()
    @IsEmail() //validación de que es un mail
    email!: string;

    @Field()
    password!: string;
}

@ObjectType() //Es Object porque no es un Input sino una Response
class LoginResponse {

    @Field()
    userId!: number;

    @Field()
    jwt!: string;
}

@Resolver()
export class AuthResolver {
  userRepository: Repository<User>;

  constructor() {
    this.userRepository = getRepository(User);
  }

  //Clase para regisrar un usuario
  @Mutation(() => User)
  async register(
    @Arg("input", () => UserInput) input: UserInput
  ): Promise<User | undefined> {
    try {
      const { fullName, email, password } = input;

      const userExists = await this.userRepository.findOne({
        where: { email },
      });

      if (userExists) {
        const error = new Error();
        error.message = "Email is not available";
        throw error;
      }

      const hashedPassword = await hash(password, 10); //hash: Sirve para hashear la contraseña

      const newUser = await this.userRepository.insert({
        fullName,
        email,
        password: hashedPassword,
      });

      return this.userRepository.findOne(newUser.identifiers[0].id);
    } catch (error) {
      //throw new Error(error.message)
      throw error;
    }
  }

  //Clase para realizar el login
  @Mutation(() => LoginResponse)
  async login(@Arg("input", () => LoginInput) input: LoginInput) {
    try {
      const { email, password } = input;

      const userFound = await this.userRepository.findOne({
        where: { email },
      });

      if (!userFound) {
        const error = new Error();
        error.message = "Invalid credentials";
        throw error;
      }

      const isValidPasswd: boolean = compareSync(password, userFound.password); //compareSync: sirve para comparar la contraseña cargada con la registrada hasheada
      //compare es una método asíncrono y compareSync es un método síncrono

      if (!isValidPasswd) {
        const error = new Error();
        error.message = "Invalid credentials";
        throw error;
      }

      const jwt: string = sign(
        //Acá se genera un token
        { id: userFound.id },
        environment.JWT_SECRET
      );

      return {
        userId: userFound.id,
        jwt: jwt,
      };
    } catch (error) {
      //throw new Error(error.message)
      throw error;
    }
  }
}