import express from 'express';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import { BookResolver } from './resolvers/book.resolver';
import { AuthorResolver } from './resolvers/author.resolver';
import { AuthResolver } from './resolvers/auth.resolver';



export async function startServer() {
  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [BookResolver, AuthorResolver, AuthResolver],
    }),
    context: ({ req, res }) => ({ req, res }), //El contexto es aquello que le vamos a pasar a nuestra aplicación
  }); //y que va a estar disponible para todos los Resolvers.
  // De req vamos a poder obtener los headers y dentro de los headers los headers de autorización

  apolloServer.applyMiddleware({ app, path: "/graphql" });

  return app;
};  