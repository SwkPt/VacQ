const { setServers } = require("node:dns/promises");
setServers(["1.1.1.1", "8.8.8.8"]);
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db')

dotenv.config({path:'./config/config.env'});

connectDB();

const hospitals = require('./routes/hospitals');
const auth = require('./routes/auth');

const app=express();

app.use(express.json())

app.use('/api/v1/hospitals',hospitals);
app.use('/api/v1/auth',auth);

const PORT=process.env.PORT || 5000;
const Server =  app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV,' mode on port ', PORT ));

process.on('unhandledRejection', (err,promise) =>{
    console.log(`Error: ${err.message}`);
    Server.close(()=>process.exit(1));
} )