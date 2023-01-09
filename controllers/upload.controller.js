const User = require('../model/user.model');

module.exports.uploadProfil = (req, res) =>{
    
    try{
        User.findOneAndUpdate(
            {_id:req.params.id},
            { picture: `uploads/profil/${req.params.id}.jpg`},
            {new: true, upsert: true, setDefaultsOnInsert: true},
            (err, docs) =>{
                if(!err) return(res.status(200).json(docs));
                else return res.status(500).json(err);
            }
        );
    }
    catch(err){
        return res.status(500).json(err);
    }

}
