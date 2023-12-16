// eternal modules
require('dotenv').config()
require("express-async-errors");
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

// own modules
const connectDB = require('./db/connect');
const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require("./middleware/error-handler")

const moviesRouter = require('./routes/movies')
const roomsRouter = require('./routes/rooms')
const screeningsRouter = require('./routes/screenings')

// swagger
const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Cinema API",
            version: "1.0.0",
            description: "A simple CRUD Cinema API.",
            contact: {
                name: "Miłosz Kotarba",
                email: "msiuda9@gmail.com"
            }
        }
    },
    apis: ["./routes/*.js"],
}

const specs = swaggerJsDoc(options)

// express init
const app = express()

// middleware
app.use(express.json())
app.use(morgan('dev'))

// routes
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use('/api/v1/movies', moviesRouter)
app.use('/api/v1/rooms', roomsRouter)
app.use('/api/v1/screenings', screeningsRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

// server init
const PORT = process.env.PORT || 3000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, () => console.log(`Server is listening on PORT: ${PORT}`));
    } catch (error) {
        console.log(error)
    }
}

start()
