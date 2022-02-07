import { MiddlewareFn } from 'type-graphql';
import { verify } from 'jsonwebtoken'; //verify es un método va a hacer un decode de nuestro token y chequear que el usario sea el correcto
import { Response, Request } from 'express';
import { environment } from '../config/environment';

export interface IContext { //es convención colocar una I mayúscula al comienzo del nombre de la interface
    req: Request,
    res: Response,
    payload: { userId: string }
};

export const isAuth: MiddlewareFn<IContext> = ({ context }, next) => {

    try {
        const bearerToken = context.req.headers["authorization"];

        if (!bearerToken) {
            throw new Error('Unauthorized');
        };

        const jwt = bearerToken.split(" ")[1];
        const payload = verify(jwt, environment.JWT_SECRET);//para verificar le tenemos que pasar el token y la palabra secreta
        context.payload = payload as any;

    } catch (e) {
        //throw new Error(e);
        throw e
    }

    return next(); //next continua con la ejecución del programa

}