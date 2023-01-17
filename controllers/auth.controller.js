const User = require('../model/user.model');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const maxAge = 365 * 24 * 60 * 60 * 1000;

const createToken = (id) =>{
    return jwt.sign({id}, process.env.TOKEN_SECRET,{
        expiresIn: maxAge
    })
};

const signUpErrors=(err) => {
    let errors = { username: '', password: '', phone:''};
    
    if(err.message.includes('username'))
        errors.username = " nom d'utilisateur incorrect ou déjà pris";
  
    if(err.message.includes('password'))
        errors.password = " the password must content 6 charater";
        
    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes("username"))
        errors.username = "this user name is already exit";

    if(err.code === 11000 && Object.keys(err.keyValue)[0].includes("phone"))
        errors.username = "this phone number is already exit";
    return errors;

}

module.exports.signUp = async (req, res) =>{
   const { surname, name, username, phone, password} = req.body;
    try {
        const user = await User.create({surname, name, username, phone, password});
        res.status(201).json({ user: user});
    }
    catch(err){
        const errors = signUpErrors(err);
        res.status(400).json(errors);  
    }
};

module.exports.signIn = async (req, res) =>{
    const { username, password} = req.body;

    try{
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge});
        res.status(200).json({user});
    }
    catch(err){
        return res.status(401).json({message:"paire nom d'utiliasateur/mot de passe incorrecte"});
    }
};

module.exports.logout = async (req, res) =>{
    res.cookie('jwt', '',{maxAge: 1});
    res.redirect('/');
};