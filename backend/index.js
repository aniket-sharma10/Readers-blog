const express = require('express')
const path = require('path')
const connectDB = require('./db/connect')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('express-async-errors')

// const __dirname = path.resolve();
const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

// routers
const userRoute = require('./routes/user-route')
const authRoute = require('./routes/auth-route')
const postRoute = require('./routes/post-route')
const commentRoute = require('./routes/comment-route')

// error handler
const notFoundMiddleware = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/error-handler');


app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/post', postRoute)
app.use('/api/comment', commentRoute)

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


// middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = 3000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port ${port}..`))
    } catch (error) {
        console.log(error)
    }
}

start()