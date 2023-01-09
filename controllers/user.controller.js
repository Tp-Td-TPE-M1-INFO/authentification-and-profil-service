const User = require('../model/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getUsers = async (req, res) => {
    try{
        users = await User.find()
        res.status(200).json(users)
    }
    catch(err){
        res.status(400).json(err);
        
    }
}

module.exports.userInfo = async (req, res) =>{
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id unknown :'+ req.params.id);
    try{
        const user = await User.findOne({_id: req.params.id});
        res.status(200).json(user);
    }
    catch(err){
        res.status(400).json(err);
    }
};

module.exports.updateUser = (req, res) =>{
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id unknown :'+ req.params.id);

        const user = new User({
            _id : req.params.id,
            surname : req.body.surname,
            name : req.body.name,
            username: req.body.username,
            about: req.body.about,
        });

    User.updateOne({_id: req.params.id}, user)
        .then(() => res.status(200).json(user))
        .catch(err => res.status(400).json(err));
};

module.exports.deleteUser = (req, res) =>{
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('Id unknown :'+ req.params.id);
    User.deleteOne({_id: req.params.id})
        .then(user => res.status(200).json(user))
        .catch(err => res.status(400).json(err));
};

module.exports.addContact = (req, res) =>{
    if(!ObjectID.isValid(req.params.id) ||!ObjectID.isValid(req.body.idContact))
        return res.status(400).send('Id unknown :'+ req.params.id);

    try{
        User.findByIdAndUpdate(
            req.params.id,
            {$addToSet : {contacts: req.body.idContact}},
            {new: true, upsert: true},
            (err, docs) =>{
                if(!err) return res.status(200).json(docs);
                else return res.status(400).json(err);
            }
        );
    }
    catch(err){
        res.status(400).json({ message: err})
    }
}; 

module.exports.listContacts = async (req, res) =>{
    try{
        const user = await User.findOne({_id: req.params.id})
        let contacts = []
        for(i in user.contacts)
        {
            let contact = await User.findOne({_id:user.contacts[i]});
            console.log(i),
            console.log(contact)
            contacts.push(contact);
        }
        res.status(200).json(contacts);
    }
    catch(err){
        res.status(400).json(err);
    }
}