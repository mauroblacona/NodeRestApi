require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose');


//CONNECT DB
mongoose.connect(process.env.DATABASE_URL, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('connected to db'))


app.use(express.json());


//IMPORT ROUTES
const subscribersRouter = require('./routes/subscribers');
app.use('/subscribers', subscribersRouter);

const authRoute = require('./routes/auth');
app.use('/api/user', authRoute);



//PORT LISTEN
app.listen(3000, () => console.log('Server Started'));

