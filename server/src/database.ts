import mongoose from 'mongoose'
import { MONGO_DB_URI } from './config/env'

mongoose.set('strictQuery', false)
mongoose.connect(MONGO_DB_URI)
.then(() => console.log('DB is connected'))
.catch(error => {
    console.error(error)
    process.exit(1)
})  