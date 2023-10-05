import express from 'express'
import { createServer } from 'http'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import { typeDefs, resolvers } from './graphql/schema'
import { PORT } from './config/env'

export const startApolloServer = async () => {
    // Server
    const app = express()
    const httpServer = createServer(app)

    // Apollo Server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
    })

    // Start server
    await server.start()

    // Apply Middlewares
    app.use(
        '/graphql', 
        cors<cors.CorsRequest>(), 
        express.json(), 
        expressMiddleware(server, {
            context: async ({ req }) => ({ token: req.headers.authorization })
        })
    )
    app.use(cors())

    // app Settings
    app.set('port', PORT ?? 5000)

    // httpServer Start
    httpServer.listen(app.get('port'), () => {
        console.log(`Server running on port ${app.get('port')}`)
    })

    return app
}