const express = require('express');
require ('dotenv').config({path:'./config/.env'});
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRooutes = require('./routes/user.routes')
require('./config/db');
const app = express();
const {checkUser, requireAuth} = require('./middleware/auth.middleware');

//jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) =>{
   res.status(200).send(res.locals.user._id)
})

//parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());


// m
app.use('/api/user/', userRooutes);


//listen
app.listen(process.env.PORT, ()=>{
    console.log(`listen on port ${process.env.PORT}`);
})