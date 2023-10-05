import express from "express"
import path from "path"
import { startApolloServer } from "./server"
import './database'
import router from "./routes"
import { createRoles, createAdmin } from "./lib/initialSetup"

const init = async () => {
    const app = await startApolloServer()
    await createRoles()
    await createAdmin()
    app.set('view engine', 'pug')
    app.set('views', path.join(__dirname, 'views'))
    app.use(express.static(path.join(__dirname, 'public')))
    app.use('/api', router)
}

init()