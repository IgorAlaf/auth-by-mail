import express from 'express'
import { config } from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import errorMiddleware from './middleware/error.middleware.js'
config()
import userRouter from './routes/user.router.js'
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.URL_CLIENT,
    credentials: true
  })
)
app.use('/api', userRouter)
app.use(errorMiddleware)

async function start() {
  try {
    await mongoose.connect(process.env.URI_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    app.listen(process.env.PORT, () =>
      console.log(`Server work on ${process.env.PORT}`)
    )
  } catch (e) {
  } finally {
  }
}

start()
