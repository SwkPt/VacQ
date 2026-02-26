const { setServers } = require("node:dns/promises");
setServers(["1.1.1.1", "8.8.8.8"]);
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const mongoSanitize = require('@exortek/express-mongo-sanitize');
const helmet = require('helmet');
const {xss}=require('express-xss-sanitizer');
const rateLimit=require('express-rate-limit');
const hpp=require('hpp');
const cors=require('cors');



dotenv.config({path:'./config/config.env'});

connectDB();

const hospitals = require('./routes/hospitals');
const appointments =require('./routes/appointments');
const auth = require('./routes/auth');




const app=express();
app.set('query parser', 'extended');
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());
app.use(cookieParser());
app.use(xss());

const limiter=rateLimit({
    windowMs:10*60*1000,//10 mins
    max: 100
});

app.use(limiter);
app.use(hpp());
app.use(cors());



app.use('/api/v1/hospitals',hospitals);
app.use('/api/v1/auth',auth);
app.use('/api/v1/appointments', appointments);


const PORT=process.env.PORT || 5000;
const Server =  app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV,' mode on port ', PORT ));

process.on('unhandledRejection', (err,promise) =>{
    console.log(`Error: ${err.message}`);
    Server.close(()=>process.exit(1));
} );